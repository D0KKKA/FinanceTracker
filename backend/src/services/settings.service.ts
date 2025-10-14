import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from '../entities/settings.entity';
import { CreateSettingsDto, UpdateSettingsDto } from '../dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async create(createSettingsDto: CreateSettingsDto): Promise<Settings> {
    const settings = this.settingsRepository.create(createSettingsDto);
    return await this.settingsRepository.save(settings);
  }

  async findAll(): Promise<Settings[]> {
    return await this.settingsRepository.find();
  }

  async findOne(id: string): Promise<Settings> {
    return await this.settingsRepository.findOne({ where: { id } });
  }

  async getDefaultSettings(): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({ where: { id: 'default' } });
    
    if (!settings) {
      settings = this.settingsRepository.create({
        id: 'default',
        currency: 'RUB',
        syncEnabled: false,
      });
      await this.settingsRepository.save(settings);
    }
    
    return settings;
  }

  async update(id: string, updateSettingsDto: UpdateSettingsDto): Promise<Settings> {
    await this.settingsRepository.update(id, updateSettingsDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.settingsRepository.delete(id);
  }
}
