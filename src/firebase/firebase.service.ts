import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private prisma: PrismaService) {
    const serviceAccountJson = process.env.FIREBASE_ADMINSDK_JSON;
  
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_ADMINSDK_JSON no está definido en las variables de entorno');
    }
  
    const serviceAccount = JSON.parse(serviceAccountJson);
  
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
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
