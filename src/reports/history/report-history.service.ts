import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrinterService } from '../../printer/printer.service';
import { ReportGeneratorService } from '../report-generator.service';

@Injectable()
export class ReportsHistoryService {
    constructor(
        private prismaService: PrismaService,
        private printerService: PrinterService,
        private reportGeneratorService: ReportGeneratorService,
    ) { }

    async generateMedicalHistoryPdf(patientId: string) {
        const patient = await this.prismaService.patient.findUnique({
            where: { id: patientId },
            select: {
                id: true,
                name: true,
                aPaternal: true,
                aMaternal: true,
                ci: true,
                sexo: true,
                birthDate: true,
                phone: true,
                email: true,
                createdAt: true,
                organization: {
                    select: {
                        id: true,
                        name: true,
                        hostUser: true
                    }
                }
            }
        });

        if (!patient) throw new Error('Paciente no encontrado');

        const consultations = await this.prismaService.consultation.findMany({
            where: { patientId },
            include: {
                user: {
                    select: { email: true }
                },
                diagnoses: {
                    include: { diagnosis: true }
                },
                treatments: {
                    include: { treatment: true }
                }
            },
            orderBy: { consultationDate: 'desc' }
        });

        const formattedHistory = consultations.map(consultation => ({
            id: consultation.id,
            date: consultation.consultationDate,
            motivo: consultation.motivo,
            observaciones: consultation.observaciones,
            doctor: consultation.user.email,
            diagnoses: consultation.diagnoses.map(d => ({
                id: d.diagnosis.id,
                name: d.diagnosis.name,
                description: d.diagnosis.description
            })),
            treatments: consultation.treatments.map(t => ({
                id: t.treatment.id,
                description: t.treatment.description,
                duration: t.treatment.duration,
                instructions: t.treatment.instructions,
                frequencyValue: t.treatment.frequencyValue,
                frequencyUnit: t.treatment.frequencyUnit
            }))
        }));

        const docDefinition = await this.reportGeneratorService.generateMedicalHistoryPdfDefinition(patient, formattedHistory);
        return this.printerService.createPdf(docDefinition);
    }
}
