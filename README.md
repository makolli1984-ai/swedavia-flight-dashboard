Swedavia Flight Dashboard
En modern webapp som visar live‑flyginformation från Swedavias API.
Byggd i React + Vite och strukturerad för att användas med Lovable.dev.

✈️ Funktioner
Toppmeny
Webappen ska ha en toppmeny med knappar:

Avgångar

Ankomster

Hämta flyg (API)

Dark Mode

Start Live Mode

När man klickar på Hämta flyg (API) ska alla flights laddas och visas.

När man klickar på Avgångar → filtrera på departures.
När man klickar på Ankomster → filtrera på arrivals.

🧩 Flight Cards
Varje flight ska visas som ett “flight card” med:

flightId

airlineOperator.name

departureAirportEnglish / Swedish

arrivalAirportEnglish / Swedish

scheduledUtc / estimatedUtc / actualUtc

terminal

gate

flightLegStatus  
(SCH, DEP, LND, CNL, DLY osv)

🔍 Filter
Filterknappar ska finnas:

All

Landed

Delayed

Boarding

Cancelled

Scheduled

Diverted

Departed

Arrived

Gate change

⏱ Sortering
Sortera efter tid:

Tid ↑

Tid ↓

🔎 Sökning
Sök flyg via:

flightId

destination

🌐 API‑hämtning
Frontend hämtar från backend:

Kod
http://localhost:3001/api/history
Backend returnerar:

json
{
  "flights": [...]
}
🧱 Projektstruktur (Lovable)
Bygg komponenter:

FlightDashboard.jsx

FlightCard.jsx

Filters.jsx

HeaderMenu.jsx

UI ska vara modernt, snyggt och responsivt.

🚀 Build with Lovable
Detta projekt kan fortsätta utvecklas i Lovable:

https://lovable.dev/projects/1703c42a-6d16-45d6-bdaa-0ef917af440b

🛠 Development
Kör lokalt:

sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
