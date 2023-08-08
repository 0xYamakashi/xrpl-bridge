import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletsModule } from '../wallets/wallets.module';
import { RippleService } from './ripple.service';

@Module({
  providers: [RippleService, ConfigService],
  imports: [forwardRef(() => WalletsModule)],
  exports: [RippleService],
})
export class RippleModule {}
