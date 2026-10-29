"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  FileCheck2,
  FileText,
  Fingerprint,
  Globe2,
  History,
  Info,
  Layers,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
  AlertCircle,
  Building2,
  Mail,
} from "lucide-react";
import Papa from "papaparse";
import { Logo, Language, Pill, useLocale } from "./ui";
import { getDictionary } from "@/lib/i18n";
import { designCopy } from "@/lib/design-copy";
import { getSampleWorkspace } from "@/lib/mock-api";
import {
  sampleTools,
  sampleEmployees,
  summarize,
  validateImport,
  type Tool,
} from "@/lib/demo";
type Tab =
  | "overview"
  | "inventory"
  | "risk"
  | "training"
  | "notices"
  | "evidence"
  | "shadow"
  | "agency"
  | "audit"
  | "settings";
type LocalEvent = { title: string; actor: string; time: string };
const tabs: Tab[] = [
  "overview",
  "inventory",
  "risk",
  "training",
  "notices",
  "evidence",
  "shadow",
  "agency",
  "audit",
  "settings",
];
const icons = {
  overview: LayoutDashboard,
  inventory: Layers,
  risk: ShieldCheck,
  training: BookOpen,
  notices: MessageSquare,
  evidence: FileCheck2,
  shadow: Fingerprint,
  agency: Building2,
  audit: History,
  settings: Settings2,
};
const storage = "kestrel.demo.v1";
const blank: Tool = {
  id: "",
  name: "",
  category: "Other",
  owner: "",
  purpose: "",
  risk: "Review",
  status: "Needs review",
  personalData: false,
};
export default function Demo() {
  const { locale, setLocale } = useLocale();
  const t = getDictionary(locale);
  const d = designCopy[locale];
  const [tab, setTab] = useState<Tab>("overview");
  const [toolSets, setToolSets] = useState<Record<string, Tool[]>>({
    "Northwind Studio": sampleTools,
    "Juniper Works": [],
    "Harbor & Pine": [],
  });
  const [loaded, setLoaded] = useState(false);
  const [role, setRole] = useState("admin");
  const [client, setClient] = useState("Northwind Studio");
  const [brand, setBrand] = useState("Kestrel");
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState("");
  const [editing, setEditing] = useState<Tool | null>(null);
  const [selected, setSelected] = useState<Tool | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Tool[]>([]);
  const [channel, setChannel] = useState<"chat" | "email" | "voice">("chat");
  const [course, setCourse] = useState(false);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [ack, setAck] = useState(false);
  const [signature, setSignature] = useState("");
  const [signed, setSigned] = useState(false);
  const [survey, setSurvey] = useState("");
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [brandInput, setBrandInput] = useState("");
  const tools = toolSets[client] || [];
  const employees = client === "Northwind Studio" ? sampleEmployees : [];
  const setTools = (update: Tool[] | ((previous: Tool[]) => Tool[])) =>
    setToolSets((previous) => ({
      ...previous,
      [client]:
        typeof update === "function" ? update(previous[client] || []) : update,
    }));
  const editDialog = useRef<HTMLDialogElement>(null),
    detailDialog = useRef<HTMLDialogElement>(null),
    courseDialog = useRef<HTMLDialogElement>(null),
    fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("tab");
    if (tabs.includes(p as Tab)) setTab(p as Tab);
    try {
      const raw = JSON.parse(localStorage.getItem(storage) || "null");
      if (raw) {
        if (
          Array.isArray(raw.tools) &&
          raw.tools.every(
            (r: Tool) =>
              typeof r.name === "string" &&
              typeof r.owner === "string" &&
              typeof r.purpose === "string" &&
              ["Low", "Transparency", "Review"].includes(r.risk),
          )
        )
          setToolSets((prev) => ({ ...prev, "Northwind Studio": raw.tools }));
        if (raw.toolSets && typeof raw.toolSets === "object")
          setToolSets(raw.toolSets);
        if (Array.isArray(raw.events)) setEvents(raw.events);
        setSigned(Boolean(raw.signed));
        setSurvey(typeof raw.survey === "string" ? raw.survey : "");
        setBrand(typeof raw.brand === "string" ? raw.brand : "Kestrel");
      }
    } catch {
      localStorage.removeItem(storage);
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    let active = true;
    void getSampleWorkspace().then((sample) => {
      if (active)
        setToolSets((previous) =>
          JSON.stringify(previous["Northwind Studio"]) ===
          JSON.stringify(sampleTools)
            ? { ...previous, "Northwind Studio": sample.tools }
            : previous,
        );
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(
          storage,
          JSON.stringify({ toolSets, events, signed, survey, brand }),
        );
      } catch {
        setToast(
          "Browser storage is unavailable. Changes last only for this visit.",
        );
      }
    }
  }, [toolSets, events, signed, survey, brand, loaded]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    if (editing) editDialog.current?.showModal();
  }, [editing]);
  useEffect(() => {
    if (selected) detailDialog.current?.showModal();
  }, [selected]);
  useEffect(() => {
    if (course) courseDialog.current?.showModal();
  }, [course]);
  const stats = summarize(tools),
    canEdit = role === "admin";
  const filtered = tools.filter(
    (x) =>
      (filter === "all" || x.risk === filter) &&
      `${x.name} ${x.owner} ${x.purpose}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function go(next: Tab) {
    setTab(next);
    setMobile(false);
    setQuery("");
    setFilter("all");
    setError("");
    history.replaceState(null, "", `/demo/?tab=${next}`);
  }
  function log(title: string) {
    setEvents((prev) =>
      [
        { title, actor: "Sample user", time: new Date().toISOString() },
        ...prev,
      ].slice(0, 40),
    );
  }
  function saveTool(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit || !editing) return;
    if (
      !editing.name.trim() ||
      !editing.owner.trim() ||
      !editing.purpose.trim()
    ) {
      setError(t.required);
      return;
    }
    const item = {
      ...editing,
      name: editing.name.trim(),
      owner: editing.owner.trim(),
      purpose: editing.purpose.trim(),
      id: editing.id || crypto.randomUUID(),
    };
    setTools((prev) =>
      prev.some((x) => x.id === item.id)
        ? prev.map((x) => (x.id === item.id ? item : x))
        : [...prev, item],
    );
    log(`${t.localEvent}: ${item.name}`);
    editDialog.current?.close();
    setEditing(null);
    setToast(t.success);
  }
  function deleteTool(tool: Tool) {
    if (!canEdit || !confirm(t.confirmDelete)) return;
    setTools((prev) => prev.filter((x) => x.id !== tool.id));
    log(`${t.remove}: ${tool.name}`);
    setToast(t.success);
  }
  async function importFile(file?: File) {
    if (!canEdit || !file) return;
    if (file.size > 1024 * 1024) {
      setError(t.fileError);
      return;
    }
    try {
      const parsed = Papa.parse<Record<string, string>>(await file.text(), {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: (h) => h.trim(),
      });
      const result = validateImport(parsed.data);
      if (parsed.errors.length || result.errors.length) {
        setError(result.errors.join("\n") || t.fileError);
        setPending([]);
      } else {
        setError("");
        setPending(result.tools);
      }
    } catch {
      setError(t.fileError);
    }
    if (fileInput.current) fileInput.current.value = "";
  }
  function commitImport() {
    if (!canEdit) return;
    const existing = new Set(tools.map((x) => x.name.toLowerCase()));
    const unique = pending
      .filter((x) => {
        const k = x.name.toLowerCase();
        if (existing.has(k)) return false;
        existing.add(k);
        return true;
      })
      .map((x) => ({ ...x, id: crypto.randomUUID() }));
    setTools((prev) => [...prev, ...unique]);
    setPending([]);
    log(`${t.import}: ${unique.length}`);
    setToast(t.importSuccess);
  }
  const riskLabel = (r: Tool["risk"]) =>
    r === "Low" ? t.low : r === "Transparency" ? t.transparency : t.review;
  const statusLabel = (s: Tool["status"]) =>
    s === "Reviewed" ? t.reviewed : t.review;
  const tone = (r: Tool["risk"]) =>
    r === "Low" ? "green" : r === "Transparency" ? "amber" : "rose";
  function toolTable(rows: Tool[], actions = false) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.name}</th>
              <th>{t.owner}</th>
              <th>{t.risk}</th>
              <th>{t.status}</th>
              {actions && <th>{t.edit}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((tool) => (
              <tr key={tool.id}>
                <td className="tool-cell">
                  <button
                    className="tool-name"
                    style={{
                      border: 0,
                      background: "none",
                      padding: 0,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelected(tool)}
                  >
                    <span
                      className={`tool-icon ${tool.risk === "Review" ? "amber-icon" : ""}`}
                    >
                      {tool.name.slice(0, 1)}
                    </span>
                    <span>
                      <b>{tool.name}</b>
                      <small>{tool.category}</small>
                    </span>
                  </button>
                </td>
                <td>
                  <span className="owner-label">
                    <span className="owner-avatar">
                      {tool.owner
                        .split(" ")
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    {tool.owner}
                  </span>
                </td>
                <td>
                  <Pill tone={tone(tool.risk)}>{riskLabel(tool.risk)}</Pill>
                </td>
                <td>
                  <Pill tone={tool.status === "Reviewed" ? "green" : "amber"}>
                    {statusLabel(tool.status)}
                  </Pill>
                </td>
                {actions && (
                  <td>
                    <div className="table-actions">
                      <button
                        className="icon-button"
                        aria-label={`${t.edit} ${tool.name}`}
                        disabled={!canEdit}
                        onClick={() => {
                          setError("");
                          setEditing({ ...tool });
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`${t.remove} ${tool.name}`}
                        disabled={!canEdit}
                        onClick={() => deleteTool(tool)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="empty-state">{t.empty}</p>}
      </div>
    );
  }
  function packLinks() {
    return (
      <>
        <a className="btn dark" href="/samples/northwind-evidence.pdf" download>
          <Download size={15} />
          {t.download}
        </a>
        <a
          className="btn outline"
          href="/samples/northwind-evidence.docx"
          download
        >
          {t.downloadDoc}
        </a>
        <a className="btn outline" href="/samples/manifest.json" download>
          {t.manifest}
        </a>
      </>
    );
  }
  const title = tab === "overview" ? t.greeting : t[tab];
  const subtitles = {
    overview: t.intro,
    inventory: t.inventoryIntro,
    risk: t.riskIntro,
    training: t.trainingIntro,
    notices: t.noticesIntro,
    evidence: t.evidenceIntro,
    shadow: t.shadowIntro,
    agency: t.agencyIntro,
    audit: t.auditIntro,
    settings: t.privacyBody,
  };
  const sampleActivity = [
    { title: t.evidence, actor: "Sofia Bennett", time: "2026-10-29T09:42:00Z" },
    { title: t.signed, actor: "Oliver Reed", time: "2026-10-28T14:15:00Z" },
    {
      title: `Support Finch · ${t.reviewed}`,
      actor: "Sofia Bennett",
      time: "2026-10-28T10:20:00Z",
    },
  ];
  const activities = [...events, ...sampleActivity];
  return (
    <div className="app-shell" data-view={tab}>
      <a className="skip-link" href="#workspace-main">
        {d.skip}
      </a>
      {mobile && (
        <button
          className="sidebar-close"
          aria-label={t.close}
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <Logo light />
        <button className="workspace-switch" onClick={() => go("agency")}>
          <span className="workspace-avatar">{client.slice(0, 1)}</span>
          <span>
            <small>{t.workspace}</small>
            <strong>{client}</strong>
          </span>
          <ChevronDown size={12} />
        </button>
        <p className="nav-label">{brand.toUpperCase()}</p>
        <nav className="side-nav" aria-label="Workspace">
          {tabs.slice(0, 7).map((k) => {
            const Icon = icons[k];
            return (
              <button
                key={k}
                className={tab === k ? "active" : ""}
                aria-current={tab === k ? "page" : undefined}
                onClick={() => go(k)}
              >
                <Icon size={16} />
                {t[k]}
              </button>
            );
          })}
        </nav>
        <div style={{ height: 25 }} />
        <p className="nav-label">{t.workspace}</p>
        <nav className="side-nav">
          {tabs.slice(7).map((k) => {
            const Icon = icons[k];
            return (
              <button
                key={k}
                className={tab === k ? "active" : ""}
                aria-current={tab === k ? "page" : undefined}
                onClick={() => go(k)}
              >
                <Icon size={16} />
                {t[k]}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <ShieldCheck size={18} />
            {t.sample}
          </div>
          <a href="/" className="side-home">
            <ArrowLeft size={13} />
            {t.back}
          </a>
          <div className="user-profile">
            <span className="user-avatar">SB</span>
            <div>
              <b>Sofia Bennett</b>
              <small>
                {role === "admin"
                  ? t.admin
                  : role === "employee"
                    ? t.employee
                    : t.auditor}
              </small>
            </div>
            <MoreHorizontal size={15} style={{ marginLeft: "auto" }} />
          </div>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-topbar">
          <div className="breadcrumbs">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={19} />
            </button>
            <span>{client}</span>
            <ChevronRight size={12} />
            <strong>{t[tab]}</strong>
          </div>
          <div className="topbar-right">
            <Pill>{t.demo}</Pill>
            <Language locale={locale} onChange={setLocale} />
            <span className="owner-avatar">SB</span>
          </div>
        </header>
        <div className="sample-banner">
          <Info size={13} />
          <b>{t.demo}</b>
          <span>· {t.sample}</span>
          <a href="/">
            {t.back}
            <ArrowUpRight size={11} />
          </a>
        </div>
        <main className="dashboard-main" id="workspace-main">
          <div className="page-heading">
            <div>
              <p className="eyebrow">{t.updated.toUpperCase()}</p>
              <h1>{title}</h1>
              <p>{subtitles[tab]}</p>
            </div>
            <div className="page-actions">
              {tab === "overview" && (
                <button className="btn outline" onClick={() => go("evidence")}>
                  <Download size={14} />
                  {t.export}
                </button>
              )}
              {tab === "inventory" && (
                <button
                  className="btn dark"
                  disabled={!canEdit}
                  onClick={() => {
                    setError("");
                    setEditing({ ...blank });
                  }}
                >
                  <Plus size={15} />
                  {t.newTool}
                </button>
              )}
            </div>
          </div>
          {!canEdit && (
            <div className="notice-strip">
              <Info size={15} />
              {t.readOnly}
            </div>
          )}
          {tab === "overview" && (
            <>
              <div className="workspace-shortcuts">
                <p>{d.quickTitle}</p>
                <button onClick={() => go("inventory")}>
                  <Layers size={16} />
                  {d.quickInventory}
                  <ArrowUpRight size={14} />
                </button>
                <button onClick={() => go("training")}>
                  <BookOpen size={16} />
                  {d.quickTraining}
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="stat-grid">
                {[
                  [
                    t.tools,
                    stats.total,
                    Layers,
                    `${stats.reviewed} ${t.reviewed.toLowerCase()}`,
                  ],
                  [
                    t.reviewed,
                    stats.reviewed,
                    ShieldCheck,
                    `${stats.total} ${t.tools.toLowerCase()}`,
                  ],
                  [
                    t.employees,
                    employees.filter((e) => e.completed).length,
                    Users,
                    `${employees.length ? 78 : 0}% ${t.completed.toLowerCase()}`,
                  ],
                  [
                    t.actions,
                    tools.filter((x) => x.status !== "Reviewed").length,
                    AlertCircle,
                    t.review,
                  ],
                ].map(([label, n, Icon, sub], i) => {
                  const I = Icon as typeof Layers;
                  return (
                    <div className="stat-card" key={i}>
                      <div className="stat-top">
                        {label as string}
                        <span>
                          <I size={15} />
                        </span>
                      </div>
                      <strong>
                        {n as number}
                        {i === 2 && <small> / {employees.length}</small>}
                      </strong>
                      <p>
                        {i !== 3 && <Check size={10} />} {sub as string}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="dashboard-grid">
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h2>{t.distribution}</h2>
                      <p>{t.distributionSub}</p>
                    </div>
                    <button
                      className="icon-button"
                      aria-label={t.risk}
                      onClick={() => go("risk")}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                  <div className="chart-area">
                    <div
                      className="donut"
                      style={{
                        background: stats.total
                          ? `conic-gradient(#168779 0% ${(stats.low / stats.total) * 100}%,#e8bb65 ${(stats.low / stats.total) * 100}% ${((stats.low + stats.transparency) / stats.total) * 100}%,#e39072 ${((stats.low + stats.transparency) / stats.total) * 100}% 100%)`
                          : "#eee",
                      }}
                    >
                      <div>
                        <strong>{stats.total}</strong>
                        <small>{t.tools}</small>
                      </div>
                    </div>
                    <div className="chart-legend">
                      <p>
                        <i className="dot teal" />
                        {t.low}
                        <b>{stats.low}</b>
                      </p>
                      <p>
                        <i className="dot amber" />
                        {t.transparency}
                        <b>{stats.transparency}</b>
                      </p>
                      <p>
                        <i className="dot rose" />
                        {t.review}
                        <b>{stats.review}</b>
                      </p>
                    </div>
                  </div>
                  <div className="chart-caption">
                    <Info size={12} />
                    {t.riskNote}
                  </div>
                </section>
                <section className="panel">
                  <div className="panel-head">
                    <h2>{t.attention}</h2>
                    <Pill tone="amber">3</Pill>
                  </div>
                  {[
                    [t.task1, t.task1body, "risk"],
                    [t.task2, t.task2body, "training"],
                    [t.task3, t.task3body, "notices"],
                  ].map(([title, body, next], i) => (
                    <button
                      key={title}
                      className="task-item"
                      onClick={() => go(next as Tab)}
                    >
                      <span className="task-icon">
                        {i === 1 ? (
                          <BookOpen size={15} />
                        ) : i === 2 ? (
                          <Mic size={15} />
                        ) : (
                          <AlertCircle size={15} />
                        )}
                      </span>
                      <span>
                        <b>{title}</b>
                        <p>{body}</p>
                      </span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </section>
              </div>
              <section className="panel">
                <div className="panel-head">
                  <div>
                    <h2>{t.inventory}</h2>
                    <p>
                      {stats.total} {t.tools.toLowerCase()} · {client}
                    </p>
                  </div>
                  <button className="text-link" onClick={() => go("inventory")}>
                    {t.view}
                    <ArrowRight size={12} />
                  </button>
                </div>
                {toolTable(tools.slice(0, 4))}
              </section>
              <div className="bottom-grid">
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h2>{t.activity}</h2>
                      <p>{t.activitySub}</p>
                    </div>
                    <button
                      className="icon-button"
                      aria-label={t.audit}
                      onClick={() => go("audit")}
                    >
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                  {activities.slice(0, 3).map((e, i) => (
                    <div className="activity-item" key={i}>
                      <span>
                        <CheckCircle2 size={14} />
                      </span>
                      <div>
                        <b>{e.title}</b>
                        <small>{e.actor}</small>
                      </div>
                      <time>
                        {new Date(e.time).toLocaleDateString(locale, {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  ))}
                </section>
                <section className="evidence-promo">
                  <FileCheck2 size={25} />
                  <h3>{t.packTitle}</h3>
                  <p>{t.packSub}</p>
                  <button
                    className="btn outline small"
                    onClick={() => go("evidence")}
                  >
                    {t.more}
                    <ArrowUpRight size={13} />
                  </button>
                </section>
              </div>
            </>
          )}
          {tab === "inventory" && (
            <>
              <div className="toolbar">
                <label className="search-input">
                  <Search size={15} />
                  <input
                    aria-label={t.search}
                    placeholder={t.search}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  aria-label={t.risk}
                  className="filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">{t.all}</option>
                  <option value="Low">{t.low}</option>
                  <option value="Transparency">{t.transparency}</option>
                  <option value="Review">{t.review}</option>
                </select>
                <a
                  className="btn outline"
                  href="/samples/tools-template.csv"
                  download
                >
                  <ArrowDownToLine size={14} />
                  {t.downloadCsv}
                </a>
                <button
                  className="btn outline"
                  disabled={!canEdit}
                  onClick={() => fileInput.current?.click()}
                >
                  <Upload size={14} />
                  {t.import}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".csv,text/csv"
                  className="file-input"
                  onChange={(e) => void importFile(e.target.files?.[0])}
                />
              </div>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              {pending.length > 0 && (
                <div className="notice-strip">
                  <span>
                    {pending.length} {t.tools.toLowerCase()}
                  </span>
                  <button className="btn dark small" onClick={commitImport}>
                    {t.import}
                  </button>
                  <button
                    className="btn outline small"
                    onClick={() => setPending([])}
                  >
                    {t.cancel}
                  </button>
                </div>
              )}
              <section className="panel">{toolTable(filtered, true)}</section>
            </>
          )}
          {tab === "risk" && (
            <>
              <div className="notice-strip">
                <Info size={15} />
                {t.riskNote}
              </div>
              <div className="risk-cards">
                {[
                  [stats.low, t.low],
                  [stats.transparency, t.transparency],
                  [stats.review, t.review],
                ].map(([n, label]) => (
                  <article className="risk-card" key={label}>
                    <strong>{n}</strong>
                    <h3>{label}</h3>
                    <p>{t.assessmentSample}</p>
                  </article>
                ))}
              </div>
              <section className="panel">{toolTable(tools)}</section>
            </>
          )}
          {tab === "training" && (
            <>
              <div className="course-card">
                <span>
                  <BookOpen size={28} />
                </span>
                <div>
                  <h2>{t.course}</h2>
                  <p>{t.courseSub}</p>
                </div>
                <button className="btn dark" onClick={() => setCourse(true)}>
                  {t.start}
                  <ArrowRight size={15} />
                </button>
              </div>
              <section className="panel">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{t.employees}</th>
                        <th>{t.team}</th>
                        <th>{t.progress}</th>
                        <th>{t.status}</th>
                        <th>{t.certificate}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((e) => (
                        <tr key={e.id}>
                          <td>
                            <span className="owner-label">
                              <span className="owner-avatar">
                                {e.name
                                  .split(" ")
                                  .map((s) => s[0])
                                  .join("")}
                              </span>
                              {e.name}
                            </span>
                          </td>
                          <td>{e.team}</td>
                          <td>
                            <span className="progress-track">
                              <i style={{ width: `${e.progress}%` }} />
                            </span>
                            {e.progress}%
                          </td>
                          <td>
                            <Pill
                              tone={
                                e.completed
                                  ? "green"
                                  : e.progress
                                    ? "amber"
                                    : "gray"
                              }
                            >
                              {e.completed
                                ? t.completed
                                : e.progress
                                  ? t.inProgress
                                  : t.notStarted}
                            </Pill>
                          </td>
                          <td>
                            {e.completed ? (
                              <button
                                className="icon-button"
                                aria-label={`${t.certificate} ${e.name}`}
                                onClick={() => {
                                  setToast(`${t.demo} · ${e.name}`);
                                  window.open(
                                    "/samples/sample-certificate.pdf",
                                    "_blank",
                                    "noopener,noreferrer",
                                  );
                                }}
                              >
                                <Download size={15} />
                              </button>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
          {tab === "notices" && (
            <>
              <div className="channel-tabs">
                {(["chat", "email", "voice"] as const).map((c) => {
                  const I =
                    c === "chat" ? MessageSquare : c === "email" ? Mail : Mic;
                  return (
                    <button
                      key={c}
                      className={channel === c ? "selected" : ""}
                      onClick={() => setChannel(c)}
                    >
                      <I size={15} />
                      {t[c]}
                    </button>
                  );
                })}
              </div>
              <div className="notice-layout">
                <section className="panel">
                  <div className="panel-head">
                    <h2>{t.notices}</h2>
                    <Pill tone="gray">{t.assessmentSample}</Pill>
                  </div>
                  <div className="panel-body">
                    <div className="notice-preview">
                      <small>AI DISCLOSURE / {channel.toUpperCase()}</small>
                      {t[`${channel}Text`]}
                    </div>
                    <p
                      className="muted"
                      style={{ fontSize: 11, marginBottom: 20 }}
                    >
                      {t.sampleNotice}
                    </p>
                    <button
                      className="btn dark"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            t[`${channel}Text`],
                          );
                          setToast(t.copied);
                        } catch {
                          setToast(t.sampleNotice);
                        }
                      }}
                    >
                      {t.copy}
                      <FileText size={14} />
                    </button>
                  </div>
                </section>
                <section className="panel info-panel">
                  <Globe2 size={26} />
                  <h3>{t.sourceText}</h3>
                  <p>{t.legal}</p>
                  <div className="notice-phone">
                    <div className="phone-top">Northwind Studio · {t.demo}</div>
                    <div className="phone-content">
                      <div className="phone-bubble">{t[`${channel}Text`]}</div>
                    </div>
                  </div>
                  <a
                    href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.source}
                    <ArrowUpRight size={13} />
                  </a>
                </section>
              </div>
            </>
          )}
          {tab === "evidence" && (
            <div className="notice-layout">
              <section className="panel">
                <div className="pack-hero">
                  <FileCheck2 size={49} />
                  <div>
                    <h2>{t.packTitle}</h2>
                    <p>{t.packSub}</p>
                  </div>
                </div>
                <div className="pack-list">
                  <h3>{t.included}</h3>
                  {[t.included1, t.included2, t.included3, t.included4].map(
                    (s) => (
                      <p key={s}>
                        <CheckCircle2 size={15} />
                        {s}
                      </p>
                    ),
                  )}
                </div>
                <div className="pack-buttons">{packLinks()}</div>
              </section>
              <section className="panel info-panel">
                <Fingerprint size={33} />
                <h3>{t.integrity}</h3>
                <p>{t.integrityBody}</p>
                <p style={{ marginTop: 18 }}>{t.legal}</p>
                <div className="notice-strip" style={{ marginTop: 25 }}>
                  <Info size={15} />
                  {t.demo} · PDF/DOCX: EN
                </div>
              </section>
            </div>
          )}
          {tab === "shadow" && (
            <div className="notice-layout">
              <section className="panel">
                <div className="panel-head">
                  <div>
                    <h2>{t.survey}</h2>
                    <p>{t.surveySub}</p>
                  </div>
                  <ClipboardList size={21} />
                </div>
                <form
                  className="panel-body"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!canEdit) return;
                    log(t.survey);
                    setToast(t.submitted);
                  }}
                >
                  <label className="field">
                    <span>{t.surveyQ}</span>
                    <textarea
                      required
                      maxLength={1000}
                      disabled={!canEdit}
                      value={survey}
                      onChange={(e) => setSurvey(e.target.value)}
                      placeholder="Assist Chat, Codewing…"
                    />
                    <small>{t.surveyHint}</small>
                  </label>
                  <button className="btn dark" disabled={!canEdit}>
                    {t.submit}
                    <ArrowRight size={14} />
                  </button>
                </form>
              </section>
              <section className="panel info-panel">
                <Fingerprint size={31} />
                <h3>{t.extension}</h3>
                <p>{t.extensionBody}</p>
                <div className="notice-strip" style={{ marginTop: 22 }}>
                  {t.demo}
                </div>
              </section>
            </div>
          )}
          {tab === "agency" && (
            <>
              <div className="notice-strip">
                <Info size={15} />
                {t.sample}
              </div>
              <div className="client-grid">
                {["Northwind Studio", "Juniper Works", "Harbor & Pine"].map(
                  (name, i) => (
                    <article className="client-card" key={name}>
                      <span>{name.slice(0, 1)}</span>
                      <h3>{name}</h3>
                      <p>
                        {t.clientSample} · {(toolSets[name] || []).length}{" "}
                        {t.tools.toLowerCase()}
                      </p>
                      <button
                        className="btn outline"
                        onClick={() => {
                          setClient(name);
                          go("overview");
                        }}
                      >
                        {t.openClient}
                        <ArrowUpRight size={14} />
                      </button>
                    </article>
                  ),
                )}
              </div>
            </>
          )}
          {tab === "audit" && (
            <section className="panel">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{t.event}</th>
                      <th>{t.actor}</th>
                      <th>{t.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((e, i) => (
                      <tr key={i}>
                        <td>{e.title}</td>
                        <td>{e.actor}</td>
                        <td>{new Date(e.time).toLocaleString(locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {tab === "settings" && (
            <div className="settings-grid">
              <section className="panel">
                <div className="panel-head">
                  <h2>{t.settings}</h2>
                  <Settings2 size={18} />
                </div>
                <div className="panel-body">
                  <label className="field">
                    <span>{t.language}</span>
                    <Language locale={locale} onChange={setLocale} />
                  </label>
                  <label className="field">
                    <span>{t.role}</span>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="admin">{t.admin}</option>
                      <option value="employee">{t.employee}</option>
                      <option value="auditor">{t.auditor}</option>
                    </select>
                  </label>
                  <p className="muted" style={{ fontSize: 11 }}>
                    {t.expires}
                  </p>
                </div>
              </section>
              <section className="panel">
                <div className="panel-head">
                  <h2>{t.whiteLabel}</h2>
                  <Building2 size={18} />
                </div>
                <form
                  className="panel-body"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (canEdit) {
                      setBrand(brandInput.trim() || "Kestrel");
                      setToast(t.success);
                    }
                  }}
                >
                  <label className="field">
                    <span>{t.brand}</span>
                    <input
                      maxLength={40}
                      disabled={!canEdit}
                      value={brandInput}
                      onChange={(e) => setBrandInput(e.target.value)}
                      placeholder={brand}
                    />
                    <small>{t.brandHint}</small>
                  </label>
                  <button className="btn outline" disabled={!canEdit}>
                    {t.apply}
                  </button>
                </form>
              </section>
              <section className="panel info-panel">
                <ShieldCheck size={24} />
                <h3>{t.privacy}</h3>
                <p>{t.privacyBody}</p>
                <button
                  className="btn outline"
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    if (confirm(t.resetConfirm)) {
                      setToolSets({
                        "Northwind Studio": sampleTools,
                        "Juniper Works": [],
                        "Harbor & Pine": [],
                      });
                      setEvents([]);
                      setSurvey("");
                      setSigned(false);
                      setBrand("Kestrel");
                      setClient("Northwind Studio");
                      setToast(t.resetDone);
                    }
                  }}
                >
                  {t.reset}
                </button>
              </section>
            </div>
          )}
          <footer className="app-footer">
            <span>{t.noticeFooter}</span>
            <span>
              Copyright (c) 2026 Mariano Campuzano. All rights reserved.
            </span>
          </footer>
        </main>
      </div>
      <dialog
        ref={editDialog}
        aria-label={editing?.id ? t.edit : t.newTool}
        onClose={() => {
          setEditing(null);
          setError("");
        }}
      >
        <div className="modal-header">
          <h2>{editing?.id ? t.edit : t.newTool}</h2>
          <button
            className="icon-button"
            aria-label={t.close}
            onClick={() => editDialog.current?.close()}
          >
            <X size={19} />
          </button>
        </div>
        {editing && (
          <form className="modal-body" onSubmit={saveTool}>
            {(["name", "owner", "purpose", "category"] as const).map((k) => (
              <label className="field" key={k}>
                <span>{t[`${k}Label`]}</span>
                <input
                  required
                  maxLength={k === "purpose" ? 500 : 100}
                  value={editing[k]}
                  onChange={(e) =>
                    setEditing({ ...editing, [k]: e.target.value })
                  }
                />
              </label>
            ))}
            <label className="check-field">
              <input
                type="checkbox"
                checked={editing.personalData}
                onChange={(e) =>
                  setEditing({ ...editing, personalData: e.target.checked })
                }
              />
              {t.dataLabel}
            </label>
            <p className="muted" style={{ fontSize: 11 }}>
              {t.riskNote}
            </p>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn outline"
                onClick={() => editDialog.current?.close()}
              >
                {t.cancel}
              </button>
              <button className="btn dark" disabled={!canEdit}>
                {t.save}
              </button>
            </div>
          </form>
        )}
      </dialog>
      <dialog
        ref={detailDialog}
        aria-label={selected?.name || t.details}
        onClose={() => setSelected(null)}
      >
        <div className="modal-header">
          <h2>{selected?.name}</h2>
          <button
            className="icon-button"
            aria-label={t.close}
            onClick={() => detailDialog.current?.close()}
          >
            <X size={19} />
          </button>
        </div>
        {selected && (
          <div className="modal-body">
            <Pill tone={tone(selected.risk)}>{riskLabel(selected.risk)}</Pill>
            <div className="details-grid">
              <div>
                <small>{t.owner}</small>
                <p>{selected.owner}</p>
              </div>
              <div>
                <small>{t.personal}</small>
                <p>{selected.personalData ? t.yes : t.no}</p>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <small>{t.purpose}</small>
                <p>{selected.purpose}</p>
              </div>
            </div>
            <div className="result-box">
              <b>{t.assessmentSample}</b>
              <p>{t.riskDetail}</p>
            </div>
            <p className="muted" style={{ fontSize: 11, marginTop: 18 }}>
              {t.legal}
            </p>
            <div className="modal-footer">
              <button
                className="btn outline"
                onClick={() => detailDialog.current?.close()}
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </dialog>
      <dialog
        ref={courseDialog}
        aria-label={t.course}
        onClose={() => setCourse(false)}
      >
        <div className="modal-header">
          <h2>{t.course}</h2>
          <button
            className="icon-button"
            aria-label={t.close}
            onClick={() => courseDialog.current?.close()}
          >
            <X size={19} />
          </button>
        </div>
        <div className="modal-body">
          <Pill tone="gray">{t.demo}</Pill>
          <p style={{ fontSize: 13, margin: "20px 0" }}>{t.courseText}</p>
          <h3 style={{ fontSize: 14, lineHeight: 1.6 }}>{t.question}</h3>
          <div className="quiz-options">
            {[t.answer1, t.answer2].map((s, i) => (
              <label key={s}>
                <input
                  type="radio"
                  name="sample-answer"
                  value={i}
                  checked={answer === String(i)}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setChecked(false);
                  }}
                />
                {s}
              </label>
            ))}
          </div>
          <button
            className="btn outline small"
            disabled={!answer}
            onClick={() => setChecked(true)}
          >
            {t.check}
          </button>
          {checked && (
            <p className={answer === "0" ? "success" : "error"} role="status">
              {answer === "0" ? t.correct : t.incorrect}
            </p>
          )}
          {checked && answer === "0" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (ack && signature.trim()) {
                  setSigned(true);
                  log(t.signed);
                  setToast(t.signed);
                }
              }}
            >
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={ack}
                  required
                  onChange={(e) => setAck(e.target.checked)}
                />
                {t.ack}
              </label>
              <label className="field">
                <span>{t.signature}</span>
                <input
                  required
                  minLength={2}
                  maxLength={80}
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Alex Sample"
                />
              </label>
              <button
                className="btn dark"
                disabled={!ack || signature.trim().length < 2}
              >
                {t.sign}
              </button>
            </form>
          )}
          {signed && <p className="success">{t.signed}</p>}
        </div>
      </dialog>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
