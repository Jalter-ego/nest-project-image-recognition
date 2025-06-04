import { Injectable } from '@nestjs/common';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TreatmentsService {
  constructor(private prismaService: PrismaService) {}

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

  async  update(id: string, updateTreatmentDto: UpdateTreatmentDto) {
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
}
