import { neo } from "@castquest/neo-ux-core";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className={`h-10 ${neo.colors.bg.secondary} rounded w-64 mb-2`} />
          <div className={`h-6 ${neo.colors.bg.tertiary} rounded w-96`} />
        </div>
        <div className={`h-12 w-32 ${neo.colors.bg.secondary} rounded-lg`} />
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-32 ${neo.colors.bg.secondary} rounded-lg`} />
        ))}
      </div>
      <div className={`h-96 ${neo.colors.bg.secondary} rounded-lg`} />
    </div>
  );
}
