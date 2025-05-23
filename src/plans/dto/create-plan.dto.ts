import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePlanDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    description: string;
    @IsNumber()
    @IsNotEmpty()
    limitMembers: number;
    @IsNumber()
    @IsNotEmpty()
    limitModelUses: number;
    @IsNumber()
    @IsNotEmpty()
    price: number;
    @IsNumber()
    @IsNotEmpty()
    durationInDays: number;
}
