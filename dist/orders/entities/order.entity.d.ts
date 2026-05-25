import { User } from '../../users/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../../common/enums/order-status.enum';
export declare class Order {
    id: number;
    status: OrderStatus;
    totalPrice: number;
    user: User;
    items: OrderItem[];
    createdAt: Date;
}
