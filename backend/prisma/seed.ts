import { Prisma, PrismaClient, UserRole, RiskLevel, OpportunityStatus, InvestmentIntentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const investorUser1 = await prisma.user.upsert({
    where: { email: 'inversionista1@jica.local' },
    update: {},
    create: {
      email: 'inversionista1@jica.local',
      password: 'secure-password-hash',
      firstName: 'Ana',
      lastName: 'López',
      role: UserRole.investor,
      investor: {
        create: {
          phone: '8888-1234'
        }
      }
    },
    include: { investor: true }
  });

  const investorUser2 = await prisma.user.upsert({
    where: { email: 'inversionista2@jica.local' },
    update: {},
    create: {
      email: 'inversionista2@jica.local',
      password: 'secure-password-hash',
      firstName: 'Carlos',
      lastName: 'Pérez',
      role: UserRole.investor,
      investor: {
        create: {
          phone: '8888-5678'
        }
      }
    },
    include: { investor: true }
  });

  const opportunity1 = await prisma.investmentOpportunity.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      title: 'Café de Especialidad - Ampliación',
      description: 'Financiamiento local para abrir segunda sucursal de cafetería de especialidad.',
      businessName: 'Café Alma',
      category: 'Gastronomía',
      location: 'Distrito Central',
      targetAmount: new Prisma.Decimal('45000'),
      currentAmount: new Prisma.Decimal('12000'),
      minAmount: new Prisma.Decimal('2500'),
      riskLevel: RiskLevel.medium,
      estimatedReturn: new Prisma.Decimal('0.18'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('32000'),
            grossMargin: new Prisma.Decimal('0.62'),
            operatingMargin: new Prisma.Decimal('0.18'),
            customerCount: 420,
            averageTicket: new Prisma.Decimal('18.50')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('34000'),
            grossMargin: new Prisma.Decimal('0.64'),
            operatingMargin: new Prisma.Decimal('0.19'),
            customerCount: 450,
            averageTicket: new Prisma.Decimal('19.00')
          }
        ]
      }
    }
  });

  const opportunity2 = await prisma.investmentOpportunity.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      title: 'Restaurante Vegano - Renovación de Cocina',
      description: 'Capital para modernizar la cocina y mejorar la experiencia gastronómica.',
      businessName: 'Verde Sabor',
      category: 'Gastronomía',
      location: 'Barrio Norte',
      targetAmount: new Prisma.Decimal('38000'),
      currentAmount: new Prisma.Decimal('8000'),
      minAmount: new Prisma.Decimal('2000'),
      riskLevel: RiskLevel.low,
      estimatedReturn: new Prisma.Decimal('0.15'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('28000'),
            grossMargin: new Prisma.Decimal('0.58'),
            operatingMargin: new Prisma.Decimal('0.16'),
            customerCount: 340,
            averageTicket: new Prisma.Decimal('20.75')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('29500'),
            grossMargin: new Prisma.Decimal('0.60'),
            operatingMargin: new Prisma.Decimal('0.17'),
            customerCount: 360,
            averageTicket: new Prisma.Decimal('21.00')
          }
        ]
      }
    }
  });

  const opportunity3 = await prisma.investmentOpportunity.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      title: 'Panadería Tradicional - Expansión de Hornos',
      description: 'Inversión para renovar hornos y ampliar producción de panadería artesanal.',
      businessName: 'Panadería La Masa',
      category: 'Gastronomía',
      location: 'Centro Histórico',
      targetAmount: new Prisma.Decimal('27000'),
      currentAmount: new Prisma.Decimal('6500'),
      minAmount: new Prisma.Decimal('1500'),
      riskLevel: RiskLevel.medium,
      estimatedReturn: new Prisma.Decimal('0.16'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('23000'),
            grossMargin: new Prisma.Decimal('0.55'),
            operatingMargin: new Prisma.Decimal('0.14'),
            customerCount: 290,
            averageTicket: new Prisma.Decimal('14.25')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('24500'),
            grossMargin: new Prisma.Decimal('0.57'),
            operatingMargin: new Prisma.Decimal('0.15'),
            customerCount: 315,
            averageTicket: new Prisma.Decimal('15.00')
          }
        ]
      }
    }
  });

  const simulation = await prisma.investmentSimulation.create({
    data: {
      investorId: investorUser1.investor!.id,
      opportunityId: opportunity1.id,
      amount: new Prisma.Decimal('3000'),
      estimatedReturn: new Prisma.Decimal('540'),
      riskLevel: RiskLevel.medium
    }
  });

  await prisma.investmentIntent.create({
    data: {
      investorId: investorUser1.investor!.id,
      opportunityId: opportunity1.id,
      simulationId: simulation.id,
      amount: new Prisma.Decimal('3000'),
      expectedReturn: new Prisma.Decimal('540'),
      status: InvestmentIntentStatus.confirmed,
      confirmedAt: new Date()
    }
  });

  console.log('Seed ejecutado correctamente.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
