import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    // Verificar si el paciente pertenece a la organización
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: createAppointmentDto.patientId,
        organizationId: createAppointmentDto.organizationId,
      },
    });

    if (!patient) {
      throw new NotFoundException('El paciente no pertenece a esta organización');
    }

    // Verificar si ya existe una cita en la misma fecha y hora
    const existingAppointment = await this.prisma.medicalAppointment.findFirst({
      where: {
        AND: [
          {
            appointmentDateTime: createAppointmentDto.appointmentDateTime,
          },
          {
            organizationId: createAppointmentDto.organizationId,
          },
        ],
      },
    });

    if (existingAppointment) {
      throw new ConflictException('Ya existe una cita programada para esta fecha y hora');
    }

    return this.prisma.medicalAppointment.create({
      data: {
        appointmentDateTime: createAppointmentDto.appointmentDateTime,
        patientId: createAppointmentDto.patientId,
        organizationId: createAppointmentDto.organizationId,
      },
      include: {
        patient: true,
        organization: true
      }
    });
  }

  findAll() {
    return this.prisma.medicalAppointment.findMany({
      include: {
        patient: true,
        organization: true
      },
      orderBy: {
        appointmentDateTime: 'asc'
      }
    });
  }

  findAllByOrganization(organizationId: string) {
    return this.prisma.medicalAppointment.findMany({
      where: {
        organizationId,
      },
      include: {
        patient: true,
        organization: true
      },
      orderBy: {
        appointmentDateTime: 'asc'
      }
    });
  }

  findAllByPatient(patientId: string) {
    return this.prisma.medicalAppointment.findMany({
      where: {
        patientId,
      },
      include: {
        patient: true,
        organization: true
      },
      orderBy: {
        appointmentDateTime: 'asc'
      }
    });
  }

  findOne(id: string) {
    return this.prisma.medicalAppointment.findUnique({
      where: { id },
      include: {
        patient: true,
        organization: true
      }
    });
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    // Si se está actualizando el paciente, verificar que pertenezca a la organización
    if (updateAppointmentDto.patientId) {
      const patient = await this.prisma.patient.findFirst({
        where: {
          id: updateAppointmentDto.patientId,
          organizationId: updateAppointmentDto.organizationId,
        },
      });

      if (!patient) {
        throw new NotFoundException('El paciente no pertenece a esta organización');
      }
    }

    // Si se está actualizando la fecha y hora, verificar duplicados
    if (updateAppointmentDto.appointmentDateTime) {
      const existingAppointment = await this.prisma.medicalAppointment.findFirst({
        where: {
          AND: [
            {
              appointmentDateTime: updateAppointmentDto.appointmentDateTime,
            },
            {
              organizationId: updateAppointmentDto.organizationId,
            },
            {
              id: { not: id }, // Excluir la cita actual
            },
          ],
        },
      });

      if (existingAppointment) {
        throw new ConflictException('Ya existe una cita programada para esta fecha y hora');
      }
    }

    return this.prisma.medicalAppointment.update({
      where: { id },
      data: updateAppointmentDto,
      include: {
        patient: true,
        organization: true
      }
    });
  }

  remove(id: string) {
    return this.prisma.medicalAppointment.delete({
      where: { id }
    });
  }
}
