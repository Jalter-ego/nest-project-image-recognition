import { Module } from '@nestjs/common';
import { MedicalReportsService } from './medical-reports.service';
import { MedicalReportsController } from './medical-reports.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MedicalReportGeneratorService } from '../reports/medical-report-generator.service';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [PrismaModule, OrganizationsModule, PatientsModule],
  controllers: [MedicalReportsController],
  providers: [MedicalReportsService, MedicalReportGeneratorService],
  exports: [MedicalReportsService],
})
export class MedicalReportsModule {} 