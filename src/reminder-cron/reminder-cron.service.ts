import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReminderCronService {
  private readonly logger = new Logger(ReminderCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) { }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminderNotifications() {
    const offsetInMs = 4 * 60 * 60 * 1000; // UTC-4
    const nowLocal = new Date(Date.now() - offsetInMs);

    const tenMinutesLater = new Date(nowLocal.getTime() + 10 * 60 * 1000);
    const thirtyMinutesLater = new Date(nowLocal.getTime() + 30 * 60 * 1000);

    console.log('NowLocal:', nowLocal.toISOString());
    console.log('TenMinutesLater:', tenMinutesLater.toISOString());
    console.log('ThirtyMinutesLater:', thirtyMinutesLater.toISOString());

    const pendingReminders = await this.prisma.reminderNotification.findMany({
      where: {
        notifyAt: {
          gte: tenMinutesLater,
          lte: thirtyMinutesLater,
        },
        notified: false,
      },
      include: {
        treatment: true,
        patient: true,
      },
    });

    for (const reminder of pendingReminders) {
      try {
        await this.firebaseService.sendNotificationToPatient(
          reminder.patientId,
          '🕒 Recordatorio de tratamiento',
          `Dentro de poco deberás aplicar tu tratamiento: ${reminder.treatment?.description || 'Tratamiento'}`,
          {
            treatmentId: reminder.treatmentId,
            notifyAt: reminder.notifyAt.toISOString(),
          },
        );

        await this.prisma.reminderNotification.update({
          where: { id: reminder.id },
          data: { notified: true },
        });

        this.logger.log(`Notificación anticipada enviada al paciente ${reminder.patientId}`);
      } catch (error) {
        this.logger.error(`Error al enviar notificación: ${error.message}`);
      }
    }
  }
}
