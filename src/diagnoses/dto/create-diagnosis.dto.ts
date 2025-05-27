import { IsNotEmpty, IsString } from "class-validator"

export class CreateDiagnosisDto {
    @IsString()
    @IsNotEmpty()
    name:string
    @IsString()
    @IsNotEmpty()
    description:string
    @IsString()
    @IsNotEmpty()
    organizationId:string
}
