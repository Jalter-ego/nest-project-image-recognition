import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalReportDto } from './dto/create-medical-report.dto';
import { UpdateMedicalReportDto } from './dto/update-medical-report.dto';

@Injectable()
export class MedicalReportsService {
  constructor(private prisma: PrismaService,
    private readonly firebaseService: FirebaseService) { }

  async create(createMedicalReportDto: CreateMedicalReportDto) {
    const medicalReport = await this.prisma.medicalReport.create({
      data: createMedicalReportDto,
    });

    await this.firebaseService.sendNotificationToPatient(
      createMedicalReportDto.patientId,
      'Nuevo informe médico disponible',
      'Se ha creado un nuevo informe médico para ti',
      { reportId: medicalReport.id },
    );

    return medicalReport;
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