import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './wallet.schema';
import { WalletDto } from './wallet.dto';
import { RippleService } from '../ripple/ripple.service';
import { Transaction } from './transaction.schema';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @Inject(forwardRef(() => RippleService))
    private rippleService: RippleService,
  ) {}

  async create(wallet: WalletDto): Promise<Wallet> {
    if (!this.rippleService.isValidAddress(wallet.address)) {
      throw new BadRequestException('Wallet address is not valid!');
    }

    const createdWallet = new this.walletModel(wallet);
    await this.rippleService.subscribeToAddresses([createdWallet.address]);
    return createdWallet.save();
  }

  async findAll(): Promise<Wallet[]> {
    return await this.walletModel
      .find()
      .populate('transactions', '', this.transactionModel)
      .exec();
  }

  async findOne(id: string): Promise<Wallet> {
    return await this.walletModel
      .findById(id)
      .populate('transactions', '', this.transactionModel)
      .exec();
  }

  async findByAddress(address: string): Promise<Wallet> {
    return await this.walletModel
      .findOne({ address: address })
      .populate('transactions', '', this.transactionModel)
      .exec();
  }

  async update(id: string, wallet: WalletDto): Promise<Wallet> {
    return await this.walletModel
      .findByIdAndUpdate(id, wallet, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const wallet = await this.walletModel.findByIdAndDelete(id).exec();
    await this.rippleService.unsubscribeFromAddress([wallet.address]);
  }

  async removeByAddress(address: string): Promise<void> {
    const wallet = await this.walletModel
      .findOneAndDelete({ address: address })
      .exec();
    await this.rippleService.unsubscribeFromAddress([wallet.address]);
  }
}
