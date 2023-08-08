import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  Account: string;

  @Prop({ required: true })
  Amount: string;

  @Prop({ required: true })
  Destination: string;

  @Prop({ required: true })
  Fee: string;

  @Prop({ required: true })
  Flags: number;

  @Prop({ required: true })
  LastLedgerSequence: number;

  @Prop({ required: true })
  Sequence: number;

  @Prop({ required: true })
  SigningPubKey: string;

  @Prop({ required: true })
  TransactionType: string;

  @Prop({ required: true })
  TxnSignature: string;

  @Prop({ required: true })
  date: number;

  @Prop({ required: true })
  hash: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
