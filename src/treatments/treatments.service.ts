import { Injectable } from '@nestjs/common';
import { addDays, addHours, addMonths, isBefore } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';

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
    let endDate: Date;

    if (unit === 'dias') { endDate = addDays(startDate, numValue); }
    else if (unit === 'semanas') { endDate = addDays(startDate, numValue * 7); }
    else if (unit === 'meses') { endDate = addMonths(startDate, numValue); }
    else { throw new Error(`Unsupported duration unit: ${unit}`); }

    return endDate;
  }

  async getRemindersForPatient(patientId: string) {
    const consultations = await this.prismaService.consultation.findMany({
      where: {
        patientId,
      },
      include: {
        treatments: { include: { treatment: true } },
      },
    });
    const remindersByTreatment: { [key: string]: { description: string; dates: Date[] } } = {};

    for (const consultation of consultations) {
      const consultationDate = consultation.consultationDate;

      for (const consultationTreatment of consultation.treatments) {
        const treatment = consultationTreatment.treatment;
        const { frequencyValue, frequencyUnit, duration, description, instructions } = treatment;

        if (!frequencyValue || !frequencyUnit) { continue; }

        const endTreatmentDate = this.parseDuration(duration, consultationDate);

        let frequencyInHours: number;
        if (frequencyUnit === 'daily') { frequencyInHours = 24 / frequencyValue; }
        else if (frequencyUnit === 'weekly') { frequencyInHours = 168 / frequencyValue; }
        else if (frequencyUnit === 'monthly') { frequencyInHours = 730 / frequencyValue; }
        else { continue; }

        const treatmentDates: Date[] = [];
        let currentDate = new Date(consultationDate);

        while (isBefore(currentDate, endTreatmentDate)) {
          treatmentDates.push(new Date(currentDate));
          currentDate = addHours(currentDate, frequencyInHours);
        }

        remindersByTreatment[treatment.id] = {
          description,
          dates: treatmentDates,
        };
      }
    }
    return remindersByTreatment;
  }
}
