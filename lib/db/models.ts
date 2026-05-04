import { model, models, Schema } from 'mongoose';
import { CalendarSaleSchema, LotDetailsSchema } from '@/lib/db/schema';

export const CalendarSaleModel = models?.CalendarSale || model('CalendarSale', CalendarSaleSchema as Schema);
export const LotDetailsModel = models?.LotDetails || model('LotDetails', LotDetailsSchema as Schema);
