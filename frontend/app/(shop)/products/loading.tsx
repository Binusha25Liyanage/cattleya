import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8"><Skeleton className="h-96 rounded-3xl" /><Skeleton className="h-[720px] rounded-3xl" /></div>;
}
