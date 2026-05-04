import { model, models, Schema } from 'mongoose';
import { CalendarSaleSchema } from '@/lib/db/schema';

const CalendarSaleModel = models?.MonthSale || model('MonthSale', CalendarSaleSchema as Schema);

export default CalendarSaleModel;
