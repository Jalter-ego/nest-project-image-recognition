import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateTreatmentDto {
    @ApiProperty({ example: "Aplicación de peróxido de benzoilo" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: "4 semanas" })
    @IsString()
    @IsNotEmpty()
    duration: string;

    @ApiProperty({ example: "Aplicar una vez al día por la noche" })
    @IsString()
    @IsNotEmpty()
    instructions: string;

    @ApiProperty({ example: "cmaxe1jqi0000i4tki4xo2d3h" })
    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @ApiProperty({ example: 3, required: false })
    @IsInt()
    @Min(1)
    frequencyValue?: number;

    @ApiProperty({
        example: "weekly",
        enum: ["daily", "weekly", "monthly"],
        required: false,
    })
    @IsEnum(["daily", "weekly", "monthly"])
    frequencyUnit?: "daily" | "weekly" | "monthly";
}