import { Controller, Get, Patch, Body, UsePipes, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SettingsService } from '../services/settings.service';
import { UpdateSettingsDto } from '../dto/settings.dto';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMySettings(@Request() req) {
    return this.settingsService.findByUserId(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UsePipes(new ValidationPipe())
  async updateMySettings(@Request() req, @Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateByUserId(req.user.sub, updateSettingsDto);
  }
}
