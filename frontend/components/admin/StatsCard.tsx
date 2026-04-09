import { Card, CardContent } from "@/components/ui/card";

export function StatsCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent>
        <div className="text-sm text-cattleya-muted">{label}</div>
        <div className="mt-2 font-heading text-3xl text-cattleya-black">{value}</div>
      </CardContent>
    </Card>
  );
}
