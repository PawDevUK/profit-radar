import { Model, Schema } from 'mongoose';
import { MonthSaleSchema } from '@/lib/db/schema';

const MonthSaleModel = new Model('MonthSale', MonthSaleSchema as Schema);
