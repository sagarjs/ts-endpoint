import {Document, model, Schema} from 'mongoose'
import { Stuff } from '../interfaces/stuff.i';

export type StuffDocument = Stuff & Document

const StuffSchema = new Schema({
    key: String,
    createdAt: String,
    counts: [Number],
});

export const StuffRepository = model<StuffDocument>('Records', StuffSchema);
