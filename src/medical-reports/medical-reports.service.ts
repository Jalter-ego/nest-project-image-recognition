import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalReportDto } from './dto/create-medical-report.dto';
import { UpdateMedicalReportDto } from './dto/update-medical-report.dto';

@Injectable()
export class MedicalReportsService {
  constructor(private prisma: PrismaService) {}

  create(createMedicalReportDto: CreateMedicalReportDto) {
    return this.prisma.medicalReport.create({
      data: createMedicalReportDto,
    });
  }

  findAll() {
    return this.prisma.medicalReport.findMany();
  }

  findAllByOrganization(organizationId: string) {
    return this.prisma.medicalReport.findMany({
      where: { organizationId },
    });
  }

  findOne(id: string) {
    return this.prisma.medicalReport.findUnique({
      where: { id },
    });
  }

  update(id: string, updateMedicalReportDto: UpdateMedicalReportDto) {
    return this.prisma.medicalReport.update({
      where: { id },
      data: updateMedicalReportDto,
    });
  }

  remove(id: string) {
    return this.prisma.medicalReport.delete({
      where: { id },
    });
  }

  findAllByPatient(patientId: string) {
    return this.prisma.medicalReport.findMany({
      where: { patientId },
    });
  }
} 