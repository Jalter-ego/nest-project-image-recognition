import { Injectable } from '@nestjs/common';
import { Content, DynamicContent, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { OrganizationsService } from '../organizations/organizations.service';
import { PatientsService } from '../patients/patients.service';
import { FilterTreatmentsDto } from './treatment/dto/filter_treatments.dto';
import { FormattedTreatment } from './treatment/types/treatment.type';

@Injectable()
export class ReportGeneratorService {
    constructor(private organizationsService: OrganizationsService, private patientsService: PatientsService) { }

    //funciones reutilizables
    private buildPdfHeader(title: string): Content {
        return {
            columns: [
                { image: 'src/assets/logo.png', width: 60 },
                { text: title, style: 'header', alignment: 'right', margin: [0, 20, 0, 0] }
            ],
            margin: [40, 20, 40, 10]
        };
    }

    private buildPdfFooter(): DynamicContent {
        return (currentPage, pageCount) => ({
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'center',
            margin: [0, 10, 0, 20],
            fontSize: 10,
            color: '#666'
        });
    }

    private buildPatientAndOrgInfo(patient: any, organization: any): Content {
        return {
            columns: [
                {
                    width: '50%',
                    stack: [
                        { text: `Nombre: ${patient.name} ${patient.aPaternal || ''} ${patient.aMaternal || ''}`, style: 'patientInfo' },
                        { text: `CI: ${patient.ci}` },
                        { text: `Sexo: ${patient.sexo}` },
                        { text: `Fecha de Nacimiento: ${new Date(patient.birthDate).toLocaleDateString('es-BO')}` },
                        { text: `Email: ${patient.email}` },
                        { text: `Teléfono: ${patient.phone}` },
                        { text: `Miembro desde: ${new Date(patient.createdAt).toLocaleDateString('es-BO')}` }
                    ]
                },
                {
                    width: '50%',
                    stack: [
                        { text: 'Santa Cruz de la Sierra', style: 'locationInfo' },
                        { text: `Organización: ${organization.name}` },
                        { text: `Responsable: ${organization.hostUser}` },
                        { text: [{ text: 'Sitio Web: ', decoration: 'underline' }, { text: 'www.Derma-AI.com', link: 'https://www.Derma-AI.com', color: '#1E90FF' }] },
                        { qr: 'https://www.Derma-AI.com', fit: 80, alignment: 'right' }
                    ],
                    alignment: 'right'
                }
            ],
            margin: [0, 10, 0, 20]
        };
    }

    private buildGenerationDate(): Content {
        return {
            text: `Generado el: ${new Date().toLocaleDateString('es-BO', { timeZone: 'America/La_Paz' })} ${new Date().toLocaleTimeString('es-BO', { timeZone: 'America/La_Paz', hour: '2-digit', minute: '2-digit' })}`,
            style: 'subText'
        };
    }

    private getCommonStyles(): StyleDictionary {
        return {
            header: { fontSize: 20, bold: true, color: '#2c3e50', margin: [0, 0, 0, 10] },
            patientInfo: { fontSize: 12, bold: true, color: '#34495e' },
            locationInfo: { fontSize: 12, bold: true, color: '#34495e' },
            sectionHeader: { fontSize: 16, bold: true, color: '#2980b9', decoration: 'underline' },
            subSectionHeader: { fontSize: 14, bold: true, color: '#3498db' },
            treatmentHeader: { fontSize: 15, bold: true, color: '#27ae60', margin: [0, 10, 0, 10] },
            subText: { fontSize: 10, color: '#7f8c8d' },
            tableHeader: { fontSize: 12, bold: true, fillColor: '#ecf0f1', color: '#2c3e50' }
        };
    }

    private buildSignatureBlock(): Content {
        return {
            stack: [
                { image: 'src/assets/firma.png', width: 100, alignment: 'center', margin: [0, 20, 0, 5] },
            ]
        };
    }

    async generateTreatmentReportPdfDefinition(
        treatments: FormattedTreatment[],
        filters: FilterTreatmentsDto
    ): Promise<TDocumentDefinitions> {
        const organization = await this.organizationsService.findOne(filters.orgId!);
        const patient = await this.patientsService.findOne(filters.patId!);
        let treatmentNumber = 1;

        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            header: this.buildPdfHeader('Reporte de Tratamientos'),
            footer: this.buildPdfFooter(),
            content: [
                this.buildPatientAndOrgInfo(patient, organization),
                {
                    text: 'Fecha y Hora', style: 'sectionHeader'
                },
                this.buildGenerationDate(),
                {
                    canvas: [{
                        type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#ccc'
                    }], margin: [0, 10, 0, 20]
                },
                {
                    text: 'Filtros Utilizados', style: 'sectionHeader', margin: [0, 0, 0, 5]
                },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [{ text: 'Filtro', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
                            ...(filters.frequencyUnit ? [['Unidad de Frecuencia', filters.frequencyUnit]] : []),
                            ...(filters.minApplications ? [['Cantidad Mínima de Aplicaciones', `${filters.minApplications}`]] : []),
                            ...(filters.startDate ? [['Fecha de Inicio', new Date(filters.startDate).toLocaleDateString('es-BO')]] : []),
                            ...(filters.endDate ? [['Fecha de Fin', new Date(filters.endDate).toLocaleDateString('es-BO')]] : [])
                        ].filter(row => row.length > 0)
                    },
                    margin: [0, 5, 0, 20],
                    layout: 'lightHorizontalLines'
                },
                {
                    canvas: [{
                        type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#ccc'
                    }], margin: [0, 10, 0, 20]
                },
                ...treatments.map(treatment => [
                    {
                        text: `Tratamiento ${treatmentNumber++}`, style: 'treatmentHeader', margin: [0, 0, 0, 10]
                    },
                    {
                        table: {
                            widths: ['*', 'auto'],
                            body: [
                                [{ text: 'Descripción', style: 'tableHeader' }, { text: treatment.description || 'N/A' }],
                                [{ text: 'Duración', style: 'tableHeader' }, { text: treatment.duration || 'N/A' }],
                                [{ text: 'Instrucciones', style: 'tableHeader' }, { text: treatment.instructions || 'N/A' }],
                                [{ text: 'Frecuencia', style: 'tableHeader' }, { text: `${treatment.frequencyValue} ${treatment.frequencyUnit || 'N/A'}` }]
                            ]
                        },
                        margin: [0, 0, 0, 15],
                        layout: 'lightHorizontalLines'
                    },
                    {
                        text: 'Consultas Asociadas', style: 'subSectionHeader', margin: [0, 0, 0, 5]
                    },
                    treatment.consultations.length > 0
                        ? {
                            table: {
                                widths: ['auto', '*'],
                                body: [
                                    [{ text: 'Fecha', style: 'tableHeader' },
                                    { text: 'Motivo', style: 'tableHeader' }],
                                    ...treatment.consultations.map(consultation => [
                                        new Date(consultation.consultation.consultationDate).toLocaleDateString('es-BO'),
                                        consultation.consultation.motivo || 'N/A'
                                    ])
                                ]
                            },
                            margin: [0, 0, 0, 20],
                            layout: 'lightHorizontalLines'
                        }
                        : {
                            text: 'No hay consultas asociadas.', style: 'subText', margin: [0, 0, 0, 20]
                        },
                    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#ccc' }], margin: [0, 10, 0, 20] }
                ]),
                this.buildSignatureBlock()
            ] as Content[],
            styles: this.getCommonStyles(),
            defaultStyle: {
                font: 'Roboto', fontSize: 11
            }
        };
    }

    async generateMedicalHistoryPdfDefinition(patient: any, history: any[]): Promise<TDocumentDefinitions> {
        let consultationNumber = 1;

        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            header: this.buildPdfHeader('Historial Médico del Paciente'),
            footer: this.buildPdfFooter(),
            content: [
                this.buildPatientAndOrgInfo(patient, patient.organization),
                { text: `Historial de Consultas (${history.length})`, style: 'sectionHeader', margin: [0, 0, 0, 15] },
                ...history.flatMap(consultation => [
                    {
                        text: `Consulta ${consultationNumber++} - ${new Date(consultation.date).toLocaleDateString('es-BO')}`,
                        style: 'treatmentHeader'
                    },
                    {
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [{ text: 'Motivo', style: 'tableHeader' }, consultation.motivo],
                                [{ text: 'Observaciones', style: 'tableHeader' }, consultation.observaciones || 'N/A'],
                                [{ text: 'Médico Responsable', style: 'tableHeader' }, consultation.doctor || 'N/A']
                            ]
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, 0, 0, 10]
                    },
                    {
                        text: 'Diagnósticos',
                        style: 'subSectionHeader'
                    },
                    consultation.diagnoses.length > 0
                        ? { ul: consultation.diagnoses.map(d => `${d.name}: ${d.description}`) } :
                        { text: 'Sin diagnósticos registrados.', style: 'subText' },
                    { text: 'Tratamientos Aplicados', style: 'subSectionHeader', margin: [10, 10, 0, 0] },
                    consultation.treatments.length > 0
                        ? {
                            table: {
                                widths: ['auto', '*'],
                                body: [
                                    [
                                        { text: 'Tratamiento', style: 'tableHeader' },
                                        { text: 'Detalle', style: 'tableHeader' }
                                    ],
                                    ...consultation.treatments.map(t => [
                                        t.description,
                                        `${t.instructions || ''} (${t.duration || ''}) - ${t.frequencyValue || ''} ${t.frequencyUnit || ''}`
                                    ])
                                ]
                            },
                            layout: 'lightHorizontalLines',
                            margin: [0, 0, 0, 20]
                        }
                        : {
                            text: 'Sin tratamientos registrados.', style: 'subText', margin: [0, 0, 0, 20]
                        },
                    {
                        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#ccc' }],
                        margin: [0, 10, 0, 20]
                    }
                ]),
                this.buildSignatureBlock()
            ] as Content[],
            styles: this.getCommonStyles(),
            defaultStyle: {
                font: 'Roboto', fontSize: 11
            }
        };
    }
}