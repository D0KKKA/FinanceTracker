import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TransactionsController } from './controllers/transactions.controller';
import { CategoriesController } from './controllers/categories.controller';
import { SettingsController } from './controllers/settings.controller';
import { TransactionsService } from './services/transactions.service';
import { CategoriesService } from './services/categories.service';
import { SettingsService } from './services/settings.service';
import { AppService } from './app.service';
import { Transaction } from './entities/transaction.entity';
import { Category } from './entities/category.entity';
import { Settings } from './entities/settings.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'finance.db',
      entities: [Transaction, Category, Settings],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Transaction, Category, Settings]),
  ],
  controllers: [TransactionsController, CategoriesController, SettingsController],
  providers: [TransactionsService, CategoriesService, SettingsService, AppService],
})
export class AppModule {}
