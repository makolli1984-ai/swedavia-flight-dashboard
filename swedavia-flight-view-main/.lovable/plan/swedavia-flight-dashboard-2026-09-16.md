# Swedavia Flight Dashboard

En sida som visar flyginformation som "flight cards", med toppmeny, filter, sortering och sökning. Flygen hämtas från din egen backend på `http://localhost:3001/api/history` (fungerar när din backend körs på samma dator som webbläsaren).

## Toppmeny

- Avgångar — visar bara avgående flyg
- Ankomster — visar bara ankommande flyg
- Hämta flyg (API) — hämtar flygen från din backend
- Dark Mode — växlar mellan mörkt och ljust läge
- Start Live Mode — hämtar om flygen automatiskt var 30:e sekund, knappen växlar till "Stop Live Mode"

## Filter, sortering, sökning

- Filterknappar: All, Landed, Delayed, Boarding, Cancelled, Scheduled, Diverted, Departed, Arrived, Gate change
- Sortering på tid, med pil upp/ned för att växla ordning
- Sökfält som matchar flightId eller destination/ort

Filter, sortering och sökning fungerar tillsammans, och antalet träffar visas.

## Flight card

Varje kort visar flightId, flygbolag, avreseflygplats och ankomstflygplats (engelska med svenska namnet under), schemalagd/beräknad/faktisk tid, terminal, gate samt status som färgad etikett (t.ex. grön för landat, rött för inställt, gult för försenat).

## Utseende

Mörkt flygplatsinspirerat läge som standard, med ljust läge via Dark Mode-knappen. Monospace-siffror för tider, kort i ett responsivt rutnät, tydliga statusfärger. Inga lila gradienter.

## Tillstånd att hantera

- Innan hämtning: uppmaning att klicka "Hämta flyg (API)"
- Under hämtning: laddningsindikator
- Vid fel (backend nere): tydligt meddelande att `http://localhost:3001` inte svarar och att din backend behöver köras
- Inga träffar efter filtrering: tomt-läge

## Tekniska detaljer

- TanStack Start-projekt; sidan byggs på `/` i `src/routes/index.tsx`
- Komponenter i `src/components/`: `FlightDashboard.tsx`, `FlightCard.tsx`, `Filters.tsx`, `HeaderMenu.tsx` (TypeScript i stället för .jsx eftersom projektet är TS)
- Hämtning direkt från webbläsaren mot en API-URL som ligger i en konstant (`API_URL`), default `http://localhost:3001/api/history` — du byter bara den raden till din riktiga Swedavia/ backend-URL senare. TanStack Query för manuell trigger + refetch-intervall i live mode; svarsformen `{ flights: [...] }`, tolerant mot saknade fält
- Statuskoder (SCH, DEP, LND, CNL, DLY, BRD, DIV, ARR, GCH) mappas till etiketter och filter
- Färger och läge via befintliga design-tokens i `src/styles.css`; dark mode togglar `.dark` på `html`
- Egen `head()`-metadata (titel/beskrivning) på route

Obs: din backend måste tillåta anrop från webbläsaren (CORS) för att hämtningen ska lyckas.
