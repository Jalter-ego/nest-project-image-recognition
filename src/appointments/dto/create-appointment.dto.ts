import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsDate()
  @Type(() => Date)
  appointmentDateTime: Date;

  @IsString()
  patientId: string;

  @IsString()
  organizationId: string;
}
