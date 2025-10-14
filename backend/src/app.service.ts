import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { SettingsService } from './services/settings.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly settingsService: SettingsService,
  ) {}

  async onModuleInit() {
    console.log('🔄 Инициализация дефолтных данных...');
    
    try {
      // Создаем дефолтные категории
      await this.categoriesService.seedDefaultCategories();
      console.log('✅ Дефолтные категории созданы');
      
      // Создаем дефолтные настройки
      await this.settingsService.getDefaultSettings();
      console.log('✅ Дефолтные настройки созданы');
      
      console.log('🎉 Инициализация завершена успешно!');
    } catch (error) {
      console.error('❌ Ошибка при инициализации:', error);
    }
  }

  getHello(): string {
    return 'Finance Tracker Backend API is running!';
  }
}
