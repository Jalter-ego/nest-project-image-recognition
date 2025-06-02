import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { FilterTreatmentsDto } from '../reports/dto/filter_treatments.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  
  @Post('filterTreatments')
  @ApiOperation({
    summary: 'Filter treatments by patient, organization, and other criteria',
  })
  @ApiBody({ type: FilterTreatmentsDto })
  @ApiResponse({
    status: 200,
    description: 'PDF document with filtered treatments',
    content: { 'application/pdf': {} }
  })
  async findFilteredByPatientAndOrg(@Body() filterDto: FilterTreatmentsDto, @Res() res: Response) {
    const pdfDoc = await this.reportsService.findFilteredByPatientAndOrg(filterDto);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=treatments-report.pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  }
}