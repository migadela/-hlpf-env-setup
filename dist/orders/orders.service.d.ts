import { Repository, DataSource } from 'typeorm';
import type { Cache } from 'cache-manager';
import { Order } from './entities/order.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly productRepo;
    private readonly dataSource;
    private readonly cacheManager;
    constructor(orderRepo: Repository<Order>, productRepo: Repository<Product>, dataSource: DataSource, cacheManager: Cache);
    create(dto: CreateOrderDto, userId: number): Promise<Order>;
    findAll(query: OrderQueryDto, userId: number, role: string): Promise<{
        data: Order[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: number, userId: number, role: string): Promise<Order>;
    updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private clearProductsCache;
}
