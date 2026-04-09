export function OrdersTable({ orders }: { orders: Array<{ id: string; total: number; status: string }> }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gold/20 bg-white shadow-glow">
      <table className="w-full text-left text-sm">
        <thead className="bg-gold/10 text-cattleya-muted">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-gold/10">
              <td className="px-4 py-3">{order.id}</td>
              <td className="px-4 py-3">{order.status}</td>
              <td className="px-4 py-3">Rs. {order.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
