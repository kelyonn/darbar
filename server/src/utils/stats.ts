import { Order } from '../models/Order';

// Revenue maths is done in application code (not $multiply/$year in the pipeline)
// so the API behaves the same on MongoDB and on Mongo-compatible servers.
interface PaidItem {
  productId: unknown;
  sellerId?: unknown;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  createdAt: Date;
  orderId: string;
}

export const paidItems = async (
  match: Record<string, unknown> = {},
  itemFilter: (i: any) => boolean = () => true
): Promise<PaidItem[]> => {
  const orders = await Order.find({ paymentStatus: 'paid', ...match }).lean();
  const out: PaidItem[] = [];
  for (const o of orders as any[]) {
    for (const i of o.items || []) {
      if (!itemFilter(i)) continue;
      out.push({
        productId: i.productId, sellerId: i.sellerId, name: i.name, category: i.category,
        price: i.price, quantity: i.quantity, createdAt: o.createdAt, orderId: String(o._id),
      });
    }
  }
  return out;
};

export const sellerTotals = async (sellerId: string) => {
  const items = await paidItems({}, i => String(i.sellerId) === String(sellerId));
  return {
    revenue: items.reduce((s, i) => s + i.price * i.quantity, 0),
    orders: new Set(items.map(i => i.orderId)).size,
  };
};
