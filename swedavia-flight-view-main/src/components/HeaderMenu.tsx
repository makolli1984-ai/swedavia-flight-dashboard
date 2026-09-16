import { Plane, PlaneLanding, PlaneTakeoff, RefreshCw, Moon, Sun, Radio } from "lucide-react";

interface HeaderMenuProps {
  onFetch: () => void;
  onFilterDepartures: () => void;
  onFilterArrivals: () => void;
  onToggleDark: () => void;
  onToggleLive: () => void;
  isDark: boolean;
  isLive: boolean;
  isFetching: boolean;
  activeDirection: "all" | "departure" | "arrival";
}

export function HeaderMenu({
  onFetch,
  onFilterDepartures,
  onFilterArrivals,
  onToggleDark,
  onToggleLive,
  isDark,
  isLive,
  isFetching,
  activeDirection,
}: HeaderMenuProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:gap-3">
        <div className="mr-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="h-4 w-4" />
          </div>
          <span className="hidden font-semibold tracking-tight sm:inline">
            Swedavia Flight Dashboard
          </span>
        </div>

        <MenuButton
          active={activeDirection === "departure"}
          onClick={onFilterDepartures}
          icon={<PlaneTakeoff className="h-4 w-4" />}
          label="Avgångar"
        />
        <MenuButton
          active={activeDirection === "arrival"}
          onClick={onFilterArrivals}
          icon={<PlaneLanding className="h-4 w-4" />}
          label="Ankomster"
        />
        <MenuButton
          onClick={onFetch}
          icon={<RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />}
          label={isFetching ? "Hämtar…" : "Hämta flyg (API)"}
          active={false}
        />

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <MenuButton
            onClick={onToggleLive}
            icon={<Radio className={`h-4 w-4 ${isLive ? "animate-pulse text-emerald-400" : ""}`} />}
            label={isLive ? "Stop Live Mode" : "Start Live Mode"}
            active={isLive}
          />
          <MenuButton
            onClick={onToggleDark}
            icon={isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            label="Dark Mode"
            active={isDark}
          />
        </div>
      </div>
    </header>
  );
}

function MenuButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-card-foreground hover:bg-accent"
      }`}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
