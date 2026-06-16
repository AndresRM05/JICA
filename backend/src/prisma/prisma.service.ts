import { Injectable, OnModuleInit } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { randomUUID } from 'node:crypto';

type UserRole = 'investor' | 'business' | 'admin';
type RiskLevel = 'low' | 'medium' | 'high';
type OpportunityStatus = 'available' | 'reserved' | 'closed';
type InvestmentIntentStatus = 'pending' | 'confirmed' | 'cancelled';
type InvestmentStatus = 'active' | 'completed' | 'cancelled';

type SelectShape = Record<string, boolean | object> | undefined;

interface UserRecord {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface InvestorRecord {
  id: string;
  userId: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface InvestmentOpportunityRecord {
  id: string;
  title: string;
  description: string;
  businessName: string;
  category: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  minAmount: number;
  riskLevel: RiskLevel;
  estimatedReturn: number;
  status: OpportunityStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface BusinessFinancialMetricRecord {
  id: string;
  opportunityId: string;
  month: string;
  revenue: number;
  grossMargin: number;
  operatingMargin: number;
  customerCount: number | null;
  averageTicket: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface InvestmentSimulationRecord {
  id: string;
  investorId: string;
  opportunityId: string;
  amount: number;
  estimatedReturn: number;
  riskLevel: RiskLevel;
  simulatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface InvestmentIntentRecord {
  id: string;
  investorId: string;
  opportunityId: string;
  simulationId: string | null;
  amount: number;
  expectedReturn: number;
  status: InvestmentIntentStatus;
  confirmedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface InvestmentRecord {
  id: string;
  investorId: string;
  opportunityId: string;
  intentId: string;
  investedAmount: number;
  status: InvestmentStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const DEMO_USER_ID = '11111111-1111-4111-8111-111111111111';
const DEMO_INVESTOR_ID = '22222222-2222-4222-8222-222222222222';

function now(): Date {
  return new Date();
}

function selectFields<T extends Record<string, any>>(record: T, select?: SelectShape): any {
  if (!select) return record;

  return Object.entries(select).reduce<Record<string, any>>((acc, [key, enabled]) => {
    if (enabled) acc[key] = record[key];
    return acc;
  }, {});
}

function createSeedData() {
  const createdAt = now();
  const users: UserRecord[] = [
    {
      id: DEMO_USER_ID,
      email: 'demo@jica.local',
      password: hashSync('Demo12345', 10),
      firstName: 'Demo',
      lastName: 'Investor',
      role: 'investor',
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
  ];

  const investors: InvestorRecord[] = [
    {
      id: DEMO_INVESTOR_ID,
      userId: DEMO_USER_ID,
      phone: '8888-0000',
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
  ];

  const investmentOpportunities: InvestmentOpportunityRecord[] = [
    {
      id: '00000000-0000-4000-8000-000000000001',
      title: 'Café de Especialidad - Ampliación',
      description: 'Financiamiento local para abrir una segunda sucursal de cafetería de especialidad.',
      businessName: 'Café Alma',
      category: 'Gastronomía',
      location: 'San José, Costa Rica',
      targetAmount: 45000,
      currentAmount: 12000,
      minAmount: 2500,
      riskLevel: 'medium',
      estimatedReturn: 18,
      status: 'available',
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: '00000000-0000-4000-8000-000000000002',
      title: 'Restaurante Vegano - Renovación de Cocina',
      description: 'Capital para modernizar cocina, mejorar capacidad operativa y acelerar ventas.',
      businessName: 'Verde Sabor',
      category: 'Gastronomía',
      location: 'Escazú, Costa Rica',
      targetAmount: 38000,
      currentAmount: 8000,
      minAmount: 2000,
      riskLevel: 'low',
      estimatedReturn: 15,
      status: 'available',
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: '00000000-0000-4000-8000-000000000003',
      title: 'Panadería Tradicional - Expansión de Hornos',
      description: 'Inversión para renovar hornos y ampliar la producción de panadería artesanal.',
      businessName: 'Panadería La Masa',
      category: 'Gastronomía',
      location: 'Cartago, Costa Rica',
      targetAmount: 27000,
      currentAmount: 6500,
      minAmount: 1500,
      riskLevel: 'medium',
      estimatedReturn: 16,
      status: 'available',
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
  ];

  const metrics: BusinessFinancialMetricRecord[] = [
    {
      id: randomUUID(),
      opportunityId: investmentOpportunities[0].id,
      month: '2026-01',
      revenue: 32000,
      grossMargin: 62,
      operatingMargin: 18,
      customerCount: 420,
      averageTicket: 18.5,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: randomUUID(),
      opportunityId: investmentOpportunities[0].id,
      month: '2026-02',
      revenue: 34000,
      grossMargin: 64,
      operatingMargin: 19,
      customerCount: 450,
      averageTicket: 19,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: randomUUID(),
      opportunityId: investmentOpportunities[0].id,
      month: '2026-03',
      revenue: 36500,
      grossMargin: 65,
      operatingMargin: 21,
      customerCount: 485,
      averageTicket: 19.4,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: randomUUID(),
      opportunityId: investmentOpportunities[1].id,
      month: '2026-01',
      revenue: 28000,
      grossMargin: 58,
      operatingMargin: 16,
      customerCount: 340,
      averageTicket: 20.75,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: randomUUID(),
      opportunityId: investmentOpportunities[1].id,
      month: '2026-02',
      revenue: 29500,
      grossMargin: 60,
      operatingMargin: 17,
      customerCount: 360,
      averageTicket: 21,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: randomUUID(),
      opportunityId: investmentOpportunities[1].id,
      month: '2026-03',
      revenue: 31500,
      grossMargin: 61,
      operatingMargin: 18,
      customerCount: 385,
      averageTicket: 21.3,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: randomUUID(),
      opportunityId: investmentOpportunities[2].id,
      month: '2026-01',
      revenue: 23000,
      grossMargin: 55,
      operatingMargin: 14,
      customerCount: 290,
      averageTicket: 14.25,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: randomUUID(),
      opportunityId: investmentOpportunities[2].id,
      month: '2026-02',
      revenue: 24500,
      grossMargin: 57,
      operatingMargin: 15,
      customerCount: 315,
      averageTicket: 15,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
    {
      id: randomUUID(),
      opportunityId: investmentOpportunities[2].id,
      month: '2026-03',
      revenue: 26000,
      grossMargin: 58,
      operatingMargin: 16,
      customerCount: 335,
      averageTicket: 15.2,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    },
  ];

  return {
    users,
    investors,
    investmentOpportunities,
    metrics,
    investmentSimulations: [] as InvestmentSimulationRecord[],
    investmentIntents: [] as InvestmentIntentRecord[],
    investments: [] as InvestmentRecord[],
  };
}

@Injectable()
export class PrismaService implements OnModuleInit {
  private static data = createSeedData();

  async onModuleInit(): Promise<void> {
    return Promise.resolve();
  }

  user = {
    findUnique: async (args: { where: { id?: string; email?: string }; include?: { investor?: boolean }; select?: SelectShape }) => {
      const user = PrismaService.data.users.find(
        (item) => item.id === args.where.id || item.email === args.where.email,
      );

      if (!user) return null;

      const record: Record<string, any> = { ...user };
      if (args.include?.investor) {
        record.investor = PrismaService.data.investors.find((investor) => investor.userId === user.id) ?? null;
      }

      return selectFields(record, args.select);
    },

    create: async (args: {
      data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        investor?: { create?: { phone?: string | null } };
      };
      select?: SelectShape;
    }) => {
      const createdAt = now();
      const user: UserRecord = {
        id: randomUUID(),
        email: args.data.email,
        password: args.data.password,
        firstName: args.data.firstName,
        lastName: args.data.lastName,
        role: args.data.role,
        createdAt,
        updatedAt: createdAt,
        deletedAt: null,
      };

      PrismaService.data.users.push(user);

      if (args.data.investor?.create) {
        PrismaService.data.investors.push({
          id: randomUUID(),
          userId: user.id,
          phone: args.data.investor.create.phone ?? null,
          createdAt,
          updatedAt: createdAt,
          deletedAt: null,
        });
      }

      return selectFields(user, args.select);
    },
  };

  investmentOpportunity = {
    findMany: async (args?: { where?: { status?: OpportunityStatus }; select?: SelectShape }) => {
      const opportunities = PrismaService.data.investmentOpportunities.filter((item) => {
        if (args?.where?.status && item.status !== args.where.status) return false;
        return !item.deletedAt;
      });

      return opportunities.map((item) => selectFields(item, args?.select));
    },

    findUnique: async (args: { where: { id: string }; select?: SelectShape }) => {
      const opportunity = PrismaService.data.investmentOpportunities.find(
        (item) => item.id === args.where.id && !item.deletedAt,
      );

      if (!opportunity) return null;

      const record: Record<string, any> = { ...opportunity };
      const metricSelection = args.select?.metrics;
      if (metricSelection) {
        const metrics = PrismaService.data.metrics.filter((metric) => metric.opportunityId === opportunity.id);
        if (typeof metricSelection === 'object' && 'select' in metricSelection) {
          record.metrics = metrics.map((metric) => selectFields(metric, (metricSelection as { select?: SelectShape }).select));
        } else {
          record.metrics = metrics;
        }
      }

      return selectFields(record, args.select);
    },
  };

  investmentSimulation = {
    create: async (args: {
      data: {
        investorId: string;
        opportunityId: string;
        amount: number;
        estimatedReturn: number;
        riskLevel: RiskLevel | string;
      };
      select?: SelectShape;
    }) => {
      const createdAt = now();
      const simulation: InvestmentSimulationRecord = {
        id: randomUUID(),
        investorId: args.data.investorId,
        opportunityId: args.data.opportunityId,
        amount: Number(args.data.amount),
        estimatedReturn: Number(args.data.estimatedReturn),
        riskLevel: args.data.riskLevel as RiskLevel,
        simulatedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
        deletedAt: null,
      };

      PrismaService.data.investmentSimulations.push(simulation);
      return selectFields(simulation, args.select);
    },

    findUnique: async (args: { where: { id: string }; select?: SelectShape }) => {
      const simulation = PrismaService.data.investmentSimulations.find(
        (item) => item.id === args.where.id && !item.deletedAt,
      );

      if (!simulation) return null;
      return selectFields(simulation, args.select);
    },
  };

  investmentIntent = {
    findFirst: async (args: { where?: { simulationId?: string; investorId?: string; opportunityId?: string }; select?: SelectShape }) => {
      const intent = PrismaService.data.investmentIntents.find((item) => {
        if (args.where?.simulationId && item.simulationId !== args.where.simulationId) return false;
        if (args.where?.investorId && item.investorId !== args.where.investorId) return false;
        if (args.where?.opportunityId && item.opportunityId !== args.where.opportunityId) return false;
        return !item.deletedAt;
      });

      if (!intent) return null;
      return selectFields(intent, args.select);
    },

    create: async (args: {
      data: {
        investorId: string;
        opportunityId: string;
        simulationId?: string | null;
        amount: number;
        expectedReturn: number;
        status: InvestmentIntentStatus | string;
        confirmedAt?: Date | null;
      };
      select?: SelectShape;
    }) => {
      const createdAt = now();
      const intent: InvestmentIntentRecord = {
        id: randomUUID(),
        investorId: args.data.investorId,
        opportunityId: args.data.opportunityId,
        simulationId: args.data.simulationId ?? null,
        amount: Number(args.data.amount),
        expectedReturn: Number(args.data.expectedReturn),
        status: args.data.status as InvestmentIntentStatus,
        confirmedAt: args.data.confirmedAt ?? null,
        createdAt,
        updatedAt: createdAt,
        deletedAt: null,
      };

      PrismaService.data.investmentIntents.push(intent);
      return selectFields(intent, args.select);
    },
  };

  investment = {
    create: async (args: {
      data: {
        investorId: string;
        opportunityId: string;
        intentId: string;
        investedAmount: number;
        status?: InvestmentStatus;
      };
      select?: SelectShape;
    }) => {
      const createdAt = now();
      const investment: InvestmentRecord = {
        id: randomUUID(),
        investorId: args.data.investorId,
        opportunityId: args.data.opportunityId,
        intentId: args.data.intentId,
        investedAmount: Number(args.data.investedAmount),
        status: args.data.status ?? 'active',
        createdAt,
        updatedAt: createdAt,
        deletedAt: null,
      };

      PrismaService.data.investments.push(investment);
      return selectFields(investment, args.select);
    },
  };
}
