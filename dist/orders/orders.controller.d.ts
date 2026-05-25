import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, userId: number): Promise<import("./entities/order.entity").Order>;
    findAll(query: OrderQueryDto, userId: number, role: string): Promise<{
        data: import("./entities/order.entity").Order[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: number, userId: number, role: string): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("./entities/order.entity").Order>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
