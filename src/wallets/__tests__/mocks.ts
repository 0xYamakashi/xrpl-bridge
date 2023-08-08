import { WalletDto } from '../wallet.dto';

export const testWallet: WalletDto = {
  address: 'testAddress',
  // other properties...
};

export const updatedTestWallet: WalletDto = {
  address: 'updatedAddress',
  // other properties...
};

export const walletModelMock = {
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([testWallet]),
  }),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(testWallet),
  }),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(updatedTestWallet),
  }),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(testWallet),
  }),
};

export const transactionModelMock = {
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([]),
  }),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(undefined),
  }),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(undefined),
  }),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(undefined),
  }),
};

export const rippleServiceMock = {
  getApiUrl: jest.fn(),
  getAddressTransactions: jest.fn(),
  subscribeToAddresses: jest.fn(),
  unsubscribeFromAddress: jest.fn(),
  isValidAddress: jest.fn(),
};
