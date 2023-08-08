import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { isValidAddress } from 'xrpl';
import { Transaction } from '../wallets/transaction.schema';
import { Wallet } from '../wallets/wallet.schema';
import { WalletsService } from '../wallets/wallets.service';
import * as WebSocket from 'ws';

@Injectable()
export class RippleService {
  private ws: WebSocket;

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => WalletsService))
    private walletService: WalletsService,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
  ) {
    this.ws = new WebSocket(this.getApiUrl());

    this.ws.on('open', () => {
      console.log('open');
      this.subscribeToAllAddresses();
    });

    this.ws.on('close', () => {
      console.log('close');
      this.unsubscribeFromAllAddresses();
    });
  }

  getApiUrl(): string {
    return this.configService.get<string>('XRPL_API_WS_URL');
  }

  async getAddressTransactions(address: string): Promise<any> {
    try {
      const response = await axios.post(this.getApiUrl(), {
        method: 'account_tx',
        params: [
          {
            account: address,
            ledger_index_min: -1,
            ledger_index_max: -1,
            binary: false,
            limit: 10,
            forward: false,
          },
        ],
      });

      if (response.data.result.status === 'success') {
        return response.data.result.transactions;
      } else {
        throw new Error(response.data.result.error_message);
      }
    } catch (error) {
      throw error;
    }
  }

  async subscribeToAddresses(addresses: string[]) {
    const message = {
      command: 'subscribe',
      accounts: addresses,
    };
    this.ws.send(JSON.stringify(message));
    this.ws.on('message', async (data) => {
      try {
        const transactionData = JSON.parse(data.toString());
        if (transactionData.engine_result === 'tesSUCCESS') {
          const txn = new this.transactionModel(transactionData.transaction);
          await txn.save();

          const wallets = await this.walletModel.find({
            $or: [
              { address: transactionData.transaction.Account },
              { address: transactionData.transaction.Destination },
            ],
          });

          wallets.forEach(async (wallet) => {
            if (wallet.transactions.some((tx) => tx.hash === txn.hash)) {
              console.log('DUPLICATED');
              return;
            }
            wallet.transactions.push(txn._id);
            await wallet.save();
            console.log(
              `Transaction ${transactionData.transaction.hash} 
               saved for wallet ${wallet.address}`,
            );
          });
        }
      } catch (e) {
        console.log('Error on parsing tx', e);
      }
    });
  }

  async unsubscribeFromAddress(addresses: string[]) {
    const message = {
      command: 'unsubscribe',
      accounts: [addresses],
    };
    this.ws.send(JSON.stringify(message));
  }

  isValidAddress(address: string): boolean {
    return isValidAddress(address);
  }

  async subscribeToAllAddresses() {
    const wallets = await this.walletService.findAll();
    let addresses = [];
    wallets.forEach((wallet) => addresses.push(wallet.address));
    await this.subscribeToAddresses(addresses);
  }

  async unsubscribeFromAllAddresses() {
    const wallets = await this.walletService.findAll();
    let addresses = [];
    wallets.forEach((wallet) => addresses.push(wallet.address));
    await this.unsubscribeFromAddress(addresses);
  }
}
