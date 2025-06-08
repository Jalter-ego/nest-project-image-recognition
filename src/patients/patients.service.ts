import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) { }

  create(createPatientDto: CreatePatientDto) {
    return this.prisma.patient.create({
      data: createPatientDto,
    });
  }

  findAll() {
    return this.prisma.patient.findMany();
  }

  findAllByOrganization(organizationId: string) {
    return this.prisma.patient.findMany({
      where: {
        organizationId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
    });
  }

  update(id: string, updatePatientDto: UpdatePatientDto) {
    return this.prisma.patient.update({
      where: { id },
      data: updatePatientDto,
    });
  }

  remove(id: string) {
    return this.prisma.patient.delete({
      where: { id },
    });
  }

  async updateByCI(ci: number, updatePatientDto: UpdatePatientDto) {
    return this.prisma.patient.update({
      where: { 
        organizationId_ci:{
          ci:ci,
          organizationId: updatePatientDto.organizationId as string
        }
       },
      data: updatePatientDto,
    });
  }
}
