import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrinterService } from '../../printer/printer.service';
import { ReportGeneratorService } from '../report-generator.service';
import { FilterTreatmentsDto } from './dto/filter_treatments.dto';
import { FormattedTreatment, RawTreatmentResult } from './types/treatment.type';

@Injectable()
export class ReportsService {
    constructor(
        private prismaService: PrismaService,
        private printerService: PrinterService,
        private reportGeneratorService: ReportGeneratorService
    ) { }

    async findFilteredByPatientAndOrg(filters: FilterTreatmentsDto): Promise<any> {
        // Sanitize undefined and prepare dynamic query
        const safeFilters: FilterTreatmentsDto = {
            patId: filters.patId,
            orgId: filters.orgId,
            frequencyUnit: filters.frequencyUnit,
            minApplications: filters.minApplications,
            startDate: filters.startDate,
            endDate: filters.endDate,
        };

        try {
            // Build dynamic WHERE conditions and parameters
            const conditions: string[] = [];
            const params: any[] = [];
            let paramIndex = 1;

            if (safeFilters.orgId !== undefined) {
                conditions.push(`t."organizationId" = $${paramIndex}`);
                params.push(safeFilters.orgId);
                paramIndex++;
            }

            if (safeFilters.frequencyUnit !== undefined) {
                conditions.push(`t."frequencyUnit" = $${paramIndex}::"FrequencyUnit"`);
                params.push(safeFilters.frequencyUnit);
                paramIndex++;
            }

            if (safeFilters.patId !== undefined) {
                conditions.push(`c."patientId" = $${paramIndex}`);
                params.push(safeFilters.patId);
                paramIndex++;
            }

            if (safeFilters.startDate !== undefined) {
                conditions.push(`c."consultationDate" >= $${paramIndex}::TIMESTAMP`);
                params.push(safeFilters.startDate);
                paramIndex++;
            }

            if (safeFilters.endDate !== undefined) {
                conditions.push(`c."consultationDate" <= $${paramIndex}::TIMESTAMP`);
                params.push(safeFilters.endDate);
                paramIndex++;
            }

            if (safeFilters.minApplications !== undefined) {
                conditions.push(`
                    CASE 
                        WHEN t."frequencyUnit" = 'daily' THEN 
                            CAST(REGEXP_REPLACE(COALESCE(t.duration, '0'), '\\D+', '') AS INTEGER) * COALESCE(t."frequencyValue", 0)
                        WHEN t."frequencyUnit" = 'weekly' THEN 
                            CAST(REGEXP_REPLACE(COALESCE(t.duration, '0'), '\\D+', '') AS INTEGER) * COALESCE(t."frequencyValue", 0)
                        WHEN t."frequencyUnit" = 'monthly' THEN 
                            CAST(REGEXP_REPLACE(COALESCE(t.duration, '0'), '\\D+', '') AS INTEGER) * COALESCE(t."frequencyValue", 0)
                        ELSE 0
                    END >= $${paramIndex}
                `);
                params.push(safeFilters.minApplications);
                paramIndex++;
            }

            // Construct the WHERE clause (default to TRUE if no conditions)
            const whereClause = conditions.length > 0 ? conditions.join(' AND ') : 'TRUE';

            // Raw SQL query with dynamic conditions
            const treatments: RawTreatmentResult[] = await this.prismaService.$queryRawUnsafe(`
                SELECT 
                    t.id, 
                    t.description, 
                    t.duration, 
                    t.instructions, 
                    t."frequencyValue" AS "frequencyValue", 
                    t."frequencyUnit" AS "frequencyUnit", 
                    t."organizationId" AS "organizationId",
                    c."id" AS "consultation_id", 
                    c."consultationDate" AS "consultationDate", 
                    c."motivo" AS "motivo", 
                    p."name" AS "patient_name"
                FROM "Treatment" t
                LEFT JOIN "ConsultationTreatment" ct ON t.id = ct."treatmentId"
                LEFT JOIN "Consultation" c ON ct."consultationId" = c.id
                LEFT JOIN "Patient" p ON c."patientId" = p.id
                WHERE ${whereClause}
                ORDER BY c."consultationDate" DESC
            `, ...params);

            // Group results by treatment to handle multiple consultations
            const treatmentMap = new Map<string, FormattedTreatment>();
            for (const t of treatments) {
                if (!treatmentMap.has(t.id)) {
                    treatmentMap.set(t.id, {
                        id: t.id,
                        description: t.description,
                        duration: t.duration,
                        instructions: t.instructions,
                        frequencyValue: t.frequencyValue,
                        frequencyUnit: t.frequencyUnit,
                        organizationId: t.organizationId,
                        consultations: [],
                    });
                }
                if (t.consultation_id) {
                    treatmentMap.get(t.id)!.consultations.push({
                        consultation: {
                            id: t.consultation_id,
                            consultationDate: t.consultationDate!,
                            motivo: t.motivo!,
                            patient: { name: t.patient_name! },
                        },
                    });
                }
            }
            const formattedTreatments = Array.from(treatmentMap.values());

            // Generate PDF document definition using ReportGeneratorService
            const docDefinition = await this.reportGeneratorService.generateTreatmentReportPdfDefinition(formattedTreatments, safeFilters);

            // Generate PDF document
            return this.printerService.createPdf(docDefinition);
        } catch (error) {
            throw new Error(`Failed to fetch treatments or generate PDF: ${error.message}`);
        }
    }
}