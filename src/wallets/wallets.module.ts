import { Module, forwardRef } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './wallet.schema';
import { ConfigModule } from '@nestjs/config';
import { RippleModule } from '../ripple/ripple.module';
import { Transaction, TransactionSchema } from './transaction.schema';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    ConfigModule,
    forwardRef(() => RippleModule),
  ],
  exports: [
    WalletsService,
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
})
export class WalletsModule {}
