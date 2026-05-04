# 🏎️ Formula Dashboard

A fast, minimal Formula 1 companion — next race countdowns, live standings, and full season calendars. No frameworks. No build step. Just vanilla JS.


## ✨ Features

| | Feature | Description |
|---|---|---|
| 🏁 | **Next Race** | Full weekend schedule; Practice, Qualifying, Sprint (if applicable), and Race, with times localised to your timezone |
| 📊 | **Driver Standings** | Championship table with points and gap to the driver ahead |
| 🏆 | **Constructor Standings** | Team championship table with points and gap |
| 📅 | **Race Calendar** | Full season schedule with circuit, venue, and date, current round highlighted |
| 🕰️ | **Historical Seasons** | Browse any season from **1950 to present** via the year picker |
| 📋 | **Copy Schedule** | Click the race name to instantly copy the weekend timetable to your clipboard |
| 🌗 | **Dark Mode** | Automatically follows your system colour scheme |
| 📱 | **Fully Responsive** | Dedicated layouts for desktop and mobile, with a compact scrolled header |

---

## 🌐 Data Sources

| Source | Used For |
|---|---|
| [Jolpica Ergast F1 API](https://api.jolpi.ca/ergast/) | Next race info, driver & constructor standings, race calendar |
| `track.json` *(self-hosted)* | Circuit laps, length, race distance, emoji flags, and F1 media images |

> ℹ️ If a standings request fails for the selected year, the app automatically walks back year by year until valid data is found — all the way to 1950.



## 🗃️ track.json

The bundled `track.json` powers the circuit stats card on the Next Race section. It contains three arrays under the top-level `Data` key:

- **`country`** — country name → emoji flag (e.g. `"italy"` → 🇮🇹)
- **`nationality`** — nationality adjective → emoji flag (e.g. `"italian"` → 🇮🇹)
- **`track`** — per-circuit data including:

```jsonc
{
  "name": "Circuit de Monaco",
  "event": "Monaco Grand Prix",
  "flag": "🇲🇨",
  "laps": "78",
  "length": "3.337",     // km
  "distance": "260.286", // km
}
```

If a circuit name returned by the API doesn't match an entry in `track.json`, the stats section gracefully shows a *"Track data not found"* message.

---

## 🛠️ Built With

- **HTML5 / CSS3 / Vanilla JavaScript** — no frameworks, no bundlers
- **[Tabler Icons](https://tabler.io/icons)** — icon webfont
- **[Poppins](https://fonts.google.com/specimen/Poppins) & [Noto Sans Mono](https://fonts.google.com/specimen/Noto+Sans+Mono)** — Google Fonts
- **[Jolpica Ergast API](https://api.jolpi.ca/ergast/)** — F1 data

---

## 👤 Author

**Aditya More** — [github.com/adm410](https://github.com/adm410)

---

*Not affiliated with Formula 1, FIA, or any F1 team. All F1 data is sourced from the open Ergast API.*
