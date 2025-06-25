import { Injectable } from '@nestjs/common';
import { addDays, addHours, addMonths, isBefore } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';

interface ReminderData {
  description: string;
  dates: Date[];
}

@Injectable()
export class TreatmentsService {
  constructor(private prismaService: PrismaService) { }

  create(createTreatmentDto: CreateTreatmentDto) {
    return this.prismaService.treatment.create({
      data: createTreatmentDto,
    });
  }

  findAll() {
    return this.prismaService.treatment.findMany();
  }

  findAllByOrganization(id: string) {
    return this.prismaService.treatment.findMany({
      where: {
        organizationId: id,
      },
      include: {
        consultations: true,
      },
    });
  }

  findAllByUserAndOrganization(
    userId: string,
    organizationId: string,
    inc: boolean,
  ) {
    const query: any = {
      where: {
        organizationId: organizationId,
        consultations: {
          some: {
            consultation: {
              userId: userId,
            },
          },
        },
      },
    };

    if (inc) {
      query.include = {
        consultations: {
          include: {
            consultation: {
              select: {
                id: true,
                consultationDate: true,
                motivo: true,
                patient: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      };
    }

    return this.prismaService.treatment.findMany(query);
  }

  findAllByPatientAndOrganization(
    patientId: string,
    organizationId: string,
    inc: boolean,
  ) {
    const query: any = {
      where: {
        organizationId: organizationId,
        consultations: {
          some: {
            consultation: {
              patientId: patientId,
            },
          },
        },
      },
    };
    if (inc) {
      query.include = {
        consultations: {
          include: {
            consultation: {
              select: {
                id: true,
                consultationDate: true,
                motivo: true,
                patient: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      };
    }
    return this.prismaService.treatment.findMany(query);
  }

  findOne(id: string) {
    return this.prismaService.treatment.findFirst({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateTreatmentDto: UpdateTreatmentDto) {
    const treatment = await this.findOne(id)
    if (!treatment) {
      throw new Error('Treatment not found');
    }

    return this.prismaService.treatment.update({
      where: {
        id: id,
      },
      data: updateTreatmentDto,
    });
  }

  remove(id: string) {
    return this.prismaService.treatment.delete({
      where: {
        id: id,
      },
    });
  }

  private parseDuration(duration: string, startDate: Date): Date {
    const durationRegex = /^(\d+)\s+(dias|semanas|meses)$/i;
    const match = duration.match(durationRegex);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}. Expected format: "7 dias", "4 semanas", "3 meses"`);
    }

    const numValue = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    if (unit === 'dias') return addDays(startDate, numValue);
    if (unit === 'semanas') return addDays(startDate, numValue * 7);
    if (unit === 'meses') return addMonths(startDate, numValue);

    throw new Error(`Unsupported duration unit: ${unit}`);
  }

  private generateReminderDates(
    startDate: Date,
    endDate: Date,
    frequencyValue: number,
    frequencyUnit: string,
  ): Date[] {
    let frequencyInHours: number;

    if (frequencyUnit === 'daily') frequencyInHours = 24 / frequencyValue;
    else if (frequencyUnit === 'weekly') frequencyInHours = 168 / frequencyValue;
    else if (frequencyUnit === 'monthly') frequencyInHours = 730 / frequencyValue;
    else throw new Error(`Unsupported frequency unit: ${frequencyUnit}`);

    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (isBefore(currentDate, endDate)) {
      dates.push(new Date(currentDate));
      currentDate = addHours(currentDate, frequencyInHours);
    }

    return dates;
  }

  async getRemindersForTreatment(treatmentId: string, consultationId: string): Promise<ReminderData | null> {
    const consultation = await this.prismaService.consultation.findFirst({
      where: { id: consultationId },
    });

    if (!consultation) throw new Error('Consulta no encontrada');

    const treatment = await this.prismaService.treatment.findFirst({
      where: { id: treatmentId },
    });

    if (!treatment) throw new Error('Tratamiento no encontrado');

    const { frequencyValue, frequencyUnit, duration, description } = treatment;

    if (!frequencyValue || !frequencyUnit) return null;

    const start = consultation.consultationDate;
    const end = this.parseDuration(duration, start);
    const dates = this.generateReminderDates(start, end, frequencyValue, frequencyUnit);

    return { description, dates };
  }

  async getRemindersForPatient(patientId: string) {
    const consultations = await this.prismaService.consultation.findMany({
      where: { patientId },
      include: {
        treatments: { include: { treatment: true } },
      },
    });

    const remindersByTreatment: { [key: string]: { description: string; dates: Date[] } } = {};

    for (const consultation of consultations) {
      const consultationDate = consultation.consultationDate;

      for (const { treatment } of consultation.treatments) {
        const { frequencyValue, frequencyUnit, duration, description } = treatment;

        if (!frequencyValue || !frequencyUnit) continue;

        const endDate = this.parseDuration(duration, consultationDate);
        const dates = this.generateReminderDates(consultationDate, endDate, frequencyValue, frequencyUnit);

        remindersByTreatment[treatment.id] = { description, dates };
      }
    }

    return remindersByTreatment;
  }
}
