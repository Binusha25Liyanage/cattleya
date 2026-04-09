import { api } from "@/lib/api";
import { StatsCard } from "@/components/admin/StatsCard";
import { OrdersTable } from "@/components/admin/OrdersTable";

async function getStats() {
  const response = await api.get("/admin/stats");
  return response.data.data;
}

export default async function AdminDashboardPage() {
  const stats = await getStats().catch(() => ({ ordersToday: 0, revenueMonth: 0, pendingDesigns: 0, lowStockItems: 0 }));
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard label="Orders Today" value={stats.ordersToday} />
        <StatsCard label="Revenue This Month" value={`Rs. ${Number(stats.revenueMonth || 0).toFixed(2)}`} />
        <StatsCard label="Pending Designs" value={stats.pendingDesigns} />
        <StatsCard label="Low Stock Items" value={stats.lowStockItems} />
      </div>
      <OrdersTable orders={[]} />
    </div>
  );
}
