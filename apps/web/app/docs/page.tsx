import { neo } from "@castquest/neo-ux-core";

export default function DocsPage() {
  const sections = [
    { title: "Getting Started", icon: "🚀", items: ["Quick Start", "Installation", "Configuration"] },
    { title: "API Reference", icon: "📚", items: ["Frames API", "Quests API", "Smart Contracts"] },
    { title: "Guides", icon: "📖", items: ["Creating Frames", "Building Quests", "NFT Integration"] },
    { title: "SDK", icon: "🔧", items: ["TypeScript SDK", "React Hooks", "Examples"] },
  ];

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold ${neo.colors.text.primary} mb-4`}>
            Documentation 📚
          </h1>
          <p className={`text-xl ${neo.colors.text.secondary}`}>
            Comprehensive guides and API reference for building on CastQuest.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <div
              key={section.title}
              className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} transition-all`}
            >
              <div className="text-4xl mb-4">{section.icon}</div>
              <h3 className={`text-xl font-bold ${neo.colors.text.primary} mb-3`}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`text-sm ${neo.colors.text.secondary} hover:${neo.colors.text.accent} transition-colors`}
                    >
                      → {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
