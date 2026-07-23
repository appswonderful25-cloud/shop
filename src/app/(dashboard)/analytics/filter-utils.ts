export interface AnalyticsFilter {
  timeframe: string;
  dateRange: { start: string; end: string } | null;
  category: string;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function isInTimeframe(dateStr: string | undefined, filter: AnalyticsFilter): boolean {
  if (!dateStr) return false;
  const d = parseDate(dateStr);
  if (!d) return false;

  const now = new Date();

  switch (filter.timeframe) {
    case "daily": {
      return d.toDateString() === now.toDateString();
    }
    case "monthly": {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    case "yearly": {
      return true;
    }
    case "custom": {
      if (!filter.dateRange) return true;
      const start = parseDate(filter.dateRange.start);
      const end = parseDate(filter.dateRange.end);
      if (!start || !end) return true;
      end.setHours(23, 59, 59, 999);
      return d >= start && d <= end;
    }
    case "all_time":
    default:
      return true;
  }
}

export function filterOrdersByTime(orders: any[], filter: AnalyticsFilter): any[] {
  return orders.filter((o) => isInTimeframe(o.dateOrder, filter));
}

export function filterTicketsByTime(tickets: any[], filter: AnalyticsFilter): any[] {
  return tickets.filter((t) => isInTimeframe(t.dateTicket, filter));
}

export function filterReturnsByTime(returns: any[], filter: AnalyticsFilter): any[] {
  return returns.filter((r) => isInTimeframe(r.createdAt, filter));
}

export function filterProductsByCategory(products: any[], category: string): any[] {
  if (!category || category === "all") return products;
  return products.filter((p) => p.productCategory === category);
}

export function getTimeframeLabel(timeframe: string): string {
  switch (timeframe) {
    case "daily": return "Today";
    case "monthly": return "This Month";
    case "yearly": return "This Year";
    case "custom": return "Custom Range";
    case "all_time": return "All Time";
    default: return timeframe;
  }
}
