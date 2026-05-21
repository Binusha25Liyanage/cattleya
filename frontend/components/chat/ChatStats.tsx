"use client";

interface ChatStatsProps {
  openConversations: number;
  avgResponseTime: string;
  resolvedToday: number;
  unreadCount: number;
}

export function ChatStats({ openConversations, avgResponseTime, resolvedToday, unreadCount }: ChatStatsProps) {
  const stats = [
    { label: "Open Conversations", value: openConversations.toString() },
    { label: "Avg Response Time", value: avgResponseTime },
    { label: "Resolved Today", value: resolvedToday.toString() },
    { label: "Unread", value: unreadCount.toString() },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-3xl border border-[#E8E8E8] bg-[#F5F5F5] p-4 text-sm">
          <div className="text-[#6B6B6B]">{stat.label}</div>
          <div className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
