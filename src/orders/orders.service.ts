import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// 1. Додаємо слово 'type', щоб заспокоїти isolatedModules
import type { Cache } from 'cache-manager'; 

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateOrderDto, userId: number): Promise<Order> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const item of dto.items) {
        const product = await qr.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product #${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}": available ${product.stock}, requested ${item.quantity}`,
          );
        }

        product.stock -= item.quantity;
        await qr.manager.save(product);

        const orderItem = qr.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          price: product.price,
        });
        orderItems.push(orderItem);

        totalPrice += Number(product.price) * item.quantity;
      }

      const order = qr.manager.create(Order, {
        user: { id: userId } as any,
        items: orderItems,
        totalPrice,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await qr.manager.save(order);
      await qr.commitTransaction();

      await this.clearProductsCache();
      return savedOrder;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async findAll(query: OrderQueryDto, userId: number, role: string) {
    const { page = 1, pageSize = 10, status } = query;
    
    // Створюємо базовий запит до таблиці orders
    const queryBuilder = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('order.user', 'user'); // Щоб бачити, хто замовив

    // БЕЗПЕКА: Якщо це ЗВИЧАЙНИЙ користувач, фільтруємо замовлення лише за його ID
    if (role !== 'admin') {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    // Фільтрація за статусом (якщо передано у Query параметрах)
    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    // Пагінація та сортування (спочатку нові замовлення)
    queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number, userId: number, role: string): Promise<Order> {
  const order = await this.orderRepo.findOne({
    where: { id },
    relations: ['items', 'items.product', 'user'],
  });

  if (!order) {
    throw new NotFoundException(`Order #${id} not found`);
  }

  if (role !== 'admin' && order.user.id !== userId) {
    throw new ForbiddenException('You do not have permission to view this order'); // <-- Ось наша 403 помилка!
  }

  return order;
}

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    // 1. Отримуємо замовлення з усіма зв'язками (items та products)
    const order = await this.findOne(id, 0, 'admin');

    const currentStatus = order.status;
    const newStatus = updateOrderStatusDto.status;

    if (currentStatus === newStatus) {
      return order; // Статус не змінився, нічого не робимо
    }

    
    // 2. Логіка дозволених переходів (State Machine)
    const allowedTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [] as OrderStatus[], // <--- Додаємо тут
      [OrderStatus.CANCELLED]: [] as OrderStatus[], // <--- І тут
    };

    const possibleNextStatuses = allowedTransitions[currentStatus];

    // Якщо перехід заборонений — кидаємо помилку 400
    if (!possibleNextStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot change order status from '${currentStatus}' to '${newStatus}'`,
      );
    }

    // 3. БОНУСНЕ ЗАВДАННЯ: Повернення stock при скасуванні (CANCELLED)
    if (newStatus === OrderStatus.CANCELLED) {
      const qr = this.dataSource.createQueryRunner();
      await qr.connect();
      await qr.startTransaction();

      try {
        for (const item of order.items) {
          // Шукаємо продукт і повертаємо йому stock
          const product = await qr.manager.findOne(Product, { where: { id: item.product.id } });
          if (product) {
            product.stock += item.quantity;
            await qr.manager.save(product);
          }
        }
        
        // Зберігаємо новий статус замовлення
        order.status = newStatus;
        const savedOrder = await qr.manager.save(order);
        
        await qr.commitTransaction();
        await this.clearProductsCache(); // Очищаємо кеш, бо залишки змінилися
        
        return savedOrder;
      } catch (error) {
        await qr.rollbackTransaction();
        throw error;
      } finally {
        await qr.release();
      }
    }

    // 4. Якщо це звичайна зміна статусу (наприклад на confirmed або shipped)
    order.status = newStatus;
    return this.orderRepo.save(order);
  }

  async remove(id: number): Promise<{ message: string }> {
    // Перевіряємо, чи існує замовлення взагалі
    const order = await this.findOne(id, 0, 'admin');

    // Видаляємо його з бази
    await this.orderRepo.remove(order);

    return { message: `Order #${id} has been successfully removed` };
  }

  // 2. Універсальний спосіб інвалідації для будь-якої версії cache-manager
  private async clearProductsCache() {
    try {
      // Приводимо cacheManager до типу any, щоб обійти сувору перевірку типів
      const cacheStore = (this.cacheManager as any).store;
      if (cacheStore && typeof cacheStore.keys === 'function') {
        const keys: string[] = await cacheStore.keys('products:*');
        if (keys.length > 0) {
          await Promise.all(keys.map((k) => this.cacheManager.del(k)));
        }
      }
    } catch (e) {
      // Ігноруємо помилки, якщо Redis тимчасово недоступний
    }
  }
}