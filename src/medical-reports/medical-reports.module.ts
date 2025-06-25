import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PatientsModule } from '../patients/patients.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MedicalReportGeneratorService } from '../reports/medical-report-generator.service';
import { MedicalReportsController } from './medical-reports.controller';
import { MedicalReportsService } from './medical-reports.service';

@Module({
  imports: [PrismaModule, OrganizationsModule, PatientsModule, FirebaseModule],
  controllers: [MedicalReportsController],
  providers: [MedicalReportsService, MedicalReportGeneratorService],
  exports: [MedicalReportsService],
})
export class MedicalReportsModule { } 