import { model, models, Schema } from 'mongoose';
import { MonthSaleSchema } from '@/lib/db/schema';

const MonthSaleModel = models?.MonthSale || model('MonthSale', MonthSaleSchema as Schema);

export default MonthSaleModel;
