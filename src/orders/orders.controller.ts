import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'; 
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator'; 
import { Roles } from '../common/decorators/roles.decorator'; 
import { Role } from '../common/enums/role.enum'; 

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Створити замовлення' })
  create(
    @Body() createOrderDto: CreateOrderDto, 
    @CurrentUser('sub') userId: number
  ) {
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Мої замовлення (user) / Всі (admin)' })
  findAll(
    @Query() query: OrderQueryDto, 
    @CurrentUser('sub') userId: number, 
    @CurrentUser('role') role: string 
  ) {
    return this.ordersService.findAll(query, userId, role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Одне замовлення (ownership check)' })
  findOne(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser('sub') userId: number, 
    @CurrentUser('role') role: string
  ) {
    return this.ordersService.findOne(id, userId, role);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN) 
  @ApiOperation({ summary: 'Змінити статус' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN) 
  @ApiOperation({ summary: 'Видалити замовлення' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}