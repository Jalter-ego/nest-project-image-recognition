import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private prisma: PrismaService,) {
    const serviceAccountPath = path.join(
      process.cwd(),
      'src',
      'firebase',
      'dermai-a9c48-firebase-adminsdk-fbsvc-7a05a7fee2.json'
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });

    this.logger.log('✅ Firebase Admin inicializado');
  }

  async sendNotificationToToken(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<string | null> {
    const message = {
      token,
      notification: { title, body },
      data: data || {},
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`✅ Notificación enviada: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Error al enviar notificación: ${error.message}`, error.stack);
      return null;
    }
  }

  async sendNotificationToPatient(
    patientId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<string | null> {
    const deviceToken = await this.prisma.deviceToken.findFirst({
      where: { patientId },
      select: { token: true },
    });

    if (!deviceToken) {
      this.logger.warn(`❗ No se encontró token para el paciente ${patientId}`);
      return null;
    }

    return this.sendNotificationToToken(deviceToken.token, title, body, data);
  }
}
