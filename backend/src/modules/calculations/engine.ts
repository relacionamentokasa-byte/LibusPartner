export interface CriterionCalculationInput {
  attributeId: string;
  libusScore?: number | null; // 1 a 10
  competitorScore?: number | null; // 1 a 10
  isNotApplicable?: boolean;
}

export interface TechnicalCalculationResult {
  totalCriteria: number;
  validCriteria: number; // Ignora N/A e não preenchidos
  naCriteria: number;
  libusSuperiorCount: number;
  competitorSuperiorCount: number;
  drawCount: number;
  libusSuperiorityPercent: number; // % sobre critérios válidos
  libusAverageScore: number;
  competitorAverageScore: number;
  details: Array<{
    attributeId: string;
    libusScore: number | null;
    competitorScore: number | null;
    isNotApplicable: boolean;
    status: 'LIBUS_SUPERIOR' | 'COMPETITOR_SUPERIOR' | 'DRAW' | 'NOT_APPLICABLE' | 'PENDING';
    diff: number | null;
  }>;
}

export function calculateTechnicalResult(
  responses: CriterionCalculationInput[]
): TechnicalCalculationResult {
  let validCriteria = 0;
  let naCriteria = 0;
  let libusSuperiorCount = 0;
  let competitorSuperiorCount = 0;
  let drawCount = 0;
  let libusScoreSum = 0;
  let competitorScoreSum = 0;

  const details = responses.map(item => {
    if (item.isNotApplicable) {
      naCriteria++;
      return {
        attributeId: item.attributeId,
        libusScore: null,
        competitorScore: null,
        isNotApplicable: true,
        status: 'NOT_APPLICABLE' as const,
        diff: null
      };
    }

    const hasLibus = typeof item.libusScore === 'number' && item.libusScore >= 1 && item.libusScore <= 10;
    const hasComp = typeof item.competitorScore === 'number' && item.competitorScore >= 1 && item.competitorScore <= 10;

    if (!hasLibus || !hasComp) {
      return {
        attributeId: item.attributeId,
        libusScore: item.libusScore ?? null,
        competitorScore: item.competitorScore ?? null,
        isNotApplicable: false,
        status: 'PENDING' as const,
        diff: null
      };
    }

    validCriteria++;
    const lScore = item.libusScore!;
    const cScore = item.competitorScore!;
    libusScoreSum += lScore;
    competitorScoreSum += cScore;
    const diff = lScore - cScore;

    let status: 'LIBUS_SUPERIOR' | 'COMPETITOR_SUPERIOR' | 'DRAW';
    if (lScore > cScore) {
      libusSuperiorCount++;
      status = 'LIBUS_SUPERIOR';
    } else if (lScore < cScore) {
      competitorSuperiorCount++;
      status = 'COMPETITOR_SUPERIOR';
    } else {
      drawCount++;
      status = 'DRAW';
    }

    return {
      attributeId: item.attributeId,
      libusScore: lScore,
      competitorScore: cScore,
      isNotApplicable: false,
      status,
      diff
    };
  });

  const libusSuperiorityPercent = validCriteria > 0
    ? Number(((libusSuperiorCount / validCriteria) * 100).toFixed(1))
    : 0;

  const libusAverageScore = validCriteria > 0
    ? Number((libusScoreSum / validCriteria).toFixed(1))
    : 0;

  const competitorAverageScore = validCriteria > 0
    ? Number((competitorScoreSum / validCriteria).toFixed(1))
    : 0;

  return {
    totalCriteria: responses.length,
    validCriteria,
    naCriteria,
    libusSuperiorCount,
    competitorSuperiorCount,
    drawCount,
    libusSuperiorityPercent,
    libusAverageScore,
    competitorAverageScore,
    details
  };
}

export interface EconomicCalculationInput {
  currentPrice: number;       // Preço unitário do produto concorrente
  libusPrice: number;         // Preço unitário do produto Libus
  quantity: number;           // Número de usuários / postos
  consumptionPeriodMonths?: number; // Período de análise em meses (padrão 12 meses / anual)
  lifespanCurrentMonths: number; // Vida útil do concorrente em meses
  lifespanLibusMonths: number;   // Vida útil do Libus em meses
}

export interface EconomicCalculationResult {
  annualUnitsCurrent: number;
  annualUnitsLibus: number;
  costCurrentTotal: number;
  costLibusTotal: number;
  costDifference: number;      // Custo atual - Custo Libus
  economyGenerated: number;    // Economia bruta positiva
  economyPercent: number;      // % de economia
}

export function calculateEconomicResult(
  input: EconomicCalculationInput
): EconomicCalculationResult {
  const months = input.consumptionPeriodMonths && input.consumptionPeriodMonths > 0 ? input.consumptionPeriodMonths : 12;
  const qty = input.quantity > 0 ? input.quantity : 1;
  const lifeCurrent = input.lifespanCurrentMonths > 0 ? input.lifespanCurrentMonths : 1;
  const lifeLibus = input.lifespanLibusMonths > 0 ? input.lifespanLibusMonths : 1;

  // Unidades consumidas no período = (meses / vidaUtil) * quantidade
  const annualUnitsCurrent = Math.ceil((months / lifeCurrent) * qty);
  const annualUnitsLibus = Math.ceil((months / lifeLibus) * qty);

  const costCurrentTotal = Number((annualUnitsCurrent * input.currentPrice).toFixed(2));
  const costLibusTotal = Number((annualUnitsLibus * input.libusPrice).toFixed(2));

  const costDifference = Number((costCurrentTotal - costLibusTotal).toFixed(2));
  const economyGenerated = Math.max(0, costDifference);
  const economyPercent = costCurrentTotal > 0
    ? Number(((costDifference / costCurrentTotal) * 100).toFixed(1))
    : 0;

  return {
    annualUnitsCurrent,
    annualUnitsLibus,
    costCurrentTotal,
    costLibusTotal,
    costDifference,
    economyGenerated,
    economyPercent
  };
}
