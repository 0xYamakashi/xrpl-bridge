import * as request from 'supertest';

import { Client, Wallet, xrpToDrops } from 'xrpl';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });

const client = new Client(process.env.XRPL_API_WS_URL);

describe('WalletController (e2e)', () => {
  const appUrl = 'http://localhost:3000';
  let createdWalletAddress: string;
  let createdWalletId: string;

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    await client.disconnect();
  });

  it('Create a wallet, make a transaction with it and check if it is in the database as expected', async () => {
    const walletData = {
      address: process.env.TEST_ACCOUNT_ADDRESS,
    };

    // delete wallet if exists before e2e test
    await request(appUrl).delete(
      `/wallets/address/${process.env.TEST_ACCOUNT_ADDRESS}`,
    );

    await request(appUrl)
      .post('/wallets')
      .send(walletData)
      .expect(201)
      .then((response) => {
        createdWalletAddress = response.body.address;
        createdWalletId = response.body._id;
        expect(response.body.address).toEqual(walletData.address);
      });

    const wallet = Wallet.fromSecret(process.env.TEST_ACCOUNT_PRIVATE_KEY);

    const prepared = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: xrpToDrops(1),
      Destination: 'rn3zmoBTWu5wHTvH2PWGy6TavujnvVuLSY',
    });

    const signed = wallet.sign(prepared);

    const tx = await client.submitAndWait(signed.tx_blob);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await request(appUrl)
      .get(`/wallets/address/${createdWalletAddress}`)
      .then((response) => {
        expect([200, 201]).toContain(response.status);
        createdWalletAddress = response.body.createdWalletAddress;
        expect(response.body.address).toEqual(walletData.address);
      });
  }, 20000);
});
