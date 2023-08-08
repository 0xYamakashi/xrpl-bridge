import { IsNotEmpty, IsString } from 'class-validator';

export class WalletDto {
  @IsString()
  @IsNotEmpty()
  readonly address: string;
}
