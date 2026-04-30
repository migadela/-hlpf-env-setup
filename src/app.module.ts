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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  entities: [Category, Product, User],
  synchronize: false,	// ВИМКНЕНО! Тільки міграції
  migrationsRun: true,   // автоматично запускати міграції при старті
  migrations: [CreateTables1700000001000, AddIsActiveToProducts1775672009619, CreateUsers1777574341432],
}),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: parseInt(configService.get<string>('REDIS_PORT') as string, 10),
          },
        }),
      }),
      inject: [ConfigService],
    }),
CategoriesModule,
ProductsModule,
UsersModule,
AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}