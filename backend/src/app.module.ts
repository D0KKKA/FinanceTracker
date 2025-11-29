import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TransactionsController } from './controllers/transactions.controller';
import { CategoriesController } from './controllers/categories.controller';
import { SettingsController } from './controllers/settings.controller';
import { AuthController } from './controllers/auth.controller';
import { TransactionsService } from './services/transactions.service';
import { CategoriesService } from './services/categories.service';
import { SettingsService } from './services/settings.service';
import { AuthService } from './services/auth.service';
import { AppService } from './app.service';
import { Transaction } from './entities/transaction.entity';
import { Category } from './entities/category.entity';
import { Settings } from './entities/settings.entity';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'finance.db',
      entities: [Transaction, Category, Settings, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Transaction, Category, Settings, User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [TransactionsController, CategoriesController, SettingsController, AuthController],
  providers: [TransactionsService, CategoriesService, SettingsService, AuthService, AppService, JwtStrategy],
})
export class AppModule {}
