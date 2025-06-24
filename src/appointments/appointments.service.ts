import {Injectable,ConflictException,NotFoundException,BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('La hora de inicio debe ser menor a la de fin');
    }

    const [year, month, day] = dto.date.split('-').map(Number);
    const appointmentDate = new Date(year, month - 1, day);
    appointmentDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      throw new BadRequestException('No se puede agendar citas en fechas pasadas');
    }

    const patient = await this.prisma.patient.findFirst({
      where: {
        id: dto.patientId,
        organizationId: dto.organizationId,
      },
    });

    if (!patient) {
      throw new NotFoundException('El paciente no pertenece a esta organización');
    }

    const overlapping = await this.prisma.medicalAppointment.findFirst({
      where: {
        organizationId: dto.organizationId,
        date: dto.date,
        OR: [
          {
            startTime: { lt: dto.endTime },
            endTime: { gt: dto.startTime },
          },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictException('Ya existe una cita en ese rango de horario');
    }

    return this.prisma.medicalAppointment.create({
      data: {
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        patientId: dto.patientId,
        organizationId: dto.organizationId,
        estado: dto.estado ?? 'pendiente',
      },
      include: {
        patient: true,
        organization: true,
      },
    });
  }

  findAll() {
    return this.prisma.medicalAppointment.findMany({
      include: {
        patient: true,
        organization: true,
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  findAllByOrganization(organizationId: string) {
    return this.prisma.medicalAppointment.findMany({
      where: {
        organizationId,
      },
      include: {
        patient: true,
        organization: true,
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  findAllByPatient(patientId: string) {
    return this.prisma.medicalAppointment.findMany({
      where: {
        patientId,
      },
      include: {
        patient: true,
        organization: true,
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.medicalAppointment.findUnique({
      where: { id },
      include: {
        patient: true,
        organization: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    if (dto.startTime && dto.endTime && dto.startTime >= dto.endTime) {
      throw new BadRequestException('La hora de inicio debe ser menor a la de fin');
    }

    if (dto.patientId && dto.organizationId) {
      const patient = await this.prisma.patient.findFirst({
        where: {
          id: dto.patientId,
          organizationId: dto.organizationId,
        },
      });

      if (!patient) {
        throw new NotFoundException('El paciente no pertenece a esta organización');
      }
    }

    if (dto.date && dto.startTime && dto.endTime && dto.organizationId) {
      const overlapping = await this.prisma.medicalAppointment.findFirst({
        where: {
          organizationId: dto.organizationId,
          date: dto.date,
          id: { not: id },
          OR: [
            {
              startTime: { lt: dto.endTime },
              endTime: { gt: dto.startTime },
            },
          ],
        },
      });

      if (overlapping) {
        throw new ConflictException('Ya existe una cita en ese rango de horario');
      }
    }

    return this.prisma.medicalAppointment.update({
      where: { id },
      data: dto,
      include: {
        patient: true,
        organization: true,
      },
    });
  }

  async remove(id: string) {
    const appointment = await this.prisma.medicalAppointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    return this.prisma.medicalAppointment.delete({
      where: { id },
    });
  }
}