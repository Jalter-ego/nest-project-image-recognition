import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateAttentionHourDto {
    @ApiProperty({ example: "[lunes,miercoles,viernes]" })
    @IsArray()
    @IsString({ each: true }) // ✅ asegura que cada item sea un string
    @IsNotEmpty()
    days: string[];

    @ApiProperty({ example: "2024-08-25T10:30:00.000Z" })
    @IsDateString()
    @IsNotEmpty()
    startTime: Date;

    @ApiProperty({ example: "2024-08-25T10:30:00.000Z" })
    @IsDateString()
    @IsNotEmpty()
    endTime: Date;

    @ApiProperty({ example: "scdcdc332..." })
    @IsString()
    @IsNotEmpty()
    organizationId: string
}

export class AddAttHourUser {
    @ApiProperty({ example: "cdcdcdc333..." })
    @IsString()
    @IsNotEmpty()
    userId: string
    @ApiProperty({ example: "cdcdcdc333..." })
    @IsString()
    @IsNotEmpty()
    attentionHourId: string
}

export class AddMultipleAttHourUsers {
    @ApiProperty({ example: ["cdcdcdc333...", "cdcdcdc334..."] })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    userIds: string[]

    @ApiProperty({ example: "cdcdcdc333..." })
    @IsString()
    @IsNotEmpty()
    attentionHourId: string
}
