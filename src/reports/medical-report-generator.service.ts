import { Injectable } from '@nestjs/common';
import { Content, DynamicContent, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { OrganizationsService } from '../organizations/organizations.service';
import { PatientsService } from '../patients/patients.service';
import { MedicalReportsService } from '../medical-reports/medical-reports.service';

@Injectable()
export class MedicalReportGeneratorService {
    constructor(
        private organizationsService: OrganizationsService,
        private patientsService: PatientsService,
        private medicalReportsService: MedicalReportsService
    ) { }

    private buildPdfHeader(title: string, subTitle: string): Content {
        return {
            margin: [40, 10, 40, 30],
            columns: [
                { image: 'src/assets/logo.png', width: 60 },
                {
                    width: '*',
                    alignment: 'right',

                    stack: [
                        { text: title, style: 'header' },
                        { text: subTitle, style: 'subHeader' },
                    ]
                }
            ]
            
        };
    }

    private buildPdfFooter(): DynamicContent {
        return (currentPage, pageCount) => ({
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'center',
            margin: [0, 10, 0, 20],
            fontSize: 10,
            color: '#666',
            
        });
    }

    private translateGender(gender: string | undefined): string {
        const map: Record<string, string> = {
            male: 'Masculino',
            female: 'Femenino',
            other: 'Otro',      // por si lo necesitas
        };

        return map[(gender ?? '').toLowerCase()] ?? gender ?? '';
    }

    private buildPatientAndOrgInfo(patient: any, organization: any): Content {
        return {
            columns: [
                {
                    width: '50%',
                    stack: [
                        { text: 'Datos del Paciente', style: 'locationInfo',  margin: [0, 0, 0, 6]  },
                        {
                            text: [
                                { text: 'Nombre: ', style: 'negrita' },
                                { text: `${patient.name} ${patient.aPaternal || ''} ${patient.aMaternal || ''}` }
                            ],
                            margin: [0, 0, 0, 3]
                        },
                        {
                            text: [
                                { text: 'CI: ', style: 'negrita' },
                                { text: patient.ci }
                            ],
                            margin: [0, 0, 0, 3]
                        },
                        {
                            text: [
                                { text: 'Sexo: ', style: 'negrita' },
                                { text: this.translateGender(patient.sexo) }
                            ],
                            margin: [0, 0, 0, 3]
                        },
                        {
                            text: [
                                { text: 'Fecha de Nacimiento: ', style: 'negrita' },
                                { text: new Date(patient.birthDate).toLocaleDateString('es-BO') }
                            ],
                            margin: [0, 0, 0, 3]
                        },
                        {
                            text: [
                                { text: 'Email: ', style: 'negrita' },
                                { text: patient.email }
                            ],
                            margin: [0, 0, 0, 3]
                        },
                        {
                            text: [
                                { text: 'Teléfono: ', style: 'negrita' },
                                { text: patient.phone }
                            ],
                            margin: [0, 0, 0, 3]
                        }
                    ]
                },
                {
                    width: '50%',
                    stack: [
                        { text: 'Organización', style: 'locationInfo',  margin: [0, 0, 0, 6]  },
                        {
                            text: [
                                { text: 'Ciudad: ', style: 'negrita' },
                                { text: 'Santa Cruz de la Sierra' }
                            ],
                            margin: [0, 0, 0, 3]
                        },
                        {
                            text: [
                                { text: 'Organización: ', style: 'negrita' },
                                { text: organization.name }
                            ],
                            margin: [0, 0, 0, 3]
                        },
                        {
                            text: [
                                { text: 'Responsable: ', style: 'negrita' },
                                { text: organization.hostUser }
                            ],
                            margin: [0, 0, 0, 3]
                        },
                        {
                            text: [
                                { text: 'Sitio Web: ', style: 'negrita' },
                                { text: 'www.Derma-AI.com', link: 'https://www.Derma-AI.com', color: '#1E90FF', decoration: 'underline' }
                            ],
                            margin: [0, 0, 0, 3]
                        },
                        { qr: 'https://www.Derma-AI.com', fit: 80, alignment: 'right' }
                    ],
                    alignment: 'right'
                }
            ],
            margin: [0, 5, 0, 20]
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
            header: { fontSize: 25, bold: true, color: '#2c3e50' },
            subHeader: { fontSize: 15, color: '#7f8c8d' },
            patientInfo: { fontSize: 12, bold: true, color: '#34495e' },
            locationInfo: { fontSize: 15, bold: true, color: '#34495e' },
            negrita: { fontSize: 13, bold: true, color: '#34495e' },
            sectionHeader: { fontSize: 16, bold: true, color: '#2980b9', decoration: 'underline' },
            subSectionHeader: { fontSize: 14, bold: true, color: '#3498db' },
            reportHeader: { fontSize: 15, bold: true, color: '#27ae60', margin: [0, 10, 0, 10] },
            subText: { fontSize: 10, color: '#7f8c8d' },
            tableHeader: { fontSize: 12, bold: true, fillColor: '#ecf0f1', color: '#2c3e50' },
            reportContent: { fontSize: 12, color: '#2c3e50', lineHeight: 1.5 }
        };
    }

    private buildSignatureBlock(): Content {
        return {
            stack: [
                { image: 'src/assets/firma.png', width: 100, alignment: 'center', margin: [0, 20, 0, 5] },
            ]
        };
    }

    async generateMedicalReportPdfDefinition(medicalReportId: string): Promise<TDocumentDefinitions> {
        const medicalReport = await this.medicalReportsService.findOne(medicalReportId);

        if (!medicalReport) {
            throw new Error('Informe médico no encontrado');
        }

        const organization = await this.organizationsService.findOne(medicalReport.organizationId);
        const patient = await this.patientsService.findOne(medicalReport.patientId);

        if (!organization) {
            throw new Error('Organización no encontrada');
        }

        if (!patient) {
            throw new Error('Paciente no encontrado');
        }

        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            header: this.buildPdfHeader('Informe Médico', organization.name),
            footer: this.buildPdfFooter(),
            content: [
                {
                    canvas: [{
                        type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#ccc'
                    }], margin: [0, 10, 0, 20]
                },
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
                    text: medicalReport.informe,
                    style: 'reportContent',
                    margin: [0, 0, 0, 20]
                },
                this.buildSignatureBlock()
            ] as Content[],
            styles: this.getCommonStyles(),
            defaultStyle: {
                font: 'Roboto', fontSize: 11
            }
        };
    }

    async generateMedicalReportsListPdfDefinition(organizationId: string, medicalReports: any[]): Promise<TDocumentDefinitions> {
        const organization = await this.organizationsService.findOne(organizationId);

        if (!organization) {
            throw new Error('Organización no encontrada');
        }

        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            header: this.buildPdfHeader('Lista de Informes Médicos', organization.name),
            footer: this.buildPdfFooter(),
            content: [
                {
                    text: 'Información de la Organización', style: 'sectionHeader', margin: [0, 0, 0, 5]
                },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [{ text: 'Campo', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
                            ['Organización', organization.name],
                            ['Responsable', organization.hostUser],
                            ['Total de Informes', medicalReports.length.toString()]
                        ]
                    },
                    margin: [0, 5, 0, 20],
                    layout: 'lightHorizontalLines'
                },
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
                    text: 'Lista de Informes Médicos', style: 'sectionHeader', margin: [0, 0, 0, 15]
                },
                ...medicalReports.map((report, index) => [
                    {
                        text: `Informe ${index + 1}`, style: 'reportHeader', margin: [0, 0, 0, 10]
                    },
                    {
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [{ text: 'Campo', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }],
                                ['ID del Informe', report.id],
                                ['Fecha', new Date(report.fecha).toLocaleDateString('es-BO')],
                                ['Paciente', `${report.patient?.name || 'N/A'} ${report.patient?.aPaternal || ''} ${report.patient?.aMaternal || ''}`],
                                ['Resumen', report.informe.length > 100 ? report.informe.substring(0, 100) + '...' : report.informe]
                            ]
                        },
                        margin: [0, 0, 0, 15],
                        layout: 'lightHorizontalLines'
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
}
