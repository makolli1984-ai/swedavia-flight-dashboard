# Swedavia Flight View

Texten du ska ge Lovable (kopiera & klistra)

Titel:  
Bygg en Swedavia Flight Dashboard webapp

Beskrivning:  
Jag vill att du bygger en webapp som visar flyginformation från Swedavia API.
Webappen ska ha en toppmeny med knappar:

Avgångar

Ankomster

Hämta flyg (API)

Dark Mode

Start Live Mode

Under dessa knappar ska flyg visas i form av “flight cards”.

Flight cards ska visa:

flightId

airlineOperator.name

departureAirportEnglish / Swedish

arrivalAirportEnglish / Swedish

scheduledUtc / estimatedUtc / actualUtc

terminal

gate

flightLegStatus (SCH, DEP, LND, CNL, DLY osv)

Filter-knappar ska finnas:

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

Sortering:

Sortera efter tid (↑ / ↓)

Sökning:

Sök flyg via flightId eller destination

API‑hämtning:

Frontend ska hämta från min backend:

Kod

http://localhost:3001/api/history


Backend returnerar:

json

{
  "flights": [...]
}


Viktigt:  
När man klickar på “Hämta flyg (API)” → ska flights laddas och visas under menyerna.
När man klickar på “Avgångar” → filtrera på flights som är departures.
När man klickar på “Ankomster” → filtrera på arrivals.

Bygg detta i React + Vite.
Gör komponenter:

FlightDashboard.jsx

FlightCard.jsx

Filters.jsx

HeaderMenu.jsx

Gör UI snyggt och modernt.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1703c42a-6d16-45d6-bdaa-0ef917af440b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
