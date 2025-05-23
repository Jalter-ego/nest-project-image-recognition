import { Injectable } from '@nestjs/common';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TreatmentsService {
  constructor(private prismaService: PrismaService) {}

  create(createTreatmentDto: CreateTreatmentDto) {
    return this.prismaService.treatment.create({
      data:createTreatmentDto
    });
  }

  findAll() {
    return this.prismaService.treatment.findMany();
  }

  findAllByOrganization(id:string){
    return this.prismaService.treatment.findMany({
      where:{
        organizationId: id
      },
      include:{
        consultations:true
      }
    })
  }

  findAllByUserAndOrganization(userId: string,organizationId:string){
    return this.prismaService.treatment.findMany({
      where:{
        organizationId: organizationId,
        consultations:{
          some:{
            consultation:{
              userId: userId
            }
          }
        }
      },
      include:{
        consultations:{
          include:{
            consultation:{
              select:{
                id: true,
                consultationDate: true,
                motivo: true,
                patient:{
                  select:{
                    name:true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  findAllByPatientAndOrganization(patientId: string,organizationId:string){
    return this.prismaService.treatment.findMany({
      where:{
        organizationId: organizationId,
        consultations:{
          some:{
            consultation:{
              patientId: patientId
            }
          }
        }
      },
      include:{
        consultations:{
          include:{
            consultation:{
              select:{
                id: true,
                consultationDate: true,
                motivo: true,
                patient:{
                  select:{
                    name:true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  findOne(id: string) {
    return this.prismaService.treatment.findFirst({
      where:{
        id:id
      }
    });
  }

  update(id: string, updateTreatmentDto: UpdateTreatmentDto) {
    return `This action updates a #${id} treatment`;
  }

  remove(id: string) {
    return this.prismaService.treatment.delete({
      where:{
        id:id
      }
    });
  }
}
