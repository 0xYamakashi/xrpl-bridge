import { Test, TestingModule } from '@nestjs/testing';
import { RippleService } from '../ripple.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WalletsService } from '../../wallets/wallets.service';
import { getModelToken } from '@nestjs/mongoose';
import { Wallet } from '../../wallets/wallet.schema';
import { Transaction } from '../../wallets/transaction.schema';
import {
  walletModelMock,
  transactionModelMock,
} from '../../wallets/__tests__/mocks';

jest.mock('axios');
jest.mock('ws');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RippleService', () => {
  let service: RippleService;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockWalletService = {
      someMethod: jest.fn(),
      anotherMethod: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RippleService,
        ConfigService,
        { provide: WalletsService, useValue: mockWalletService },
        { provide: getModelToken(Wallet.name), useValue: walletModelMock },
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModelMock,
        },
      ],
    }).compile();

    service = module.get<RippleService>(RippleService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate addresses correctly', () => {
    expect(
      service.isValidAddress('r4dgY6Mzob3NVq8CFYdEiPnXKboRScsXRu'),
    ).toBeTruthy();
    expect(service.isValidAddress('invalid_address')).toBeFalsy();
  });

  it('should get transactions of an address', async () => {
    const testAddress = 'testAddress';
    const testApiUrl = 'testApiUrl';
    const testResponse = {
      data: {
        result: {
          status: 'success',
          transactions: ['tx1', 'tx2'],
        },
      },
    };

    jest.spyOn(configService, 'get').mockReturnValue(testApiUrl);
    mockedAxios.post.mockResolvedValue(testResponse);

    const transactions = await service.getAddressTransactions(testAddress);
    expect(transactions).toEqual(testResponse.data.result.transactions);
    expect(configService.get).toHaveBeenCalledWith('XRPL_API_WS_URL');
    expect(mockedAxios.post).toHaveBeenCalledWith(testApiUrl, {
      method: 'account_tx',
      params: [
        {
          account: testAddress,
          ledger_index_min: -1,
          ledger_index_max: -1,
          binary: false,
          limit: 10,
          forward: false,
        },
      ],
    });
  });
});
