import { container, inject } from 'tsyringe';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import IOrderRepository from '@modules/orders/repositories/IOrdersRepository';
import OrderRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';

container.registerSingleton<ICustomersRepository>('CustomerRepository', CustomersRepository)
container.registerSingleton<IProductsRepository>('ProductsRepository', ProductsRepository)
container.registerSingleton<IOrderRepository>('OrdersRepository', OrderRepository)
