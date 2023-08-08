# xrpl-bridge API

## Getting Started

Application works in way you can add new wallet to the databae over the API and after that every transaction for that wallet will be savad in database.
You can check wallet transactions, by accessing api endpoint(for example for wallet rPepJMwHU1meraWtY8rSCmkZNE78wGFgN4, use http://localhost:3000/wallets/address/rPepJMwHU1meraWtY8rSCmkZNE78wGFgN4). 
\
\
The easiest way to test simple and see how app works is to check the code of e2e tests and run them after `docker-compose up`.

### Running the Project

1. **Start the Services**: Run the following command to start the necessary services using Docker Compose. It can take a few minutes:

`docker-compose up`

2. **Run End-to-End Tests**: If you want to run end-to-end tests, execute the following command after the first step is finished:

`yarn test:e2e`

3. **Run Unit and Integration Tests**: To run unit and integration tests, run the following commands:

`yarn`\
`yarn test`

## Endpoints

URL: http://localhost:3000/

### Create Wallet

- **URL**: `/wallets`
- **Method**: `POST`
- **Request Body**: `WalletDto`
- **Response**: Created `Wallet` object

### Get All Wallets

- **URL**: `/wallets`
- **Method**: `GET`
- **Response**: Array of `Wallet` objects

### Get Wallet by ID

- **URL**: `/wallets/:id`
- **Method**: `GET`
- **URL Parameters**: `id` - Wallet ID
- **Response**: `Wallet` object

### Get Wallet by Address

- **URL**: `/wallets/address/:address`
- **Method**: `GET`
- **URL Parameters**: `address` - Wallet Address
- **Response**: `Wallet` object

### Update Wallet

- **URL**: `/wallets/:id`
- **Method**: `PUT`
- **URL Parameters**: `id` - Wallet ID
- **Request Body**: Updated `Wallet` object
- **Response**: Updated `Wallet` object

### Delete Wallet by ID

- **URL**: `/wallets/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id` - Wallet ID
- **Response**: No content

### Delete Wallet by Address

- **URL**: `/wallets/address/:address`
- **Method**: `DELETE

## DTO (Data Transfer Object)

### WalletDto

Used for creating and updating wallets.

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class WalletDto {
  @IsString()
  @IsNotEmpty()
  readonly address: string;
}
