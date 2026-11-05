import request from 'supertest';
import app from '../src/index';
import { User } from '../src/models/User';
import { Product } from '../src/models/Product';
import { Coupon } from '../src/models/Coupon';

const address = {
  firstName: 'Test', lastName: 'User', line1: '1 Road', city: 'Delhi',
  state: 'Delhi', pincode: '110001', phone: '9999999999',
};

const signIn = async (email: string) => {
  await request(app).post('/api/auth/register').send({ firstName: 'A', lastName: 'B', email, password: 'Password123' });
  const res = await request(app).post('/api/auth/login').send({ email, password: 'Password123' });
  return res.body.accessToken as string;
};

const makeProduct = async () => {
  const seller = await User.create({
    firstName: 'S', lastName: 'S', email: 'seller@example.com', passwordHash: 'Password123', role: 'seller', isEmailVerified: true,
  });
  return Product.create({
    name: 'Silk Sherwani', slug: 'silk-sherwani', description: 'Fine silk', shortDescription: 'Silk',
    price: 10000, category: 'mens', subcategory: 'Sherwanis', fabric: 'Silk', sellerId: seller._id,
    images: [{ url: '/x.jpg', alt: 'x', isPrimary: true }], colors: ['Red'], sizes: ['M'], stock: 5, tags: ['silk'],
  });
};

describe('Commerce flow', () => {
  it('searches products by keyword', async () => {
    await makeProduct();
    const hit = await request(app).get('/api/products?search=silk');
    expect(hit.statusCode).toBe(200);
    expect(hit.body.products).toHaveLength(1);
    const miss = await request(app).get('/api/products?search=nothingmatches');
    expect(miss.body.products).toHaveLength(0);
  });

  it('adds to cart, orders with a coupon, and pays via the dev payment gateway', async () => {
    const product = await makeProduct();
    await Coupon.create({ code: 'TEN', type: 'percentage', value: 10, minPurchase: 0, maxUses: 5 });
    const token = await signIn('buyer@example.com');
    const auth = { Authorization: `Bearer ${token}` };

    const add = await request(app).post('/api/cart').set(auth).send({ productId: String(product._id), quantity: 2, size: 'M', color: 'Red' });
    expect(add.statusCode).toBe(200);

    const order = await request(app).post('/api/orders').set(auth).send({ shippingAddress: address, couponCode: 'ten' });
    expect(order.statusCode).toBe(201);
    expect(order.body.mock).toBe(true);
    expect(order.body.order.total).toBe(18000); // 20000 - 10%

    const pay = {
      razorpayOrderId: order.body.razorpayOrderId, razorpayPaymentId: 'mock_pay_1',
      razorpaySignature: 'mock', orderId: order.body.order._id,
    };

    // Another user cannot pay for / confirm someone else's order
    const other = await signIn('other@example.com');
    const stolen = await request(app).post('/api/payments/verify').set({ Authorization: `Bearer ${other}` }).send(pay);
    expect(stolen.statusCode).toBe(404);

    const paid = await request(app).post('/api/payments/verify').set(auth).send(pay);
    expect(paid.statusCode).toBe(200);
    expect(paid.body.order.paymentStatus).toBe('paid');

    expect((await Product.findById(product._id))!.stock).toBe(3);
    const cart = await request(app).get('/api/cart').set(auth);
    expect(cart.body.cart.items).toHaveLength(0);

    // Replaying the same payment is rejected
    const again = await request(app).post('/api/payments/verify').set(auth).send(pay);
    expect(again.statusCode).toBe(404);
  });

  it('lets a verified buyer review and updates the rating', async () => {
    const product = await makeProduct();
    const token = await signIn('reviewer@example.com');
    const auth = { Authorization: `Bearer ${token}` };
    await request(app).post('/api/cart').set(auth).send({ productId: String(product._id), quantity: 1, size: 'M', color: 'Red' });
    const order = await request(app).post('/api/orders').set(auth).send({ shippingAddress: address });
    await request(app).post('/api/payments/verify').set(auth).send({
      razorpayOrderId: order.body.razorpayOrderId, razorpayPaymentId: 'mock_pay_2', razorpaySignature: 'mock', orderId: order.body.order._id,
    });
    const review = await request(app).post('/api/reviews').set(auth).send({
      productId: String(product._id), orderId: order.body.order._id, rating: 4, title: 'Great', body: 'Really lovely quality and fit overall.',
    });
    expect(review.statusCode).toBe(201);
    const list = await request(app).get(`/api/reviews/product/${product._id}`);
    expect(list.body.average).toBe(4);
    expect(list.body.count).toBe(1);
  });
});
