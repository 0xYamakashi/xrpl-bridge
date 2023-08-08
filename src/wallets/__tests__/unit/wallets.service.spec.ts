import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Wallet } from '../../wallet.schema';
import { WalletsService } from '../../wallets.service';
import { RippleService } from '../../../ripple/ripple.service';
import {
  rippleServiceMock,
  testWallet,
  transactionModelMock,
  updatedTestWallet,
  walletModelMock,
} from '../mocks';
import { Transaction } from '../../transaction.schema';

describe('WalletService', () => {
  let walletService: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        {
          provide: RippleService,
          useValue: rippleServiceMock,
        },
        { provide: getModelToken(Wallet.name), useValue: walletModelMock },
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModelMock,
        },
      ],
    }).compile();

    walletService = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(walletService).toBeDefined();
  });

  it('should find all wallets', async () => {
    const result = await walletService.findAll();
    expect(result).toEqual([testWallet]);
    expect(walletModelMock.find).toHaveBeenCalled();
  });

  it('should find one wallet by id', async () => {
    const result = await walletService.findOne('testid123');
    expect(result).toEqual(testWallet);
    expect(walletModelMock.findById).toHaveBeenCalled();
  });

  it('should update a wallet', async () => {
    const result = await walletService.update('testid123', updatedTestWallet);
    expect(result).toEqual(updatedTestWallet);
    expect(walletModelMock.findByIdAndUpdate).toHaveBeenCalled();
  });

  it('should delete a wallet', async () => {
    await walletService.remove('testid123');
    expect(walletModelMock.findByIdAndDelete).toHaveBeenCalled();
  });
});
