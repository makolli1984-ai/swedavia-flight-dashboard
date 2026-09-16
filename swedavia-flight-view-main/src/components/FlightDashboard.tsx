import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { HeaderMenu } from "./HeaderMenu";
import { Filters, type FilterKey } from "./Filters";
import { FlightCard } from "./FlightCard";
import { normalizeFlights } from "@/lib/flight-types";
import { getSwedaviaFlights } from "@/lib/flights.functions";
import { RefreshCw, Plane } from "lucide-react";

const STATUS_CODE_BY_FILTER: Record<FilterKey, string[]> = {
  all: [],
  landed: ["LND", "ARR"],
  delayed: ["DLY", "DEL"],
  boarding: ["BRD", "GTO"],
  cancelled: ["CNL", "CAN"],
  scheduled: ["SCH", "NIL"],
  diverted: ["DIV"],
  departed: ["DEP"],
  arrived: ["ARR", "LND"],
  gatechange: ["GCH"],
};

const AIRPORTS: { code: string; name: string }[] = [
  { code: "ARN", name: "Stockholm Arlanda" },
  { code: "BMA", name: "Stockholm Bromma" },
  { code: "GOT", name: "Göteborg Landvetter" },
  { code: "MMX", name: "Malmö" },
  { code: "LLA", name: "Luleå" },
  { code: "UME", name: "Umeå" },
  { code: "VBY", name: "Visby" },
  { code: "RNB", name: "Ronneby" },
  { code: "KRN", name: "Kiruna" },
  { code: "OSD", name: "Åre Östersund" },
];

export function FlightDashboard() {
  const queryClient = useQueryClient();
  const fetchSwedavia = useServerFn(getSwedaviaFlights);
  const [airport, setAirport] = useState("ARN");
  const [direction, setDirection] = useState<"all" | "departure" | "arrival">("all");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["swedavia-flights", airport],
    queryFn: async () => {
      const res = await fetchSwedavia({ data: { airport } });
      return normalizeFlights(res);
    },
    enabled: hasFetched,
    refetchInterval: isLive ? 30000 : false,
  });

  const flights = data ?? [];

  // Live mode refetch loop fallback (in addition to refetchInterval).
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["swedavia-flights"] });
    }, 30000);
    return () => clearInterval(id);
  }, [isLive, queryClient]);

  const visible = useMemo(() => {
    let list = flights;
    if (direction !== "all") list = list.filter((f) => f.direction === direction);
    const codes = STATUS_CODE_BY_FILTER[filter];
    if (codes.length > 0)
      list = list.filter((f) => codes.includes(f.flightLegStatus?.toUpperCase()));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (f) =>
          f.flightId.toLowerCase().includes(q) ||
          f.departure.english.toLowerCase().includes(q) ||
          f.arrival.english.toLowerCase().includes(q) ||
          f.departure.swedish.toLowerCase().includes(q) ||
          f.arrival.swedish.toLowerCase().includes(q) ||
          f.departure.iata.toLowerCase().includes(q) ||
          f.arrival.iata.toLowerCase().includes(q)
      );
    }
    const sorted = [...list].sort((a, b) => {
      const ta = new Date(a.scheduledUtc || a.estimatedUtc || 0).getTime();
      const tb = new Date(b.scheduledUtc || b.estimatedUtc || 0).getTime();
      return sortAsc ? ta - tb : tb - ta;
    });
    return sorted;
  }, [flights, direction, filter, search, sortAsc]);

  const handleFetch = () => {
    setHasFetched(true);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderMenu
        onFetch={handleFetch}
        onFilterDepartures={() => setDirection("departure")}
        onFilterArrivals={() => setDirection("arrival")}
        onToggleDark={() => {
          document.documentElement.classList.toggle("dark");
          setIsDark(document.documentElement.classList.contains("dark"));
        }}
        onToggleLive={() => {
          if (!hasFetched) setHasFetched(true);
          setIsLive((v) => !v);
        }}
        isDark={isDark}
        isLive={isLive}
        isFetching={isFetching}
        activeDirection={direction}
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted-foreground" htmlFor="airport">
            Flygplats
          </label>
          <select
            id="airport"
            value={airport}
            onChange={(e) => setAirport(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-card-foreground"
          >
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name} ({a.code})
              </option>
            ))}
          </select>

          {direction !== "all" && (
            <button
              type="button"
              onClick={() => setDirection("all")}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:bg-accent"
            >
              Visa alla (avgångar + ankomster) ×
            </button>
          )}
          {direction !== "all" && (
            <span className="text-xs text-muted-foreground">
              {direction === "departure" ? "Avgångar" : "Ankomster"}
            </span>
          )}
        </div>

        <div className="mb-6">
          <Filters
            active={filter}
            onFilter={setFilter}
            search={search}
            onSearch={setSearch}
            sortAsc={sortAsc}
            onToggleSort={() => setSortAsc((v) => !v)}
            resultCount={visible.length}
          />
        </div>

        {!hasFetched && (
          <EmptyState
            icon={<Plane className="h-8 w-8" />}
            title="Inga flyg hämtade än"
            text="Klicka på “Hämta flyg (API)” i menyn för att ladda dagens flyg från Swedavia."
          />
        )}

        {hasFetched && isFetching && flights.length === 0 && (
          <EmptyState
            icon={<RefreshCw className="h-8 w-8 animate-spin" />}
            title="Hämtar flyg…"
            text={`Hämtar dagens avgångar och ankomster för ${airport} från Swedavia.`}
          />
        )}

        {hasFetched && isError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">
            <p className="font-semibold">Kunde inte hämta flyg</p>
            <p className="mt-1 text-rose-200/80">
              Swedavia svarade inte som förväntat för {airport}. Kontrollera att
              din API-nyckel har tillgång till Flight Info v2.
            </p>
            <p className="mt-2 text-xs text-rose-200/60">{String(error?.message ?? "")}</p>
            <button
              type="button"
              onClick={handleFetch}
              className="mt-3 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-600"
            >
              Försök igen
            </button>
          </div>
        )}

        {hasFetched && !isFetching && !isError && visible.length === 0 && (
          <EmptyState
            icon={<Plane className="h-8 w-8" />}
            title="Inga träffar"
            text="Inga flyg matchar dina filter. Justera sökningen eller filtren."
          />
        )}

        {visible.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((f) => (
              <FlightCard key={`${f.flightId}-${f.direction}`} flight={f} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
