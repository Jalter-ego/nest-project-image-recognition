import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FilterTreatmentsDto } from '../reports/dto/filter_treatments.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Post('filterTreatments')
  @ApiOperation({
    summary: 'Generate and download a PDF report of treatments filtered by patient and organization',
  })
  @ApiBody({ type: FilterTreatmentsDto })
  @ApiResponse({
    status: 200,
    description: 'PDF document with filtered treatments',
    content: { 'application/pdf': {} }
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate PDF report',
  })
  async findFilteredByPatientAndOrg(@Body() filterDto: FilterTreatmentsDto, @Res() res: Response) {
    try {
      const pdfDoc = await this.reportsService.findFilteredByPatientAndOrg(filterDto);

      res.status(HttpStatus.OK).set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="treatments-report.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Failed to generate PDF report: ${error.message}`,
      });
    }
  }
}
