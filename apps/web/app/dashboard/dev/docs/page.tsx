"use client";

import { neo } from "@castquest/neo-ux-core";

export default function APIDocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          API Documentation 📚
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Comprehensive API reference and interactive documentation.
        </p>
      </div>

      <div className={`p-6 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ${neo.glow.active}`}>
        <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>
          Base URL
        </h2>
        <div className={`p-4 rounded-lg ${neo.colors.bg.tertiary} border ${neo.colors.border.default} font-mono text-sm ${neo.colors.text.accent}`}>
          https://api.castquest.io/v1
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            service: "FramesClient",
            description: "Create, validate, and manage Farcaster frames",
            endpoints: ["GET /frames", "POST /frames", "PUT /frames/{id}", "POST /frames/{id}/validate"],
          },
          {
            service: "PermissionsService",
            description: "RBAC and user access control management",
            endpoints: ["GET /permissions/users/{id}/roles", "POST /permissions/users/{id}/roles"],
          },
          {
            service: "SmartBrainEngine",
            description: "AI-powered frame generation and optimization",
            endpoints: ["POST /ai/agents", "POST /ai/optimize"],
          },
          {
            service: "OracleDBService",
            description: "On-chain data queries and treasury management",
            endpoints: ["GET /oracle/treasury", "GET /oracle/contracts/{address}"],
          },
        ].map((service) => (
          <div
            key={service.service}
            className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} transition-all`}
          >
            <h3 className={`text-lg font-bold ${neo.colors.text.primary} mb-2`}>
              {service.service}
            </h3>
            <p className={`text-sm ${neo.colors.text.secondary} mb-4`}>
              {service.description}
            </p>
            <div className="space-y-1">
              {service.endpoints.map((endpoint) => (
                <div
                  key={endpoint}
                  className={`text-xs font-mono ${neo.colors.text.tertiary} px-2 py-1 rounded ${neo.colors.bg.tertiary}`}
                >
                  {endpoint}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
