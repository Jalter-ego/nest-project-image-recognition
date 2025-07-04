import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TreatmentsService } from 'src/treatments/treatments.service';
import { CreateConsultationDto, CreateDiagnosisToConsultationDto, CreateTreatmentToConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

interface ReminderData {
  description: string;
  dates: Date[];
}

@Injectable()
export class ConsultationsService {
  constructor(private prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
    private readonly treatmentsService: TreatmentsService,
  ) { }

  async create(createConsultationDto: CreateConsultationDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: createConsultationDto.userId
      }
    })
    if (!user)
      throw new NotFoundException("User not exist")

    const patient = await this.prismaService.patient.findFirst({
      where: {
        id: createConsultationDto.patientId
      }
    })
    if (!patient)
      throw new NotFoundException("patient not exist")
    const organization = await this.prismaService.organization.findFirst({
      where: {
        id: createConsultationDto.organizationId
      }
    })
    if (!organization)
      throw new NotFoundException("organization not exist")

    return this.prismaService.consultation.create({
      data: createConsultationDto
    });
  }

  addDiagnosisToConsultation(createDiagnosisToConsultationDto: CreateDiagnosisToConsultationDto) {
    return this.prismaService.consultationDiagnosis.create({
      data: createDiagnosisToConsultationDto
    })
  }

  removeDiagnosisToConsultation(createDiagnosisToConsultationDto: CreateDiagnosisToConsultationDto) {
    return this.prismaService.consultationDiagnosis.delete({
      where: {
        consultationId_diagnosisId: {
          consultationId: createDiagnosisToConsultationDto.consultationId,
          diagnosisId: createDiagnosisToConsultationDto.diagnosisId
        }
      }
    })
  }

  async addTreatmentToConsultation(dto: CreateTreatmentToConsultationDto) {
    const association = await this.prismaService.consultationTreatment.create({
      data: dto,
    });

    // Obtener la consulta (para obtener el paciente)
    const consultation = await this.prismaService.consultation.findFirst({
      where: { id: dto.consultationId },
      select: { patientId: true },
    });

    if (consultation?.patientId) {
      // 🧠 Generar recordatorios
      const reminderData = await this.treatmentsService.getRemindersForTreatment(
        dto.treatmentId,
        dto.consultationId,
      );

      for (const notifyAt of reminderData!.dates) {
        const exists = await this.prismaService.reminderNotification.findFirst({
          where: {
            patientId: consultation.patientId,
            treatmentId: dto.treatmentId,
            notifyAt,
          },
        });

        if (!exists) {
          const offsetInMs = 4 * 60 * 60 * 1000;
          const nowLocal = new Date(Date.now() - offsetInMs);
          const isPast = notifyAt < nowLocal;

          console.log('NotifyAt:', notifyAt.toISOString(), 'NowLocal:', nowLocal.toISOString(), 'IsPast:', isPast);

          await this.prismaService.reminderNotification.create({
            data: {
              patientId: consultation.patientId,
              treatmentId: dto.treatmentId,
              notifyAt,
              notified: isPast,
            },
          });
        }
      }

      await this.firebaseService.sendNotificationToPatient(
        consultation.patientId,
        '📋 Nuevo tratamiento asignado',
        'Se ha asignado un nuevo tratamiento a tu consulta médica',
        {
          consultationId: dto.consultationId,
          treatmentId: dto.treatmentId,
        },
      );
    }
    return association;
  }

  removeTreatmentToConsultation(createTreatmentToConsultationDto: CreateTreatmentToConsultationDto) {
    return this.prismaService.consultationTreatment.delete({
      where: {
        consultationId_treatmentId: {
          consultationId: createTreatmentToConsultationDto.consultationId,
          treatmentId: createTreatmentToConsultationDto.treatmentId
        }
      }
    })
  }

  findAll() {
    return this.prismaService.consultation.findMany();
  }

  findAllByOrganization(id: string) {
    return this.prismaService.consultation.findMany({
      where: {
        organizationId: id
      },
      omit: {
        patientId: true,
        organizationId: true,
        userId: true
      },
      include: {
        treatments: {
          omit: {
            consultationId: true,
            treatmentId: true
          },
          include: {
            treatment: true
          }
        },
        diagnoses: {
          omit: {
            consultationId: true,
            diagnosisId: true
          },
          include: {
            diagnosis: true
          }
        },
        patient: {
          select: {
            id: true,
            name: true,
            aPaternal: true,
            aMaternal: true,
            ci: true,
            sexo: true,
            birthDate: true
          }
        },
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })
  }

  findAllByUser(id: string) {
    return this.prismaService.consultation.findMany({
      where: {
        userId: id
      }
    })
  }

  findAllByPatient(id: string) {
    return this.prismaService.consultation.findMany({
      where: {
        patientId: id
      }
    })
  }

  async findAllDetailedByPatient(id: string) {
    const patient = await this.prismaService.patient.findFirst({
      where: {
        id: id
      },
      select: {
        id: true,
        name: true,
        aPaternal: true,
        aMaternal: true,
        ci: true,
        sexo: true,
        email: true,
        phone: true,
        birthDate: true,
        chronicDiseases: true,
        allergies: true,
        bloodType: true,
      }
    });

    if (!patient) {
      throw new NotFoundException("Paciente no encontrado");
    }

    const consultations = await this.prismaService.consultation.findMany({
      where: {
        patientId: id
      },
      omit: {
        patientId: true,
        organizationId: true,
        userId: true
      },
      include: {
        treatments: {
          omit: {
            consultationId: true,
            treatmentId: true
          },
          include: {
            treatment: true
          }
        },
        diagnoses: {
          omit: {
            consultationId: true,
            diagnosisId: true
          },
          include: {
            diagnosis: true
          }
        },
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        consultationDate: 'desc'
      }
    });

    return {
      patient,
      consultations
    };
  }

  findOne(id: string) {
    return this.prismaService.consultation.findFirst({
      where: {
        id: id
      }
    });
  }

  update(id: string, updateConsultationDto: UpdateConsultationDto) {
    return `This action updates a #${id} consultation`;
  }

  remove(id: string) {
    return this.prismaService.consultation.delete({
      where: {
        id: id
      }
    });
  }
}
