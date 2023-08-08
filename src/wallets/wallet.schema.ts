import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transaction } from './transaction.schema';

@Schema()
export class Wallet extends Document {
  @Prop({ required: true, unique: true })
  address: string;

  @Prop([{ type: Types.ObjectId, ref: 'Transaction' }])
  transactions: Transaction[];
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
