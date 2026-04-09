import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <div className="space-y-6"><Skeleton className="h-36 rounded-3xl" /><Skeleton className="h-[420px] rounded-3xl" /></div>;
}
