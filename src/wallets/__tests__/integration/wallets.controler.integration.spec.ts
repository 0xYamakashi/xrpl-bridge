import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { WalletsController } from '../../wallets.controller';
import { WalletsService } from '../../wallets.service';
import { WalletDto } from '../../wallet.dto';
import { Wallet, WalletSchema } from '../../wallet.schema';
import { RippleService } from '../../../ripple/ripple.service';
import {
  Transaction,
  TransactionSchema,
} from '../../../wallets/transaction.schema';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

jest.mock('ws', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      send: jest.fn(),
    };
  });
});

describe('WalletsController Integration Test', () => {
  let controller: WalletsController;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    await mongod.start();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  beforeEach(async () => {
    const uri = await mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [RippleService, WalletsService, ConfigService],
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: Wallet.name, schema: WalletSchema },
          { name: Transaction.name, schema: TransactionSchema },
        ]),
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw exepction for unvalid wallet address', async () => {
    const walletDto: WalletDto = {
      address: 'test_address',
    };

    await expect(controller.create(walletDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should create a wallet', async () => {
    const walletDto: WalletDto = {
      address: 'rPepJMwHU1meraWtY8rSCmkZNE78wGFgN4',
    };
    const result = await controller.create(walletDto);

    expect(result.address).toEqual(walletDto.address);
  });
});
