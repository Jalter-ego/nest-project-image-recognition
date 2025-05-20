import { IsString, IsOptional, IsDate, IsInt, IsEmail } from 'class-validator';
import { Type } from 'class-transformer'; 

export class CreatePatientDto {
  @IsInt()
  ci: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  aPaternal?: string;

  @IsString()
  @IsOptional()
  aMaternal?: string;

  @IsString()
  sexo: string;

  @IsDate()
  @Type(() => Date)  // <-- Aquí la transformación para convertir string a Date
  birthDate: Date;

  @IsInt()
  phone: number;

  @IsEmail()
  email: string;

  @IsString()
  organizationId: string;
}
