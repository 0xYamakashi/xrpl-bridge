import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { RippleModule } from './ripple/ripple.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    WalletsModule,
    RippleModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [AppController],
})
export class AppModule {}
