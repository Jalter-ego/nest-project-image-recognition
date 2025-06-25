import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReminderCronService } from './reminder-cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // solo si no está ya en AppModule
    PrismaModule,
    FirebaseModule,
  ],
  providers: [ReminderCronService],
})
export class ReminderCronModule { }
