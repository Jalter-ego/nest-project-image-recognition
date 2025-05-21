import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      return await this.appointmentsService.create(createAppointmentDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al crear la cita', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll(
    @Query('organizationId') organizationId?: string,
    @Query('patientId') patientId?: string,
  ) {
    if (organizationId) {
      return this.appointmentsService.findAllByOrganization(organizationId);
    }
    if (patientId) {
      return this.appointmentsService.findAllByPatient(patientId);
    }
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    try {
      return await this.appointmentsService.update(id, updateAppointmentDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al actualizar la cita', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
