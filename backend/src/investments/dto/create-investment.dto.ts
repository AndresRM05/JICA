// /backend/src/investments/dto/create-investment.dto.ts
import { IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
 
export class CreateInvestmentDto {
  @IsString()
  businessName: string;
 
  @IsNumber()
  @Min(0)
  @Max(100)
  roi: number;
 
  @IsEnum(['low', 'medium', 'high'])
  riskLevel: 'low' | 'medium' | 'high';
 
  @IsNumber()
  @Min(0)
  minAmount: number;
}