import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class FilterTreatmentsDto {
    @ApiPropertyOptional()
    @IsString()
    patId?: string;

    @ApiPropertyOptional()
    @IsString()
    orgId?: string;

    @ApiPropertyOptional()
    @IsEnum(["daily", "weekly", "monthly"])
    @IsOptional()
    frequencyUnit?: "daily" | "weekly" | "monthly";

    @ApiPropertyOptional()
    @IsInt()
    @Min(1)
    @IsOptional()
    minApplications?: number;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    endDate?: string;
}
