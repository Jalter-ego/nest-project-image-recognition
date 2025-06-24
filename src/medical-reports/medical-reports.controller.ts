import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateMedicalReportDto } from './dto/create-medical-report.dto';
import { UpdateMedicalReportDto } from './dto/update-medical-report.dto';
import { MedicalReportsService } from './medical-reports.service';
import { MedicalReportGeneratorService } from '../reports/medical-report-generator.service';
import PdfPrinter from 'pdfmake';

@Controller('medical-reports')
export class MedicalReportsController {
  constructor(
    private readonly medicalReportsService: MedicalReportsService,
    private readonly medicalReportGeneratorService: MedicalReportGeneratorService
  ) {}

  @Post()
  create(@Body() createMedicalReportDto: CreateMedicalReportDto) {
    return this.medicalReportsService.create(createMedicalReportDto);
  }

  @Get()
  findAll(@Query('organizationId') organizationId?: string) {
    if (organizationId) {
      return this.medicalReportsService.findAllByOrganization(organizationId);
    }
    return this.medicalReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalReportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicalReportDto: UpdateMedicalReportDto) {
    return this.medicalReportsService.update(id, updateMedicalReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalReportsService.remove(id);
  }

  @Get(':id/pdf')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfDefinition = await this.medicalReportGeneratorService.generateMedicalReportPdfDefinition(id);
      
      const fonts = {
        Roboto: {
          normal: 'fonts/Roboto-Regular.ttf',
          bold: 'fonts/Roboto-Medium.ttf',
          italics: 'fonts/Roboto-Italic.ttf',
          bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
      };

      const printer = new PdfPrinter(fonts);
      const pdfDoc = printer.createPdfKitDocument(pdfDefinition);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=informe-medico-${id}.pdf`);

      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  @Get('organization/:organizationId/pdf')
  async generateOrganizationPdf(@Param('organizationId') organizationId: string, @Res() res: Response) {
    try {
      const medicalReports = await this.medicalReportsService.findAllByOrganization(organizationId);
      const pdfDefinition = await this.medicalReportGeneratorService.generateMedicalReportsListPdfDefinition(organizationId, medicalReports);
      
      const fonts = {
        Roboto: {
          normal: 'fonts/Roboto-Regular.ttf',
          bold: 'fonts/Roboto-Medium.ttf',
          italics: 'fonts/Roboto-Italic.ttf',
          bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
      };

      const printer = new PdfPrinter(fonts);
      const pdfDoc = printer.createPdfKitDocument(pdfDefinition);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=informes-organizacion-${organizationId}.pdf`);

      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  @Get('by-patient/:patientId')
  findAllByPatient(@Param('patientId') patientId: string) {
    return this.medicalReportsService.findAllByPatient(patientId);
  }
} 