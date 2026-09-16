import { Search, ArrowDownUp, ArrowUp, ArrowDown } from "lucide-react";

export type FilterKey =
  | "all"
  | "landed"
  | "delayed"
  | "boarding"
  | "cancelled"
  | "scheduled"
  | "diverted"
  | "departed"
  | "arrived"
  | "gatechange";

const FILTERS: { key: FilterKey; label: string; codes: string[] }[] = [
  { key: "all", label: "All", codes: [] },
  { key: "landed", label: "Landed", codes: ["LND"] },
  { key: "delayed", label: "Delayed", codes: ["DLY"] },
  { key: "boarding", label: "Boarding", codes: ["BRD"] },
  { key: "cancelled", label: "Cancelled", codes: ["CNL"] },
  { key: "scheduled", label: "Scheduled", codes: ["SCH"] },
  { key: "diverted", label: "Diverted", codes: ["DIV"] },
  { key: "departed", label: "Departed", codes: ["DEP"] },
  { key: "arrived", label: "Arrived", codes: ["ARR"] },
  { key: "gatechange", label: "Gate change", codes: ["GCH"] },
];

interface FiltersProps {
  active: FilterKey;
  onFilter: (key: FilterKey) => void;
  search: string;
  onSearch: (value: string) => void;
  sortAsc: boolean;
  onToggleSort: () => void;
  resultCount: number;
}

export function Filters({
  active,
  onFilter,
  search,
  onSearch,
  sortAsc,
  onToggleSort,
  resultCount,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onFilter(f.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              active === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Sök flightId eller destination…"
            className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="button"
          onClick={onToggleSort}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          title="Sortera efter tid"
        >
          <ArrowDownUp className="h-4 w-4" />
          <span>Tid</span>
          {sortAsc ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </button>
        <span className="text-xs text-muted-foreground">{resultCount} träffar</span>
      </div>
    </div>
  );
}
