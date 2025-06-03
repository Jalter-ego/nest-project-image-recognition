import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConsultationDto, CreateDiagnosisToConsultationDto, CreateTreatmentToConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConsultationsService {
  constructor(private prismaService: PrismaService) {}

  async create(createConsultationDto: CreateConsultationDto) {
    const user = await this.prismaService.user.findFirst({
      where:{
        id:createConsultationDto.userId
      }
    })
    if(!user)
      throw new NotFoundException("User not exist")

    const patient = await this.prismaService.patient.findFirst({
      where:{
        id:createConsultationDto.patientId
      }
    })
    if(!patient)
      throw new NotFoundException("patient not exist")
    const organization = await this.prismaService.organization.findFirst({
      where:{
        id:createConsultationDto.organizationId
      }
    })
    if(!organization)
      throw new NotFoundException("organization not exist")

    return this.prismaService.consultation.create({
      data:createConsultationDto
    });
  }

  addDiagnosisToConsultation(createDiagnosisToConsultationDto: CreateDiagnosisToConsultationDto){
    return this.prismaService.consultationDiagnosis.create({
      data: createDiagnosisToConsultationDto
    })
  }

  removeDiagnosisToConsultation(createDiagnosisToConsultationDto: CreateDiagnosisToConsultationDto){
    return this.prismaService.consultationDiagnosis.delete({
      where:{
        consultationId_diagnosisId:{
          consultationId: createDiagnosisToConsultationDto.consultationId,
          diagnosisId: createDiagnosisToConsultationDto.diagnosisId
        }
      }
    })
  }

  addTreatmentToConsultation(createTreatmentToConsultationDto: CreateTreatmentToConsultationDto){
    return this.prismaService.consultationTreatment.create({
      data: createTreatmentToConsultationDto
    })
  }

  removeTreatmentToConsultation(createTreatmentToConsultationDto: CreateTreatmentToConsultationDto){
    return this.prismaService.consultationTreatment.delete({
      where:{
        consultationId_treatmentId:{
          consultationId: createTreatmentToConsultationDto.consultationId,
          treatmentId: createTreatmentToConsultationDto.treatmentId
        }
      }
    })
  }

  findAll() {
    return this.prismaService.consultation.findMany();
  }

  findAllByOrganization(id: string){
    return this.prismaService.consultation.findMany({
      where:{
        organizationId:id
      },
      omit:{
        patientId:true,
        organizationId:true,
        userId:true
      },
      include:{
        treatments:{
          omit:{
            consultationId:true,
            treatmentId:true
          },
          include:{
            treatment:true
          }
        },
        diagnoses:{
          omit:{
            consultationId:true,
            diagnosisId:true
          },
          include:{
            diagnosis:true
          }   
        },
        patient:{
          select:{
            id: true,
            name: true,
            aPaternal: true,
            aMaternal: true,
            ci: true,
            sexo: true,
            birthDate: true
          }
        },
        user:{
          select:{
            id:true,
            email:true
          }
        }
      }
    })
  }

  findAllByUser(id: string){
    return this.prismaService.consultation.findMany({
      where:{
        userId:id
      }
    })
  }

  findAllByPatient(id: string){
    return this.prismaService.consultation.findMany({
      where:{
        patientId:id
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
        birthDate: true
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
      where:{
        id:id
      }
    });
  }

  update(id: string, updateConsultationDto: UpdateConsultationDto) {
    return `This action updates a #${id} consultation`;
  }

  remove(id: string) {
    return this.prismaService.consultation.delete({
      where:{
        id:id
      }
    });
  }
}
