import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { TreatmentsService } from './treatments.service';

@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) { }

  @Post()
  @ApiBody({ type: CreateTreatmentDto })
  create(@Body() createTreatmentDto: CreateTreatmentDto) {
    return this.treatmentsService.create(createTreatmentDto);
  }

  @Get()
  findAll() {
    return this.treatmentsService.findAll();
  }

  @Get('organization/:id')
  @ApiParam({ name: 'id', description: 'id de la organizacion' })
  findAllByOrganization(@Param('id') id: string) {
    return this.treatmentsService.findAllByOrganization(id);
  }

  @Get('by-user-org')
  @ApiOperation({
    summary: 'url example: treatments/organization?userId=scscdm&orgId=scdscs',
  })
  @ApiQuery({ name: 'userId', description: 'id del usuario' })
  @ApiQuery({ name: 'orgId', description: 'id de la organizacion' })
  @ApiQuery({
    name: 'include',
    description: 'boolean para que incluya datos mas a fondo',
  })
  findByUserAndOrg(
    @Query('userId') userId: string,
    @Query('orgId') orgId: string,
    @Query('include') include: boolean,
  ) {
    return this.treatmentsService.findAllByUserAndOrganization(
      userId,
      orgId,
      include,
    );
  }

  @Get('by-pat-org')
  @ApiOperation({
    summary: 'url example: treatments/organization?userId=scscdm&orgId=scdscs',
  })
  @ApiQuery({ name: 'patId', description: 'id del paciente' })
  @ApiQuery({ name: 'orgId', description: 'id de la organizacion' })
  @ApiQuery({
    name: 'include',
    description: 'boolean para que incluya datos mas a fondo',
  })
  findByPatientAndOrg(
    @Query('patId') patId: string,
    @Query('orgId') orgId: string,
    @Query('include') include: boolean,
  ) {
    return this.treatmentsService.findAllByPatientAndOrganization(patId, orgId, include);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'id del tratamiento' })
  findOne(@Param('id') id: string) {
    return this.treatmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
  ) {
    return this.treatmentsService.update(id, updateTreatmentDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'id del tratamiento' })
  remove(@Param('id') id: string) {
    return this.treatmentsService.remove(id);
  }

  @Get('reminders/patient/:patientId')
  async getRemindersForPatient(@Param('patientId') patientId: string) {
    return this.treatmentsService.getRemindersForPatient(patientId);
  }
}
