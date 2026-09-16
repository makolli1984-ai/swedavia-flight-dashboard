markdown
# Swedavia Flight Dashboard

A real-time flight dashboard built with **React**, **Vite**, **TypeScript**, and a **Node.js/Express backend**.  
The application fetches live flight data (arrivals and departures) from **Swedavia FlightInfo v2 API** and displays it in a modern, interactive dashboard.

---

## ✈️ Features

- Fetch real-time flight data from Swedavia API  
- Support for multiple airports (ARN, GOT, MMX, etc.)  
- Combined arrivals + departures view  
- Search, filtering, and sorting  
- Live mode toggle  
- Clean and responsive UI  
- Backend proxy for secure API key handling  

---

## 🧩 Project Structure

swedavia-flight-dashboard/
│
├── backend/
│   └── server.js        # Express backend fetching Swedavia API data
│
└── frontend/
├── src/
│   ├── components/  # React components
│   ├── lib/         # API functions + normalization
│   └── App.tsx
└── index.html

Kod

---

## ⚙️ Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
2. Add your Swedavia API key
Inside server.js:

js
"Ocp-Apim-Subscription-Key": "YOUR_API_KEY_HERE"
3. Start backend
bash
node server.js
Backend runs at:

Kod
http://localhost:3001
🎨 Frontend Setup
1. Install dependencies
bash
cd frontend
npm install
2. Start frontend
bash
npm run dev
Frontend runs at:

Kod
http://localhost:8080
🔌 How the API Works
The backend fetches:

Kod
/v2/{airport}/arrivals/{date}
/v2/{airport}/departures/{date}
Example:

Kod
http://localhost:3001/flights?airport=ARN
Backend returns:

json
{
  "arrivals": { ... },
  "departures": { ... }
}
The frontend merges both lists and displays them.

🛠️ Technologies Used
Backend
Node.js

Express.js

Axios

Frontend
React

Vite

TypeScript

Tailwind CSS (optional)

🧪 Testing
Tested multiple airports

Verified correct API responses

Debugged normalization

Ensured UI works on different screen sizes

📚 What I Learned
API integration with external services

Building a backend proxy

Normalizing inconsistent data

Structuring a React project

Debugging API errors

Using Git + GitHub for version control

🚀 Future Improvements
Deployment online (Railway + Vercel)

Airline logos

Gate change alerts

Historical flight data

Caching for faster performance

👤 Author
Gazmend Makolli  
Sweden, 2026