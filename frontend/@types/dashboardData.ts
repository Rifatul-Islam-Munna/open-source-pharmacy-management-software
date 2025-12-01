export interface DashboardResponse {
  summary: DashboardSummary;
  chartData: ChartDataItem[];
  topProducts: TopProduct[];
}

export interface DashboardSummary {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  totalSales: number;
  customerCount: number;
  totalDue: number;
}

export type Period =
  | number // for today, week, month, year
  | {
      year: number;
      month: number;
      day: number;
    }; // for custom range

export interface ChartDataItem {
  period: Period;
  revenue: number;
  cost: number;
  profit: number;
  salesCount: number;
  customerCount: number;
}

export interface TopProduct {
  name: string;
  units: number;
  revenue: number;
}
