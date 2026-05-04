import { model, models, Schema } from 'mongoose';
import { CalendarSaleSchema } from '@/lib/db/schema';

const CalendarSaleModel = models?.CalendarSale || model('CalendarSale', CalendarSaleSchema as Schema);

export default CalendarSaleModel;
