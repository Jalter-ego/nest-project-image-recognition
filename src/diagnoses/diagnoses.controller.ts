import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DiagnosesService } from './diagnoses.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('diagnoses')
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @Post()
  create(@Body() createDiagnosisDto: CreateDiagnosisDto) {
    return this.diagnosesService.create(createDiagnosisDto);
  }

  @Get()
  findAll() {
    return this.diagnosesService.findAll();
  }

  @Get('organization/:id')
  findAllByOrganization(@Param('id') id: string) {
    return this.diagnosesService.findAllByOrganization(id);
  }

  @Get('by-user-org')
  @ApiOperation({
    summary:
      'url example: diagnoses/organization?userId=scscdm&orgId=scdscs&include=true',
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
    return this.diagnosesService.findAllByUserAndOrganization(
      userId,
      orgId,
      include,
    );
  }

  @Get('by-pat-org')
  @ApiOperation({
    summary: 'url example: diagnoses/organization?userId=scscdm&orgId=scdscs&include=true',
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
    return this.diagnosesService.findAllByPatientAndOrganization(
      patId,
      orgId,
      include,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnosesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiagnosisDto: UpdateDiagnosisDto,
  ) {
    return this.diagnosesService.update(id, updateDiagnosisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagnosesService.remove(id);
  }
}
