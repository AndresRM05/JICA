-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('investor', 'business', 'admin');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('available', 'reserved', 'closed');

-- CreateEnum
CREATE TYPE "InvestmentIntentStatus" AS ENUM ('pending', 'confirmed', 'cancelled');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('active', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentOpportunity" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "targetAmount" DECIMAL(65,30) NOT NULL,
    "currentAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "minAmount" DECIMAL(65,30) NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "estimatedReturn" DECIMAL(65,30) NOT NULL,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InvestmentOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessFinancialMetric" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "month" TEXT NOT NULL,
    "revenue" DECIMAL(65,30) NOT NULL,
    "grossMargin" DECIMAL(65,30) NOT NULL,
    "operatingMargin" DECIMAL(65,30) NOT NULL,
    "customerCount" INTEGER,
    "averageTicket" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BusinessFinancialMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentSimulation" (
    "id" UUID NOT NULL,
    "investorId" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "estimatedReturn" DECIMAL(65,30) NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "simulatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InvestmentSimulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentIntent" (
    "id" UUID NOT NULL,
    "investorId" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "simulationId" UUID,
    "amount" DECIMAL(65,30) NOT NULL,
    "expectedReturn" DECIMAL(65,30) NOT NULL,
    "status" "InvestmentIntentStatus" NOT NULL DEFAULT 'pending',
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InvestmentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" UUID NOT NULL,
    "investorId" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "intentId" UUID NOT NULL,
    "investedAmount" DECIMAL(65,30) NOT NULL,
    "status" "InvestmentStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_userId_key" ON "Investor"("userId");

-- CreateIndex
CREATE INDEX "Investor_userId_idx" ON "Investor"("userId");

-- CreateIndex
CREATE INDEX "InvestmentOpportunity_status_idx" ON "InvestmentOpportunity"("status");

-- CreateIndex
CREATE INDEX "InvestmentOpportunity_riskLevel_idx" ON "InvestmentOpportunity"("riskLevel");

-- CreateIndex
CREATE INDEX "BusinessFinancialMetric_opportunityId_idx" ON "BusinessFinancialMetric"("opportunityId");

-- CreateIndex
CREATE INDEX "InvestmentSimulation_investorId_idx" ON "InvestmentSimulation"("investorId");

-- CreateIndex
CREATE INDEX "InvestmentSimulation_opportunityId_idx" ON "InvestmentSimulation"("opportunityId");

-- CreateIndex
CREATE INDEX "InvestmentIntent_investorId_idx" ON "InvestmentIntent"("investorId");

-- CreateIndex
CREATE INDEX "InvestmentIntent_opportunityId_idx" ON "InvestmentIntent"("opportunityId");

-- CreateIndex
CREATE INDEX "InvestmentIntent_status_idx" ON "InvestmentIntent"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentIntent_investorId_opportunityId_key" ON "InvestmentIntent"("investorId", "opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "Investment_intentId_key" ON "Investment"("intentId");

-- CreateIndex
CREATE INDEX "Investment_investorId_idx" ON "Investment"("investorId");

-- CreateIndex
CREATE INDEX "Investment_opportunityId_idx" ON "Investment"("opportunityId");

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessFinancialMetric" ADD CONSTRAINT "BusinessFinancialMetric_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "InvestmentOpportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentSimulation" ADD CONSTRAINT "InvestmentSimulation_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentSimulation" ADD CONSTRAINT "InvestmentSimulation_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "InvestmentOpportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentIntent" ADD CONSTRAINT "InvestmentIntent_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentIntent" ADD CONSTRAINT "InvestmentIntent_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "InvestmentOpportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentIntent" ADD CONSTRAINT "InvestmentIntent_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "InvestmentSimulation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "InvestmentOpportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "InvestmentIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
