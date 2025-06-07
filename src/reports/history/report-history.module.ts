import { Module } from '@nestjs/common';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PatientsModule } from 'src/patients/patients.module';
import { PrinterModule } from 'src/printer/printer.module';
import { ReportGeneratorService } from '../report-generator.service';
import { ReportsController } from './report-history.controller';
import { ReportsHistoryService } from './report-history.service';

@Module({
    controllers: [ReportsController],
    providers: [ReportsHistoryService, ReportGeneratorService],
    imports: [PrinterModule, PatientsModule, OrganizationsModule]
})
export class ReportHistoryModule { }
