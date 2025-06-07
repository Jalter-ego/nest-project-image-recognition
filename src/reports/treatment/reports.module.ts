import { Module } from '@nestjs/common';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PatientsModule } from 'src/patients/patients.module';
import { PrinterModule } from 'src/printer/printer.module';
import { ReportGeneratorService } from '../report-generator.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportGeneratorService],
  imports: [PrinterModule, OrganizationsModule, PatientsModule]
})
export class ReportsModule { }
