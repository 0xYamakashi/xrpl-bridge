import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WalletDto } from './wallet.dto';
import { Wallet } from './wallet.schema';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Post()
  async create(@Body() wallet: WalletDto) {
    return await this.walletService.create(wallet);
  }

  @Get()
  async findAll(): Promise<Wallet[]> {
    return await this.walletService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Wallet> {
    return await this.walletService.findOne(id);
  }

  @Get('address/:address')
  async findByAddress(@Param('address') address: string): Promise<Wallet> {
    return await this.walletService.findByAddress(address);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() wallet: Wallet,
  ): Promise<Wallet> {
    return await this.walletService.update(id, wallet);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.walletService.remove(id);
  }

  @Delete('address/:address')
  async removeByAddress(@Param('address') address: string): Promise<void> {
    await this.walletService.removeByAddress(address);
  }
}
