import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8"><Skeleton className="h-[640px] rounded-3xl" /><Skeleton className="h-[360px] rounded-3xl" /></div>;
}
