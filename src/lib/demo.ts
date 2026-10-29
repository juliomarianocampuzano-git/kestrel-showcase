export type Tool = {
  id: string;
  name: string;
  category: string;
  owner: string;
  purpose: string;
  risk: "Low" | "Transparency" | "Review";
  status: "Reviewed" | "Needs review";
  personalData: boolean;
};
export const sampleTools: Tool[] = [
  [
    "t01",
    "Assist Chat",
    "Writing",
    "Sofia Bennett",
    "Draft internal briefs",
    "Low",
    "Reviewed",
    false,
  ],
  [
    "t02",
    "Codewing",
    "Development",
    "Oliver Reed",
    "Suggest code changes",
    "Low",
    "Reviewed",
    false,
  ],
  [
    "t03",
    "Canvas AI",
    "Design",
    "Emma Rossi",
    "Create concept illustrations",
    "Transparency",
    "Reviewed",
    false,
  ],
  [
    "t04",
    "Meetnote",
    "Productivity",
    "Liam Costa",
    "Summarize client meetings",
    "Transparency",
    "Needs review",
    true,
  ],
  [
    "t05",
    "Support Finch",
    "Customer service",
    "Mia Laurent",
    "Answer customer questions",
    "Transparency",
    "Reviewed",
    true,
  ],
  [
    "t06",
    "Voice Loom",
    "Audio",
    "Noah Silva",
    "Generate synthetic narration",
    "Transparency",
    "Needs review",
    false,
  ],
  [
    "t07",
    "Search Nest",
    "Research",
    "Ava Martin",
    "Find reference materials",
    "Low",
    "Reviewed",
    false,
  ],
  [
    "t08",
    "Slide Craft",
    "Presentations",
    "Ethan Moretti",
    "Draft pitch presentations",
    "Low",
    "Reviewed",
    false,
  ],
  [
    "t09",
    "Talent Lens",
    "People",
    "Isabella Clark",
    "Rank job applicants",
    "Review",
    "Needs review",
    true,
  ],
  [
    "t10",
    "Translate Brook",
    "Language",
    "Lucas Ferri",
    "Translate project briefs",
    "Low",
    "Reviewed",
    false,
  ],
  [
    "t11",
    "Sheet Pilot",
    "Analytics",
    "Charlotte King",
    "Explore sample sales data",
    "Low",
    "Reviewed",
    false,
  ],
  [
    "t12",
    "Clip Studio AI",
    "Video",
    "Henry Blake",
    "Create synthetic video scenes",
    "Transparency",
    "Reviewed",
    false,
  ],
  [
    "t13",
    "Mail Sprout",
    "Marketing",
    "Amelia Hughes",
    "Draft campaign messages",
    "Low",
    "Reviewed",
    false,
  ],
  [
    "t14",
    "Insight Grove",
    "Analytics",
    "James Walker",
    "Summarize anonymous surveys",
    "Low",
    "Reviewed",
    false,
  ],
].map(
  (r) =>
    ({
      id: r[0],
      name: r[1],
      category: r[2],
      owner: r[3],
      purpose: r[4],
      risk: r[5],
      status: r[6],
      personalData: r[7],
    }) as Tool,
);
const names = [
  "Sofia Bennett",
  "Oliver Reed",
  "Emma Rossi",
  "Liam Costa",
  "Mia Laurent",
  "Noah Silva",
  "Ava Martin",
  "Ethan Moretti",
  "Isabella Clark",
  "Lucas Ferri",
  "Charlotte King",
  "Henry Blake",
  "Amelia Hughes",
  "James Walker",
  "Harper Brooks",
  "Benjamin Hayes",
  "Evelyn Stone",
  "Daniel Quinn",
  "Abigail Green",
  "Leo West",
  "Emily Archer",
  "Samuel Fox",
  "Grace Lane",
];
export const sampleEmployees = names.map((name, i) => ({
  id: `e${i + 1}`,
  name,
  team: ["Design", "Engineering", "Operations", "Client services"][i % 4],
  completed: i < 18,
  progress: i < 18 ? 100 : i < 21 ? 60 : 0,
  date: i < 18 ? "2026-10-21" : null,
}));
export const demoEvents = [
  {
    title: "Evidence pack exported",
    actor: "Sofia Bennett",
    time: "2026-10-29T09:42:00Z",
  },
  {
    title: "AI literacy acknowledgment signed",
    actor: "Oliver Reed",
    time: "2026-10-28T14:15:00Z",
  },
  {
    title: "Support Finch assessment reviewed",
    actor: "Sofia Bennett",
    time: "2026-10-28T10:20:00Z",
  },
];
export function summarize(tools: Tool[]) {
  return {
    total: tools.length,
    reviewed: tools.filter((t) => t.status === "Reviewed").length,
    low: tools.filter((t) => t.risk === "Low").length,
    transparency: tools.filter((t) => t.risk === "Transparency").length,
    review: tools.filter((t) => t.risk === "Review").length,
  };
}
export function validateImport(rows: Record<string, string>[]) {
  const errors: string[] = [];
  const tools: Tool[] = [];
  if (rows.length > 500)
    return { errors: ["Maximum 500 rows per import."], tools };
  rows.forEach((r, i) => {
    if (!r.name?.trim() || !r.owner?.trim() || !r.purpose?.trim())
      errors.push(`Row ${i + 2}: name, owner and purpose are required.`);
    else
      tools.push({
        id: `import-${i}-${r.name}`,
        name: r.name.trim().slice(0, 100),
        owner: r.owner.trim().slice(0, 100),
        purpose: r.purpose.trim().slice(0, 500),
        category: r.category?.trim().slice(0, 60) || "Other",
        risk: "Review",
        status: "Needs review",
        personalData: r.personalData?.toLowerCase() === "true",
      });
  });
  return { errors, tools };
}
