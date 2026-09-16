// server.js – Swedavia FlightInfo v2 (fungerar)
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/flights", async (req, res) => {
  try {
    const airport = req.query.airport || "ARN";

    // dagens datum i YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    const arrivalsUrl = `https://api.swedavia.se/flightinfo/v2/${airport}/arrivals/${today}`;
    const departuresUrl = `https://api.swedavia.se/flightinfo/v2/${airport}/departures/${today}`;

    const headers = {
      "Ocp-Apim-Subscription-Key": "af2b1ac3cce141ce8eb6a4fc782783d9",
      "Accept": "application/json", // ← KRÄVS AV SWEDAVIA
    };

    const [arrivals, departures] = await Promise.all([
      axios.get(arrivalsUrl, { headers }),
      axios.get(departuresUrl, { headers }),
    ]);

    res.json({
      arrivals: arrivals.data,
      departures: departures.data,
    });
  } catch (error) {
    console.error("Swedavia API-fel:", error.response?.data || error.message);
    res.status(500).json({
      error: "Kunde inte hämta flygdata från Swedavia",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(3001, () => {
  console.log("Backend kör på http://localhost:3001");
});
