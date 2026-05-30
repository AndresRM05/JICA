// /tests/unit/features/investments/components/InvestmentCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InvestmentCard } from '@/features/investments/components/InvestmentCard/InvestmentCard';
 
const mockInvestment = {
  id: '1',
  businessName: 'Restaurante El Sabor',
  roi: 12,
  riskLevel: 'low' as const,
  minAmount: 500000,
  status: 'available' as const,
};
 
describe('InvestmentCard', () => {
  it('debe mostrar el nombre del negocio, ROI y monto mínimo', () => {
    render(<InvestmentCard investment={mockInvestment} onViewDetail={vi.fn()} />);
 
    expect(screen.getByText('Restaurante El Sabor')).toBeInTheDocument();
    expect(screen.getByText(/12%/)).toBeInTheDocument();
    expect(screen.getByText(/500.000/)).toBeInTheDocument();
  });
 
  it('debe mostrar el badge de riesgo bajo', () => {
    render(<InvestmentCard investment={mockInvestment} onViewDetail={vi.fn()} />);
    expect(screen.getByText(/riesgo bajo/i)).toBeInTheDocument();
  });
 
  it('debe llamar a onViewDetail con el id correcto al hacer click en "Ver detalle"', () => {
    const handleViewDetail = vi.fn();
    render(<InvestmentCard investment={mockInvestment} onViewDetail={handleViewDetail} />);
 
    fireEvent.click(screen.getByRole('button', { name: /ver detalle/i }));
    expect(handleViewDetail).toHaveBeenCalledWith('1');
  });
});