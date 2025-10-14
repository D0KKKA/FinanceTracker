import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  backendUrl?: string;

  @IsBoolean()
  syncEnabled: boolean;
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  backendUrl?: string;

  @IsOptional()
  @IsBoolean()
  syncEnabled?: boolean;
}
