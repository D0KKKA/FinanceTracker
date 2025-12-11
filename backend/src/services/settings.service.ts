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

  async findByUserId(userId: string): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({ where: { userId } });

    if (!settings) {
      const result = await this.settingsRepository.insert({
        userId,
        currency: 'RUB',
        syncEnabled: false,
      });
      settings = await this.settingsRepository.findOne({ where: { userId } });
    }

    return settings;
  }

  async update(id: string, updateSettingsDto: UpdateSettingsDto): Promise<Settings> {
    await this.settingsRepository.update(id, updateSettingsDto);
    return await this.findOne(id);
  }

  async updateByUserId(userId: string, updateSettingsDto: UpdateSettingsDto): Promise<Settings> {
    const settings = await this.findByUserId(userId);
    await this.settingsRepository.update(settings.id, updateSettingsDto);
    return await this.findOne(settings.id);
  }

  async remove(id: string): Promise<void> {
    await this.settingsRepository.delete(id);
  }
}
