import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletDto } from '../../wallet.dto';
import { Wallet } from '../../wallet.schema';
import { WalletsController } from '../../wallets.controller';
import { WalletsService } from '../../wallets.service';
import { RippleService } from '../../../ripple/ripple.service';
import {
  rippleServiceMock,
  transactionModelMock,
  walletModelMock,
} from '../mocks';
import { Transaction } from '../../transaction.schema';

describe('WalletsController', () => {
  let controller: WalletsController;
  let spyService: WalletsService;

  const testWallet: WalletDto = {
    address: 'testAddress',
    // other properties...
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        WalletsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModelMock,
        },
        {
          provide: getModelToken(Wallet.name),
          useValue: walletModelMock,
        },
        {
          provide: RippleService,
          useValue: rippleServiceMock,
        },
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
    spyService = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return the result of service.findAll', async () => {
      const result = [testWallet];
      expect(await controller.findAll()).toEqual(result);
    });
  });
});
