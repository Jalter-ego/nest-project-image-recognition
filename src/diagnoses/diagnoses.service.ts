import { Injectable } from '@nestjs/common';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DiagnosesService {
  constructor(private prismaService: PrismaService) {}

  async create(createDiagnosisDto: CreateDiagnosisDto) {
    const diagnosis = await this.prismaService.diagnosis.findFirst({
      where:{
        name:createDiagnosisDto.name,
        organizationId:createDiagnosisDto.organizationId
      }
    })

    if(diagnosis)
      return {alert: 'ya existe un diagnostico con ese nombre'}

    return this.prismaService.diagnosis.create({
      data: createDiagnosisDto,
    });
  }

  findAll() {
    return this.prismaService.diagnosis.findMany();
  }

  findAllByOrganization(id: string) {
    return this.prismaService.diagnosis.findMany({
      where: {
        organizationId: id,
      },
      include:{
        consultations:true
      }
    });
  }

  findAllByUserAndOrganization(userId: string,organizationId:string,inc:boolean){
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

    return this.prismaService.diagnosis.findMany(query);
  }

  findAllByPatientAndOrganization(patientId: string,organizationId:string,inc:boolean){
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
    return this.prismaService.diagnosis.findMany(query);
  }

  findOne(id: string) {
    return this.prismaService.diagnosis.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: string, updateDiagnosisDto: UpdateDiagnosisDto) {
    return `This action updates a #${id} diagnosis`;
  }

  remove(id: string) {
    return this.prismaService.diagnosis.delete({
      where: {
        id: id,
      },
    });
  }
}
