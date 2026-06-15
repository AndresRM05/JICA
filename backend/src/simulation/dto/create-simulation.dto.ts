import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateSimulationDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'El monto de inversión debe ser mayor a 0' })
  investmentAmount: number;
}
