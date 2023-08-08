# xrpl-bridge API

## Getting Started

### Running the Project

1. **Start the Services**: Run the following command to start the necessary services using Docker Compose:

`docker-compose up`

2. **Run End-to-End Tests**: If you want to run end-to-end tests, execute the following command after the first step:

`yarn test:e2e`

3. **Run Unit and Integration Tests**: To run unit and integration tests, run the following commands:

`yarn`\
`yarn test`

## Endpoints

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
