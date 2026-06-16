import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetInvestmentsQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  riskLevel?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsEnum(['available', 'reserved', 'closed'])
  status?: 'available' | 'reserved' | 'closed';
}
