// flights.functions.ts – slår ihop arrivals + departures till en lista
export async function getSwedaviaFlights({ data }) {
  const airport = data.airport;

  const API_URL = `http://localhost:3001/flights?airport=${airport}`;

  const res = await fetch(API_URL);
  const json = await res.json();

  // slå ihop båda listorna
  const arrivals = json.arrivals?.flights ?? [];
  const departures = json.departures?.flights ?? [];

  // returnera en enda lista som normalizeFlights förstår
  return [...arrivals, ...departures];
}
