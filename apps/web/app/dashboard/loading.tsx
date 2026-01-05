import { neo } from "@castquest/neo-ux-core";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className={`h-10 ${neo.colors.bg.secondary} rounded w-1/3 mb-2`} />
        <div className={`h-6 ${neo.colors.bg.tertiary} rounded w-2/3`} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-32 ${neo.colors.bg.secondary} rounded-lg`} />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-24 ${neo.colors.bg.secondary} rounded-lg`} />
        ))}
      </div>
    </div>
  );
}
