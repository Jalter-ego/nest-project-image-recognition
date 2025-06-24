import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDeviceTokenDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}