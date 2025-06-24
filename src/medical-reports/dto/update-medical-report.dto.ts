import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalReportDto } from './create-medical-report.dto';

export class UpdateMedicalReportDto extends PartialType(CreateMedicalReportDto) {} 