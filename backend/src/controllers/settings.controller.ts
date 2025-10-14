import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { CreateSettingsDto, UpdateSettingsDto } from '../dto/settings.dto';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createSettingsDto: CreateSettingsDto) {
    return this.settingsService.create(createSettingsDto);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('default')
  getDefaultSettings() {
    return this.settingsService.getDefaultSettings();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.update(id, updateSettingsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsService.remove(id);
  }
}
