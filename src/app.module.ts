import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { AttentionHourModule } from './attention-hour/attention-hour.module';
import { AuthModule } from './auth/auth.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { DiagnosesModule } from './diagnoses/diagnoses.module';
import { OrganizationsMembersModule } from './organizations-members/organizations-members.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PatientsModule } from './patients/patients.module';
import { PlansModule } from './plans/plans.module';
import { PrinterModule } from './printer/printer.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/treatment/reports.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    PlansModule,
    OrganizationsModule,
    OrganizationsMembersModule,
    PatientsModule,
    AppointmentsModule,
    DiagnosesModule,
    TreatmentsModule,
    ConsultationsModule,
    SubscriptionsModule,
    AttentionHourModule,
    ReportsModule,
    PrinterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
