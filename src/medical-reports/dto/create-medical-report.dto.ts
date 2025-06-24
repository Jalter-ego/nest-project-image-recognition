import { IsString, IsDateString } from 'class-validator';

export class CreateMedicalReportDto {
  @IsString()
  patientId: string;

  @IsString()
  organizationId: string;

  @IsDateString()
  fecha: Date;

  @IsString()
  informe: string;
} 