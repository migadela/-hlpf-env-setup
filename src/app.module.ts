import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

import { CreateUsers1777574341432 } from './migrations/1777574341432-CreateUsers';
import { AddIsActiveToProducts1775672009619 } from './migrations/1775672009619-AddIsActiveToProducts';
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';
import { CreateTables1700000001000 } from './migrations/1700000001000-CreateTables';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { CreateOrders1779696351188 } from './migrations/1779696351188-CreateOrders';

// Імпортуємо наш новий модуль замовлень
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT as string, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Category, Product, User, Order, OrderItem],
      synchronize: false,
      migrationsRun: true,
      migrations: [
        CreateTables1700000001000,
        AddIsActiveToProducts1775672009619,
        CreateUsers1777574341432,
        CreateOrders1779696351188,
      ],
    }),

    // --- НАЙБІЛЬШ НАДІЙНИЙ ФОРМАТ ПІДКЛЮЧЕННЯ REDIS ---
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: 'redis://redis:6379',
          ttl: 300000, 
        }),
      }),
    }),

    CategoriesModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    OrdersModule, // <-- ОСЬ ТУТ МИ ЙОГО ПІДКЛЮЧИЛИ ДО СИСТЕМИ!
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}