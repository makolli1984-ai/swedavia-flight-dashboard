import {
  type NormalizedFlight,
  formatUtc,
  formatUtcFull,
  statusMeta,
} from "@/lib/flight-types";
import { ArrowRight } from "lucide-react";

export function FlightCard({ flight }: { flight: NormalizedFlight }) {
  const meta = statusMeta(flight.flightLegStatus);
  const dep = [flight.departure.english || flight.departure.iata || "—"]
    .filter(Boolean)
    .join(" ");
  const arr = [flight.arrival.english || flight.arrival.iata || "—"]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-primary/40">
      <span
        className={`absolute left-0 top-0 h-full w-1 ${meta.badge.split(" ")[0]}`}
        aria-hidden
      />
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-lg font-semibold tracking-tight">
                {flight.flightId || "—"}
              </h3>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${meta.badge}`}
              >
                {meta.label}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {flight.airlineOperatorName || "—"}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div className="font-mono">
              {flight.terminal ? `T${flight.terminal}` : ""}
              {flight.terminal && flight.gate ? " · " : ""}
              {flight.gate ? `Gate ${flight.gate}` : ""}
              {!flight.terminal && !flight.gate ? "—" : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{dep}</p>
            {flight.departure.swedish && (
              <p className="truncate text-xs text-muted-foreground">
                {flight.departure.swedish}
              </p>
            )}
            {flight.departure.iata && (
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {flight.departure.iata}
              </p>
            )}
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1 text-right">
            <p className="truncate font-medium">{arr}</p>
            {flight.arrival.swedish && (
              <p className="truncate text-xs text-muted-foreground">
                {flight.arrival.swedish}
              </p>
            )}
            {flight.arrival.iata && (
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {flight.arrival.iata}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
          <Time label="Scheduled" value={formatUtc(flight.scheduledUtc)} title={formatUtcFull(flight.scheduledUtc)} />
          <Time label="Estimated" value={formatUtc(flight.estimatedUtc)} title={formatUtcFull(flight.estimatedUtc)} />
          <Time label="Actual" value={formatUtc(flight.actualUtc)} title={formatUtcFull(flight.actualUtc)} />
        </div>
      </div>
    </article>
  );
}

function Time({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-mono text-sm font-medium" title={title}>
        {value}
      </p>
    </div>
  );
}
