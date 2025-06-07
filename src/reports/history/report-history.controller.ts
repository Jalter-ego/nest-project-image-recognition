import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsHistoryService } from './report-history.service';

@ApiTags('reportHistory')
@Controller('reportHistory')
export class ReportsController {
    constructor(private readonly reportsService: ReportsHistoryService) { }

    @Get('patient/:id/history')
    @ApiOperation({
        summary: 'Generar y descargar el historial médico completo de un paciente en PDF'
    })
    @ApiParam({ name: 'id', description: 'ID del paciente' })
    @ApiResponse({
        status: 200,
        description: 'Documento PDF del historial médico del paciente',
        content: { 'application/pdf': {} }
    })
    @ApiResponse({
        status: 404,
        description: 'Paciente no encontrado'
    })
    @ApiResponse({
        status: 500,
        description: 'Error al generar el PDF'
    })
    async downloadPatientMedicalHistory(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
            const pdfStream = await this.reportsService.generateMedicalHistoryPdf(id);

            res.status(HttpStatus.OK).set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="historial-medico-${id}.pdf"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });

            pdfStream.pipe(res);
            pdfStream.end();
        } catch (error) {
            res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Error al generar el historial médico en PDF'
            });
        }
    }
}
