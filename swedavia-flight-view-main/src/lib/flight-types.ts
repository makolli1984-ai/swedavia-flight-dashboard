// Swedavia flight types, status mapping, and normalization.


// IATA codes for Swedavia-operated airports. Used to decide whether a flight
// is a departure from or an arrival at a Swedavia airport.
export const SWEDAVIA_AIRPORTS = new Set([
  "ARN", // Stockholm-Arlanda
  "BMA", // Stockholm-Bromma
  "GOT", // Göteborg-Landvetter
  "MMX", // Malmö-Sturup
  "SDL", // Sundsvall
  "LLU", // Luleå-Kallax
  "RNB", // Ronneby
  "KLR", // Kalmar
  "VBY", // Visby
  "OER", // Örnsköldsvik
  "AGH", // Ängelholm-Helsingborg
  "KVB", // Skellefteå
  "EVG", // Lycksele
  "HUV", // Hudiksvall
  "ORB", // Örebro
  "OSK", // Oskarshamn
  "SMP", // Västervik-Smalandsknuten
  "TYF", // Torsby
]);

export type FlightLegStatus =
  | "SCH" // Scheduled
  | "DEP" // Departed
  | "LND" // Landed
  | "CNL" // Cancelled
  | "DLY" // Delayed
  | "BRD" // Boarding
  | "DIV" // Diverted
  | "ARR" // Arrived
  | "GCH" // Gate change
  | string;

export interface NormalizedFlight {
  flightId: string;
  airlineOperatorName: string;
  departure: { english: string; swedish: string; iata: string };
  arrival: { english: string; swedish: string; iata: string };
  scheduledUtc: string;
  estimatedUtc: string;
  actualUtc: string;
  terminal: string;
  gate: string;
  flightLegStatus: FlightLegStatus;
  direction: "departure" | "arrival" | "unknown";
}

interface StatusMeta {
  label: string;
  // tailwind classes for the badge
  badge: string;
}

export const STATUS_META: Record<string, StatusMeta> = {
  SCH: { label: "Scheduled", badge: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  DEP: { label: "Departed", badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  LND: { label: "Landed", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  CNL: { label: "Cancelled", badge: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  DLY: { label: "Delayed", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  BRD: { label: "Boarding", badge: "bg-violet-500/15 text-violet-300 border-violet-500/30" },
  DIV: { label: "Diverted", badge: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30" },
  ARR: { label: "Arrived", badge: "bg-teal-500/15 text-teal-300 border-teal-500/30" },
  DEL: { label: "Delayed", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  CAN: { label: "Cancelled", badge: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  NIL: { label: "Scheduled", badge: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  GTO: { label: "Boarding", badge: "bg-violet-500/15 text-violet-300 border-violet-500/30" },
  GTC: { label: "Gate closed", badge: "bg-orange-500/15 text-orange-300 border-orange-500/30" },
  GCH: { label: "Gate change", badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
};

export function statusMeta(code: string | undefined): StatusMeta {
  if (!code) return { label: "—", badge: "bg-muted text-muted-foreground border-border" };
  return STATUS_META[code.toUpperCase()] ?? {
    label: code,
    badge: "bg-muted text-muted-foreground border-border",
  };
}

// Tolerant getter: walk paths and return the first that resolves.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pick(obj: any, paths: string[]): any {
  if (!obj) return undefined;
  for (const p of paths) {
    const v = p.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
    if (v != null && v !== "") return v;
  }
  return undefined;
}

function str(v: unknown): string {
  if (v == null) return "";
  return String(v);
}

// Normalize an arbitrary backend flight object into our shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeFlight(raw: any): NormalizedFlight {
  const depIata = str(
    pick(raw, [
      "flightLegIdentifier.departureAirportIata",
      "departureAirport.iataCode",
      "departureAirportIata",
      "dep.iata",
    ])
  );
  const arrIata = str(
    pick(raw, [
      "flightLegIdentifier.arrivalAirportIata",
      "arrivalAirport.iataCode",
      "arrivalAirportIata",
      "arr.iata",
    ])
  );

  let direction: "departure" | "arrival" | "unknown" = raw?.__direction ?? "unknown";
  if (direction === "unknown") {
    if (depIata && SWEDAVIA_AIRPORTS.has(depIata)) direction = "departure";
    else if (arrIata && SWEDAVIA_AIRPORTS.has(arrIata)) direction = "arrival";
  }

  // Times: prefer the side matching direction, fall back to top-level.
  const timeBase =
    direction === "arrival"
      ? pick(raw, ["arrivalTime", "arrival"]) ?? raw
      : pick(raw, ["departureTime", "departure"]) ?? raw;

  return {
    flightId: str(pick(raw, ["flightId", "id", "flightNumber"])),
    airlineOperatorName: str(
      pick(raw, ["airlineOperator.name", "airline.name", "airline", "operator"])
    ),
    departure: {
      english: str(
        pick(raw, [
          "departureAirportEnglish",
          "departureAirport.englishName",
          "departureAirport.name",
        ])
      ),
      swedish: str(pick(raw, ["departureAirportSwedish", "departureAirport.swedishName"])),
      iata: depIata,
    },
    arrival: {
      english: str(
        pick(raw, ["arrivalAirportEnglish", "arrivalAirport.englishName", "arrivalAirport.name"])
      ),
      swedish: str(pick(raw, ["arrivalAirportSwedish", "arrivalAirport.swedishName"])),
      iata: arrIata,
    },
    scheduledUtc: str(pick([timeBase, raw], ["scheduledUtc", "scheduled"])),
    estimatedUtc: str(pick([timeBase, raw], ["estimatedUtc", "estimated"])),
    actualUtc: str(pick([timeBase, raw], ["actualUtc", "actual"])),
    terminal: str(
      pick(raw, [
        "locationAndStatus.terminal",
        "terminal",
        "departureTerminal",
        "arrivalTerminal",
      ])
    ),
    gate: str(
      pick(raw, ["locationAndStatus.gate", "gate", "departureGate", "arrivalGate", "gateCode"])
    ),
    flightLegStatus: str(
      pick(raw, ["locationAndStatus.flightLegStatus", "flightLegStatus", "status", "state"])
    ),
    direction,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeFlights(payload: any): NormalizedFlight[] {
  const list = Array.isArray(payload) ? payload : payload?.flights ?? payload?.data ?? [];
  if (!Array.isArray(list)) return [];
  return list.map(normalizeFlight).filter((f) => f.flightId);
}

export function formatUtc(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Stockholm",
  });
}

export function formatUtcFull(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("sv-SE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Stockholm",
  });
}
