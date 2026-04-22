import { model, Schema } from 'mongoose';
import { MonthSaleSchema } from '@/lib/db/schema';

const MonthSaleModel = model('MonthSale', MonthSaleSchema as Schema);

export default MonthSaleModel;
