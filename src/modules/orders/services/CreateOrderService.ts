import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomerRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if(!customerExists){
      throw new AppError('Could not find any customer with the given id');
    }

    const existisProduct = await this.productsRepository.findAllById(products,);

    if(!existisProduct){
      throw new AppError('Could not find any products with the given ids');
    }

    const existisProductIds = existisProduct.map(product => product.id);

    const checkInexisstenProducts = products.filter(
      product => !existisProductIds.includes(product.id),
    );

    if(checkInexisstenProducts.length){
      throw new AppError(`Could not find product ${checkInexisstenProducts[0].id}`);
    }


    const findProductsWithNoQuantityAvailable = products.filter(
      product => 
        existisProduct.filter(p => p.id === product.id)[0].quantity < product.quantity,
    );

    if(findProductsWithNoQuantityAvailable.length){
      throw new AppError(`The quantity ${findProductsWithNoQuantityAvailable[0].quantity} is not available for id: ${findProductsWithNoQuantityAvailable[0].id}`)
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existisProduct.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const orderdProductsQuantity = products.map(product => ({
      id: product.id,
      quantity: existisProduct.filter(p => p.id === product.id )[0].quantity - product.quantity,
    }));

    await this.productsRepository.updateQuantity(orderdProductsQuantity);

    return order;
  }
}

export default CreateOrderService;
