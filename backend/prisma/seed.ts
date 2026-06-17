import 'dotenv/config';
import { Prisma, PrismaClient, UserRole, RiskLevel, OpportunityStatus, InvestmentIntentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function getOpportunitySeedId(seedId: string, businessName: string) {
  const existingOpportunity = await prisma.investmentOpportunity.findFirst({
    where: { businessName },
    select: { id: true }
  });

  return existingOpportunity?.id ?? seedId;
}

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

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000004', 'Taco Barrio') },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      title: 'Taqueria Urbana - Food Truck',
      description: 'Capital para equipar un food truck y ampliar ventas en zonas corporativas.',
      businessName: 'Taco Barrio',
      category: 'Gastronomia',
      location: 'Sabana Este',
      targetAmount: new Prisma.Decimal('32000'),
      currentAmount: new Prisma.Decimal('9000'),
      minAmount: new Prisma.Decimal('1800'),
      riskLevel: RiskLevel.medium,
      estimatedReturn: new Prisma.Decimal('0.17'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('26000'),
            grossMargin: new Prisma.Decimal('0.59'),
            operatingMargin: new Prisma.Decimal('0.16'),
            customerCount: 510,
            averageTicket: new Prisma.Decimal('12.75')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('27800'),
            grossMargin: new Prisma.Decimal('0.61'),
            operatingMargin: new Prisma.Decimal('0.17'),
            customerCount: 545,
            averageTicket: new Prisma.Decimal('13.10')
          }
        ]
      }
    }
  });

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000005', 'Nieve Verde') },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000005',
      title: 'Heladeria Artesanal - Camara Fria',
      description: 'Financiamiento para aumentar capacidad de almacenamiento y crear nuevos sabores.',
      businessName: 'Nieve Verde',
      category: 'Gastronomia',
      location: 'Escazu',
      targetAmount: new Prisma.Decimal('24000'),
      currentAmount: new Prisma.Decimal('7200'),
      minAmount: new Prisma.Decimal('1200'),
      riskLevel: RiskLevel.low,
      estimatedReturn: new Prisma.Decimal('0.14'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('21000'),
            grossMargin: new Prisma.Decimal('0.66'),
            operatingMargin: new Prisma.Decimal('0.20'),
            customerCount: 380,
            averageTicket: new Prisma.Decimal('11.50')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('22600'),
            grossMargin: new Prisma.Decimal('0.67'),
            operatingMargin: new Prisma.Decimal('0.21'),
            customerCount: 405,
            averageTicket: new Prisma.Decimal('11.80')
          }
        ]
      }
    }
  });

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000006', 'Soda El Buen Punto') },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000006',
      title: 'Soda Familiar - Remodelacion de Salon',
      description: 'Inversion para renovar mobiliario, mejorar rotacion de mesas y habilitar servicio express.',
      businessName: 'Soda El Buen Punto',
      category: 'Gastronomia',
      location: 'Heredia Centro',
      targetAmount: new Prisma.Decimal('29000'),
      currentAmount: new Prisma.Decimal('5600'),
      minAmount: new Prisma.Decimal('1500'),
      riskLevel: RiskLevel.medium,
      estimatedReturn: new Prisma.Decimal('0.16'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('25500'),
            grossMargin: new Prisma.Decimal('0.54'),
            operatingMargin: new Prisma.Decimal('0.13'),
            customerCount: 620,
            averageTicket: new Prisma.Decimal('9.90')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('26800'),
            grossMargin: new Prisma.Decimal('0.55'),
            operatingMargin: new Prisma.Decimal('0.14'),
            customerCount: 650,
            averageTicket: new Prisma.Decimal('10.20')
          }
        ]
      }
    }
  });

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000007', 'Tapas 27') },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000007',
      title: 'Bar de Tapas - Terraza y Licencia',
      description: 'Capital para acondicionar terraza, reforzar inventario y ampliar horario de atencion.',
      businessName: 'Tapas 27',
      category: 'Gastronomia',
      location: 'Barrio Escalante',
      targetAmount: new Prisma.Decimal('52000'),
      currentAmount: new Prisma.Decimal('15000'),
      minAmount: new Prisma.Decimal('3000'),
      riskLevel: RiskLevel.high,
      estimatedReturn: new Prisma.Decimal('0.22'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('41000'),
            grossMargin: new Prisma.Decimal('0.63'),
            operatingMargin: new Prisma.Decimal('0.18'),
            customerCount: 470,
            averageTicket: new Prisma.Decimal('28.50')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('43800'),
            grossMargin: new Prisma.Decimal('0.64'),
            operatingMargin: new Prisma.Decimal('0.19'),
            customerCount: 505,
            averageTicket: new Prisma.Decimal('29.25')
          }
        ]
      }
    }
  });

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000008', 'Forno Lento') },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000008',
      title: 'Pizzeria de Masa Madre - Horno de Piedra',
      description: 'Financiamiento para instalar horno de piedra y ampliar produccion nocturna.',
      businessName: 'Forno Lento',
      category: 'Gastronomia',
      location: 'Curridabat',
      targetAmount: new Prisma.Decimal('41000'),
      currentAmount: new Prisma.Decimal('11000'),
      minAmount: new Prisma.Decimal('2200'),
      riskLevel: RiskLevel.low,
      estimatedReturn: new Prisma.Decimal('0.15'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('33500'),
            grossMargin: new Prisma.Decimal('0.57'),
            operatingMargin: new Prisma.Decimal('0.16'),
            customerCount: 430,
            averageTicket: new Prisma.Decimal('22.50')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('35200'),
            grossMargin: new Prisma.Decimal('0.58'),
            operatingMargin: new Prisma.Decimal('0.17'),
            customerCount: 455,
            averageTicket: new Prisma.Decimal('23.10')
          }
        ]
      }
    }
  });

  const simulation = await prisma.investmentSimulation.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {
      investorId: investorUser1.investor!.id,
      opportunityId: opportunity1.id,
      amount: new Prisma.Decimal('3000'),
      estimatedReturn: new Prisma.Decimal('540'),
      riskLevel: RiskLevel.medium
    },
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      investorId: investorUser1.investor!.id,
      opportunityId: opportunity1.id,
      amount: new Prisma.Decimal('3000'),
      estimatedReturn: new Prisma.Decimal('540'),
      riskLevel: RiskLevel.medium
    }
  });

  await prisma.investmentIntent.upsert({
    where: {
      investorId_opportunityId: {
        investorId: investorUser1.investor!.id,
        opportunityId: opportunity1.id
      }
    },
    update: {
      simulationId: simulation.id,
      amount: new Prisma.Decimal('3000'),
      expectedReturn: new Prisma.Decimal('540'),
      status: InvestmentIntentStatus.confirmed,
      confirmedAt: new Date()
    },
    create: {
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
