import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import {
  CreateConsultationDto,
  CreateDiagnosisToConsultationDto,
  CreateTreatmentToConsultationDto,
} from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiBody({ type: CreateConsultationDto })
  create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(createConsultationDto);
  }

  @Post('diagnosis')
  @ApiBody({ type: CreateDiagnosisToConsultationDto })
  addDiagnosisToConsultation(
    @Body() createDiagnosisToConsultationDto: CreateDiagnosisToConsultationDto,
  ) {
    return this.consultationsService.addDiagnosisToConsultation(
      createDiagnosisToConsultationDto,
    );
  }

  @Delete('diagnosis')
  @ApiBody({ type: CreateDiagnosisToConsultationDto })
  removeDiagnosisToConsultation(
    @Body() createDiagnosisToConsultationDto: CreateDiagnosisToConsultationDto,
  ) {
    return this.consultationsService.removeDiagnosisToConsultation(
      createDiagnosisToConsultationDto,
    );
  }

  @Post('treatment')
  @ApiBody({ type: CreateTreatmentToConsultationDto })
  addTreatmentToConsultation(
    @Body() createTreatmentToConsultationDto: CreateTreatmentToConsultationDto,
  ) {
    return this.consultationsService.addTreatmentToConsultation(
      createTreatmentToConsultationDto,
    );
  }

  @Delete('treatment')
  @ApiBody({ type: CreateTreatmentToConsultationDto })
  removeTreatmentToConsultation(
    @Body() createTreatmentToConsultationDto: CreateTreatmentToConsultationDto,
  ) {
    return this.consultationsService.removeTreatmentToConsultation(
      createTreatmentToConsultationDto,
    );
  }

  @Get()
  findAll() {
    return this.consultationsService.findAll();
  }

  @Get('organization/:id')
  @ApiParam({name:"id de la organizacion"})
  findAllByOrganization(@Param('id') id:string){
    return this.consultationsService.findAllByOrganization(id)
  }

  @Get('user/:id')
  @ApiParam({name:"id del usuario"})
  findAllByUser(@Param('id') id:string){
    return this.consultationsService.findAllByUser(id)
  }

  @Get('patient/:id')
  @ApiParam({name:"id del paciente"})
  findAllByPatient(@Param('id') id:string){
    return this.consultationsService.findAllByPatient(id)
  }

  @Get('patient/:id/history')
  @ApiParam({name:"id del paciente"})
  findAllDetailedByPatient(@Param('id') id:string){
    return this.consultationsService.findAllDetailedByPatient(id)
  }

  @Get(':id')
  @ApiParam({name:"id de la consulta"})
  findOne(@Param('id') id: string) {
    return this.consultationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ) {
    return this.consultationsService.update(id, updateConsultationDto);
  }

  @Delete(':id')
  @ApiParam({name:"id de la consulta"})
  remove(@Param('id') id: string) {
    return this.consultationsService.remove(id);
  }
}
