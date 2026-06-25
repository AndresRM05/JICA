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

  const seededBusinessNames = [
    'Café Alma',
    'Verde Sabor',
    'Panadería La Masa',
    'Taco Barrio',
    'Nieve Verde',
    'Soda El Buen Punto',
    'Tapas 27',
    'Forno Lento',
  ];

  await prisma.investment.deleteMany({
    where: { opportunity: { businessName: { in: seededBusinessNames } } },
  });

  await prisma.investmentIntent.deleteMany({
    where: { opportunity: { businessName: { in: seededBusinessNames } } },
  });

  await prisma.investmentSimulation.deleteMany({
    where: { opportunity: { businessName: { in: seededBusinessNames } } },
  });

  await prisma.businessFinancialMetric.deleteMany({
    where: { opportunity: { businessName: { in: seededBusinessNames } } },
  });

  await prisma.investmentOpportunity.deleteMany({
    where: { businessName: { in: seededBusinessNames } },
  });

  const opportunity1 = await prisma.investmentOpportunity.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {
      targetAmount: new Prisma.Decimal('28000'),
      currentAmount: new Prisma.Decimal('9200'),
      minAmount: new Prisma.Decimal('1000'),
      estimatedReturn: new Prisma.Decimal('10'),
      metrics: {
        deleteMany: {},
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('18500'),
            grossMargin: new Prisma.Decimal('61'),
            operatingMargin: new Prisma.Decimal('13'),
            customerCount: 980,
            averageTicket: new Prisma.Decimal('18.90')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('19800'),
            grossMargin: new Prisma.Decimal('62'),
            operatingMargin: new Prisma.Decimal('14'),
            customerCount: 1040,
            averageTicket: new Prisma.Decimal('19.10')
          }
        ]
      }
    },
    create: {
      title: 'Café de Especialidad - Ampliación',
      description: 'Financiamiento local para abrir segunda sucursal de cafetería de especialidad.',
      businessName: 'Café Alma',
      category: 'Gastronomía',
      location: 'Distrito Central',
      targetAmount: new Prisma.Decimal('28000'),
      currentAmount: new Prisma.Decimal('9200'),
      minAmount: new Prisma.Decimal('1000'),
      riskLevel: RiskLevel.medium,
      estimatedReturn: new Prisma.Decimal('10'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('18500'),
            grossMargin: new Prisma.Decimal('61'),
            operatingMargin: new Prisma.Decimal('13'),
            customerCount: 980,
            averageTicket: new Prisma.Decimal('18.90')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('19800'),
            grossMargin: new Prisma.Decimal('62'),
            operatingMargin: new Prisma.Decimal('14'),
            customerCount: 1040,
            averageTicket: new Prisma.Decimal('19.10')
          }
        ]
      }
    }
  });

  const opportunity2 = await prisma.investmentOpportunity.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {
      targetAmount: new Prisma.Decimal('24000'),
      currentAmount: new Prisma.Decimal('7600'),
      minAmount: new Prisma.Decimal('750'),
      estimatedReturn: new Prisma.Decimal('9'),
      metrics: {
        deleteMany: {},
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('16200'),
            grossMargin: new Prisma.Decimal('58'),
            operatingMargin: new Prisma.Decimal('11'),
            customerCount: 720,
            averageTicket: new Prisma.Decimal('22.50')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('17000'),
            grossMargin: new Prisma.Decimal('59'),
            operatingMargin: new Prisma.Decimal('12'),
            customerCount: 760,
            averageTicket: new Prisma.Decimal('22.40')
          }
        ]
      }
    },
    create: {
      title: 'Restaurante Vegano - Renovación de Cocina',
      description: 'Capital para modernizar la cocina y mejorar la experiencia gastronómica.',
      businessName: 'Verde Sabor',
      category: 'Gastronomía',
      location: 'Barrio Norte',
      targetAmount: new Prisma.Decimal('24000'),
      currentAmount: new Prisma.Decimal('7600'),
      minAmount: new Prisma.Decimal('750'),
      riskLevel: RiskLevel.low,
      estimatedReturn: new Prisma.Decimal('9'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('16200'),
            grossMargin: new Prisma.Decimal('58'),
            operatingMargin: new Prisma.Decimal('11'),
            customerCount: 720,
            averageTicket: new Prisma.Decimal('22.50')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('17000'),
            grossMargin: new Prisma.Decimal('59'),
            operatingMargin: new Prisma.Decimal('12'),
            customerCount: 760,
            averageTicket: new Prisma.Decimal('22.40')
          }
        ]
      }
    }
  });

  const opportunity3 = await prisma.investmentOpportunity.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {
      targetAmount: new Prisma.Decimal('18000'),
      currentAmount: new Prisma.Decimal('6100'),
      minAmount: new Prisma.Decimal('500'),
      estimatedReturn: new Prisma.Decimal('10'),
      metrics: {
        deleteMany: {},
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('14200'),
            grossMargin: new Prisma.Decimal('52'),
            operatingMargin: new Prisma.Decimal('10'),
            customerCount: 1050,
            averageTicket: new Prisma.Decimal('13.52')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('15100'),
            grossMargin: new Prisma.Decimal('53'),
            operatingMargin: new Prisma.Decimal('11'),
            customerCount: 1115,
            averageTicket: new Prisma.Decimal('13.55')
          }
        ]
      }
    },
    create: {
      title: 'Panadería Tradicional - Expansión de Hornos',
      description: 'Inversión para renovar hornos y ampliar producción de panadería artesanal.',
      businessName: 'Panadería La Masa',
      category: 'Gastronomía',
      location: 'Centro Histórico',
      targetAmount: new Prisma.Decimal('18000'),
      currentAmount: new Prisma.Decimal('6100'),
      minAmount: new Prisma.Decimal('500'),
      riskLevel: RiskLevel.medium,
      estimatedReturn: new Prisma.Decimal('10'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('14200'),
            grossMargin: new Prisma.Decimal('52'),
            operatingMargin: new Prisma.Decimal('10'),
            customerCount: 1050,
            averageTicket: new Prisma.Decimal('13.52')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('15100'),
            grossMargin: new Prisma.Decimal('53'),
            operatingMargin: new Prisma.Decimal('11'),
            customerCount: 1115,
            averageTicket: new Prisma.Decimal('13.55')
          }
        ]
      }
    }
  });

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000004', 'Taco Barrio') },
    update: {
      targetAmount: new Prisma.Decimal('22000'),
      currentAmount: new Prisma.Decimal('6800'),
      minAmount: new Prisma.Decimal('750'),
      estimatedReturn: new Prisma.Decimal('10'),
      metrics: {
        deleteMany: {},
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('17600'),
            grossMargin: new Prisma.Decimal('55'),
            operatingMargin: new Prisma.Decimal('12'),
            customerCount: 1480,
            averageTicket: new Prisma.Decimal('11.90')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('18800'),
            grossMargin: new Prisma.Decimal('56'),
            operatingMargin: new Prisma.Decimal('13'),
            customerCount: 1570,
            averageTicket: new Prisma.Decimal('12.00')
          }
        ]
      }
    },
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      title: 'Taqueria Urbana - Food Truck',
      description: 'Capital para equipar un food truck y ampliar ventas en zonas corporativas.',
      businessName: 'Taco Barrio',
      category: 'Gastronomia',
      location: 'Sabana Este',
      targetAmount: new Prisma.Decimal('22000'),
      currentAmount: new Prisma.Decimal('6800'),
      minAmount: new Prisma.Decimal('750'),
      riskLevel: RiskLevel.medium,
      estimatedReturn: new Prisma.Decimal('10'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('17600'),
            grossMargin: new Prisma.Decimal('55'),
            operatingMargin: new Prisma.Decimal('12'),
            customerCount: 1480,
            averageTicket: new Prisma.Decimal('11.90')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('18800'),
            grossMargin: new Prisma.Decimal('56'),
            operatingMargin: new Prisma.Decimal('13'),
            customerCount: 1570,
            averageTicket: new Prisma.Decimal('12.00')
          }
        ]
      }
    }
  });

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000005', 'Nieve Verde') },
    update: {
      targetAmount: new Prisma.Decimal('16000'),
      currentAmount: new Prisma.Decimal('5400'),
      minAmount: new Prisma.Decimal('500'),
      estimatedReturn: new Prisma.Decimal('8'),
      metrics: {
        deleteMany: {},
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('12800'),
            grossMargin: new Prisma.Decimal('64'),
            operatingMargin: new Prisma.Decimal('14'),
            customerCount: 1120,
            averageTicket: new Prisma.Decimal('11.43')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('13600'),
            grossMargin: new Prisma.Decimal('65'),
            operatingMargin: new Prisma.Decimal('15'),
            customerCount: 1180,
            averageTicket: new Prisma.Decimal('11.53')
          }
        ]
      }
    },
    create: {
      id: '00000000-0000-0000-0000-000000000005',
      title: 'Heladeria Artesanal - Camara Fria',
      description: 'Financiamiento para aumentar capacidad de almacenamiento y crear nuevos sabores.',
      businessName: 'Nieve Verde',
      category: 'Gastronomia',
      location: 'Escazu',
      targetAmount: new Prisma.Decimal('16000'),
      currentAmount: new Prisma.Decimal('5400'),
      minAmount: new Prisma.Decimal('500'),
      riskLevel: RiskLevel.low,
      estimatedReturn: new Prisma.Decimal('8'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('12800'),
            grossMargin: new Prisma.Decimal('64'),
            operatingMargin: new Prisma.Decimal('14'),
            customerCount: 1120,
            averageTicket: new Prisma.Decimal('11.43')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('13600'),
            grossMargin: new Prisma.Decimal('65'),
            operatingMargin: new Prisma.Decimal('15'),
            customerCount: 1180,
            averageTicket: new Prisma.Decimal('11.53')
          }
        ]
      }
    }
  });

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000006', 'Soda El Buen Punto') },
    update: {
      targetAmount: new Prisma.Decimal('19000'),
      currentAmount: new Prisma.Decimal('4900'),
      minAmount: new Prisma.Decimal('500'),
      estimatedReturn: new Prisma.Decimal('9'),
      metrics: {
        deleteMany: {},
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('15800'),
            grossMargin: new Prisma.Decimal('49'),
            operatingMargin: new Prisma.Decimal('8'),
            customerCount: 1760,
            averageTicket: new Prisma.Decimal('8.98')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('16600'),
            grossMargin: new Prisma.Decimal('50'),
            operatingMargin: new Prisma.Decimal('9'),
            customerCount: 1840,
            averageTicket: new Prisma.Decimal('9.02')
          }
        ]
      }
    },
    create: {
      id: '00000000-0000-0000-0000-000000000006',
      title: 'Soda Familiar - Remodelacion de Salon',
      description: 'Inversion para renovar mobiliario, mejorar rotacion de mesas y habilitar servicio express.',
      businessName: 'Soda El Buen Punto',
      category: 'Gastronomia',
      location: 'Heredia Centro',
      targetAmount: new Prisma.Decimal('19000'),
      currentAmount: new Prisma.Decimal('4900'),
      minAmount: new Prisma.Decimal('500'),
      riskLevel: RiskLevel.medium,
      estimatedReturn: new Prisma.Decimal('9'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('15800'),
            grossMargin: new Prisma.Decimal('49'),
            operatingMargin: new Prisma.Decimal('8'),
            customerCount: 1760,
            averageTicket: new Prisma.Decimal('8.98')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('16600'),
            grossMargin: new Prisma.Decimal('50'),
            operatingMargin: new Prisma.Decimal('9'),
            customerCount: 1840,
            averageTicket: new Prisma.Decimal('9.02')
          }
        ]
      }
    }
  });

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000007', 'Tapas 27') },
    update: {
      targetAmount: new Prisma.Decimal('32000'),
      currentAmount: new Prisma.Decimal('8700'),
      minAmount: new Prisma.Decimal('1000'),
      estimatedReturn: new Prisma.Decimal('12'),
      metrics: {
        deleteMany: {},
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('24500'),
            grossMargin: new Prisma.Decimal('60'),
            operatingMargin: new Prisma.Decimal('13'),
            customerCount: 880,
            averageTicket: new Prisma.Decimal('27.84')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('26300'),
            grossMargin: new Prisma.Decimal('61'),
            operatingMargin: new Prisma.Decimal('14'),
            customerCount: 940,
            averageTicket: new Prisma.Decimal('27.98')
          }
        ]
      }
    },
    create: {
      id: '00000000-0000-0000-0000-000000000007',
      title: 'Bar de Tapas - Terraza y Licencia',
      description: 'Capital para acondicionar terraza, reforzar inventario y ampliar horario de atencion.',
      businessName: 'Tapas 27',
      category: 'Gastronomia',
      location: 'Barrio Escalante',
      targetAmount: new Prisma.Decimal('32000'),
      currentAmount: new Prisma.Decimal('8700'),
      minAmount: new Prisma.Decimal('1000'),
      riskLevel: RiskLevel.high,
      estimatedReturn: new Prisma.Decimal('12'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('24500'),
            grossMargin: new Prisma.Decimal('60'),
            operatingMargin: new Prisma.Decimal('13'),
            customerCount: 880,
            averageTicket: new Prisma.Decimal('27.84')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('26300'),
            grossMargin: new Prisma.Decimal('61'),
            operatingMargin: new Prisma.Decimal('14'),
            customerCount: 940,
            averageTicket: new Prisma.Decimal('27.98')
          }
        ]
      }
    }
  });

  await prisma.investmentOpportunity.upsert({
    where: { id: await getOpportunitySeedId('00000000-0000-0000-0000-000000000008', 'Forno Lento') },
    update: {
      targetAmount: new Prisma.Decimal('26000'),
      currentAmount: new Prisma.Decimal('8100'),
      minAmount: new Prisma.Decimal('750'),
      estimatedReturn: new Prisma.Decimal('9'),
      metrics: {
        deleteMany: {},
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('19100'),
            grossMargin: new Prisma.Decimal('56'),
            operatingMargin: new Prisma.Decimal('11'),
            customerCount: 860,
            averageTicket: new Prisma.Decimal('22.21')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('20400'),
            grossMargin: new Prisma.Decimal('57'),
            operatingMargin: new Prisma.Decimal('12'),
            customerCount: 910,
            averageTicket: new Prisma.Decimal('22.42')
          }
        ]
      }
    },
    create: {
      id: '00000000-0000-0000-0000-000000000008',
      title: 'Pizzeria de Masa Madre - Horno de Piedra',
      description: 'Financiamiento para instalar horno de piedra y ampliar produccion nocturna.',
      businessName: 'Forno Lento',
      category: 'Gastronomia',
      location: 'Curridabat',
      targetAmount: new Prisma.Decimal('26000'),
      currentAmount: new Prisma.Decimal('8100'),
      minAmount: new Prisma.Decimal('750'),
      riskLevel: RiskLevel.low,
      estimatedReturn: new Prisma.Decimal('9'),
      status: OpportunityStatus.available,
      metrics: {
        create: [
          {
            month: '2026-01',
            revenue: new Prisma.Decimal('19100'),
            grossMargin: new Prisma.Decimal('56'),
            operatingMargin: new Prisma.Decimal('11'),
            customerCount: 860,
            averageTicket: new Prisma.Decimal('22.21')
          },
          {
            month: '2026-02',
            revenue: new Prisma.Decimal('20400'),
            grossMargin: new Prisma.Decimal('57'),
            operatingMargin: new Prisma.Decimal('12'),
            customerCount: 910,
            averageTicket: new Prisma.Decimal('22.42')
          }
        ]
      }
    }
  });

  const opportunityReturnRates = [
    { businessName: 'CafÃ© Alma', estimatedReturn: '10' },
    { businessName: 'Verde Sabor', estimatedReturn: '9' },
    { businessName: 'PanaderÃ­a La Masa', estimatedReturn: '10' },
    { businessName: 'Taco Barrio', estimatedReturn: '10' },
    { businessName: 'Nieve Verde', estimatedReturn: '8' },
    { businessName: 'Soda El Buen Punto', estimatedReturn: '9' },
    { businessName: 'Tapas 27', estimatedReturn: '12' },
    { businessName: 'Forno Lento', estimatedReturn: '9' },
  ];

  for (const opportunityReturnRate of opportunityReturnRates) {
    await prisma.investmentOpportunity.updateMany({
      where: { businessName: opportunityReturnRate.businessName },
      data: { estimatedReturn: new Prisma.Decimal(opportunityReturnRate.estimatedReturn) },
    });
  }

  const pitchReturnRates = [
    { businessName: 'CafÃ© Alma', estimatedReturn: '10' },
    { businessName: 'Verde Sabor', estimatedReturn: '9' },
    { businessName: 'PanaderÃ­a La Masa', estimatedReturn: '10' },
    { businessName: 'Taco Barrio', estimatedReturn: '10' },
    { businessName: 'Nieve Verde', estimatedReturn: '8' },
    { businessName: 'Soda El Buen Punto', estimatedReturn: '9' },
    { businessName: 'Tapas 27', estimatedReturn: '12' },
    { businessName: 'Forno Lento', estimatedReturn: '9' },
  ];

  for (const pitchReturnRate of pitchReturnRates) {
    await prisma.investmentOpportunity.updateMany({
      where: { businessName: pitchReturnRate.businessName },
      data: { estimatedReturn: new Prisma.Decimal(pitchReturnRate.estimatedReturn) },
    });
  }

  await prisma.$executeRaw`
    UPDATE "InvestmentOpportunity"
    SET "estimatedReturn" = "estimatedReturn" * 100
    WHERE "estimatedReturn" > 0 AND "estimatedReturn" < 1
  `;

  await prisma.$executeRaw`
    UPDATE "InvestmentSimulation"
    SET "estimatedReturn" = "estimatedReturn" * 100
    WHERE "estimatedReturn" > 0 AND "estimatedReturn" < 1
  `;

  const simulation = await prisma.investmentSimulation.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {
      investorId: investorUser1.investor!.id,
      opportunityId: opportunity1.id,
      amount: new Prisma.Decimal('3000'),
      estimatedReturn: new Prisma.Decimal('10'),
      riskLevel: RiskLevel.medium
    },
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      investorId: investorUser1.investor!.id,
      opportunityId: opportunity1.id,
      amount: new Prisma.Decimal('3000'),
      estimatedReturn: new Prisma.Decimal('10'),
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
      expectedReturn: new Prisma.Decimal('3300'),
      status: InvestmentIntentStatus.confirmed,
      confirmedAt: new Date()
    },
    create: {
      investorId: investorUser1.investor!.id,
      opportunityId: opportunity1.id,
      simulationId: simulation.id,
      amount: new Prisma.Decimal('3000'),
      expectedReturn: new Prisma.Decimal('3300'),
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

