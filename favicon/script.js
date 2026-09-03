// === CONFIG ===
const API = {
    next: "https://api.jolpi.ca/ergast/f1/current/next.json",
    season: "https://api.jolpi.ca/ergast/f1/current.json",
    flag: "https://raw.githubusercontent.com/adm410/Sports-Flags/main/track.json",
    drivers: (year) => `https://api.jolpi.ca/ergast/f1/${year}/driverstandings.json`,
    constructors: (year) => `https://api.jolpi.ca/ergast/f1/${year}/constructorstandings.json`,
    schedule: (year) => `https://api.jolpi.ca/ergast/f1/${year}.json`,
};

// === DOM Elements ===
const els = {
    yearPicker: () => document.getElementById("yearPicker"),
    calIcon: () => document.getElementById("calIcon"),
    raceNameBtn: () => document.getElementById("race-details-name"),
    raceDetails: () => document.getElementById("race-details"),
    raceTrack: () => document.getElementById("race-details-track"),
    raceVenue: () => document.getElementById("race-details-venue"),
    raceRound: () => document.getElementById("race-round"),
    trackLaps: () => document.getElementById("track-laps"),
    trackLength: () => document.getElementById("track-length"),
    trackDistance: () => document.getElementById("track-distance"),
    driverYear: () => document.getElementById("driver-year"),
    driverTotal: () => document.getElementById("driver-total"),
    driverTbody: () => document.querySelector("#driver-table tbody"),
    driverError: () => document.getElementById("driverError"),
    constructorYear: () => document.getElementById("constructor-year"),
    constructorTotal: () => document.getElementById("constructor-total"),
    constructorTbody: () => document.querySelector("#constructor-table tbody"),
    constructorError: () => document.getElementById("constructorError"),
    calendarYear: () => document.getElementById("calendar-year"),
    calendarTotal: () => document.getElementById("calendar-total"),
    calendarTbody: () => document.querySelector("#calendar-table tbody"),
    calendarError: () => document.getElementById("calendarError"),
};

// === UTILS ===
const LOCALE = "en-IN";
let currentYear = new Date().getFullYear();
let copyData = {};

const formatDate = (dateStr, timeStr, fallback = "Not Available") => {
    if (!dateStr) return fallback;
    const date = new Date(`${dateStr}T${timeStr || "00:00:00"}`);
    const opts = {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
        hour: "numeric", minute: "numeric", hour12: true,
    };
    return date.toLocaleString(LOCALE, opts).replace(/,/g, "");
};

const showLoading = (tbody, colSpan = 6) => {
    const table = tbody.closest("table");
    table?.setAttribute("aria-busy", "true");
    tbody.innerHTML = `
        <tr class="table-loading-row">
            <td colspan="${colSpan}">
                <div class="table-loading-spinner">
                    <i class="ti ti-loader-2"></i>
                </div>
            </td>
        </tr>
    `;
};

const hideLoading = (table) => {
    table?.removeAttribute("aria-busy");
};

const showError = (el, msg) => { el.style.display = "block"; el.textContent = msg; };
const hideError = (el) => { el.style.display = "none"; };

const fetchJSON = async (url) => {
    const jolpiUrl = url.includes("ergast.com") ? url.replace("ergast.com", "api.jolpi.ca/ergast") : url;
    const res = await fetch(jolpiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${jolpiUrl}`);
    return await res.json();
};

// === NEXT RACE VISIBILITY ===
function toggleNextRaceVisibility(year) {
    const nextSection = document.getElementById("next");
    const nextMenuSection = document.getElementById("raceBtn");
    const nextMenuMobileSection = document.getElementById("raceBtnMobile");
    nextSection.style.display = year === currentYear ? "block" : "none";
    nextMenuSection.style.display = year === currentYear ? "block" : "none";
    nextMenuMobileSection.style.display = year === currentYear ? "block" : "none";
}

// === COPY TEXT ===
async function copyText() {
    const raceNameBtn = els.raceNameBtn();
    const originalHTML = raceNameBtn.innerHTML;
    const text = `${copyData.raceName}\n\n${copyData.p1}\n${copyData.p2}\n\n${copyData.p3}\n${copyData.quali}\n\n${copyData.race}`;

    try {
        await navigator.clipboard.writeText(text);
        raceNameBtn.innerHTML = `<span class="name-full" style="display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;"><i class="ti ti-circle-check-filled" style="color:var(--success);margin-right:6px;"></i> Copied</span>`;
        raceNameBtn.style.color = "var(--success)";
        raceNameBtn.style.fontWeight = "600";
        setTimeout(() => {
            raceNameBtn.innerHTML = originalHTML;
            raceNameBtn.style.color = "";
            raceNameBtn.style.fontWeight = "";
        }, 2500);
    } catch {
        raceNameBtn.innerHTML = `<span class="name-full" style="display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;"><i class="ti ti-x" style="color:var(--accent);margin-right:6px;"></i> Failed</span>`;
        raceNameBtn.style.color = "var(--accent)";
        setTimeout(() => { raceNameBtn.innerHTML = originalHTML; raceNameBtn.style.color = ""; }, 2500);
    }
}

// === NEXT RACE ===
async function loadNextRace() {
    try {
        const [nextData, seasonData, flagData] = await Promise.all([
            fetchJSON(API.next),
            fetchJSON(API.season),
            fetchJSON(API.flag)
        ]);

        const race = nextData.MRData.RaceTable.Races[0];
        const now = Date.now();

        const flagIcon = `<i class="ti ti-flag-2-filled" style="color: var(--accent);margin-right:6px;"></i>`;
        const getTime = (session) => new Date(`${session?.date || race.date}T${session?.time || race.time || "00:00:00Z"}`).getTime();

        const events = [
            { label: "Practice 1:", date: race.FirstPractice },
            { label: race.Sprint ? "Sprint Qualifying:" : "Practice 2:", date: race.SprintQualifying || race.SecondPractice },
            { label: race.Sprint ? "Sprint Race:" : "Practice 3:", date: race.Sprint || race.ThirdPractice },
            { label: "Qualifying:", date: race.Qualifying },
            { label: "Race:", date: { date: race.date, time: race.time } },
        ];

        const raceStarted = getTime(events[4].date) < now;

        const scheduleHTML = events.map((e, i) => {
            const dt = formatDate(e.date?.date, e.date?.time);
            const isFinished = getTime(e.date) < now;
            const showFlagHere = raceStarted ? false : isFinished;
            let wrapperClass = "pb-4";
            if (i === 2) wrapperClass = "pt-5 pb-4";
            if (i === 4) wrapperClass = "pt-5 pb-0";
            return `<div class="${wrapperClass}"><div class="schedule-label">${showFlagHere ? flagIcon : ""}${e.label}</div>   <div class="schedule-date">${dt}</div></div>`;
        }).join("");

        copyData = {
            raceName: race.raceName,
            p1: `${events[0].label} ${formatDate(events[0].date?.date, events[0].date?.time)}`,
            p2: `${events[1].label} ${formatDate(events[1].date?.date, events[1].date?.time)}`,
            p3: `${events[2].label} ${formatDate(events[2].date?.date, events[2].date?.time)}`,
            quali: `${events[3].label} ${formatDate(events[3].date?.date, events[3].date?.time)}`,
            race: `${events[4].label} ${formatDate(race.date, race.time)}`,
        };

        document.getElementById("document-name").textContent = `Next: ${race.Circuit.Location.country} ${nextData.MRData.RaceTable.season}`;
        els.raceNameBtn().innerHTML = `${raceStarted ? flagIcon : ""} ${race.raceName}`;
        els.raceTrack().textContent = race.Circuit.circuitName;
        els.raceVenue().textContent = `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`;
        els.raceDetails().innerHTML = `<div style="margin:auto;width:fit-content;text-align:justify">${scheduleHTML}</div>`;
        els.raceRound().textContent = `Round ${nextData.MRData.RaceTable.round}`;

        const track = flagData.Data.track.find(t => t.name === race.Circuit.circuitName);
        if (track) {
            els.raceNameBtn().innerHTML += ` <span style="margin-left:3px;">${track.flag}</span>`;
            els.trackLaps().textContent = track.laps;
            els.trackLength().textContent = `${track.length}Km`;
            els.trackDistance().textContent = `${track.distance}Km`;
        } else {
            document.getElementById("trackData").innerHTML = `<p class='errorTxt'>Track data not found.</p>`;
        }
    } catch (err) {
        console.error("Next race load failed:", err);
        els.raceNameBtn().innerHTML = `<p class='errorTxt'>Failed to load race data.</p>`;
    }
}

// === STANDINGS & CALENDAR ===
async function loadStandings(type, year) {
    const isDriver = type === "driver";
    const url = isDriver ? API.drivers(year) : API.constructors(year);
    const tbody = isDriver ? els.driverTbody() : els.constructorTbody();
    const yearEl = isDriver ? els.driverYear() : els.constructorYear();
    const totalEl = isDriver ? els.driverTotal() : els.constructorTotal();
    const errorEl = isDriver ? els.driverError() : els.constructorError();

    const colSpan = isDriver ? 7 : 5;
    showLoading(tbody, colSpan);
    hideError(errorEl);

    try {
        const data = await fetchJSON(url);
        const list = data.MRData.StandingsTable.StandingsLists[0];
        const items = isDriver ? list.DriverStandings : list.ConstructorStandings;

        tbody.innerHTML = "";
        const frag = document.createDocumentFragment();

        const isCurrentSeason = year === currentYear;
        const isPastSeason = year < currentYear;

        items.forEach((item, i) => {
            const row = document.createElement("tr");

            let diff = "";
            if (i > 0) {
                const prev = parseFloat(items[i - 1].points);
                const cur = parseFloat(item.points);
                const gap = prev - cur;
                diff = Number.isInteger(gap) ? gap : gap.toFixed(1);
                diff = `-${diff}`;
            }

            const pointsCell = `<td>${item.points}<span class="mobile-only">${diff ? ` (${diff})` : ""}</span></td><td class="desktop-only">${diff || "-"}</td>`;

            if (isDriver) {
                const name = `${item.Driver.givenName} ${item.Driver.familyName}`;
                const short = `${item.Driver.givenName[0]}. ${item.Driver.familyName}`;
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td class="desktop-only">${name}</td>
                    <td class="mobile-only">${short}</td>
                    <td class="desktop-only">${item.Driver.nationality}</td>
                    <td>${item.Constructors.map(c => c.name).join(", ")}</td>
                    ${pointsCell}`;
            } else {
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${item.Constructor.name}</td>
                    <td class="desktop-only">${item.Constructor.nationality}</td>
                    ${pointsCell}`;
            }
            frag.appendChild(row);
        });

        tbody.appendChild(frag);
        hideLoading(tbody.closest("table"));

        yearEl.textContent = `${year} ${isDriver ? "Drivers" : "Constructors"} Standings`;
        totalEl.textContent = `${items.length} ${isDriver ? "Drivers" : "Teams"}`;
    } catch (err) {
        if (year > 1950) loadStandings(type, year - 1);
        else { hideLoading(tbody.closest("table")); showError(errorEl, `Failed to load ${year} data.`); }
    }
}

async function loadCalendar(year) {
    const tbody = els.calendarTbody();
    const yearEl = els.calendarYear();
    const totalEl = els.calendarTotal();
    const errorEl = els.calendarError();

    showLoading(tbody, 5);
    hideError(errorEl);

    try {
        const [data, nextData] = await Promise.all([fetchJSON(API.schedule(year)), fetchJSON(API.next)]);
        const races = data.MRData.RaceTable.Races;
        const currentRound = nextData.MRData.RaceTable.round;
        const isCurrentYear = year === currentYear;
        const dateOpts = { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "numeric", hour12: true, year: "numeric" };
        const mobileDateOpts = { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "numeric", hour12: true };

        tbody.innerHTML = "";
        const frag = document.createDocumentFragment();

        races.forEach(race => {
            const row = document.createElement("tr");
            const desktopDate = new Date(`${race.date}T${race.time || "00:00:00"}`).toLocaleString(LOCALE, race.time ? dateOpts : { weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(/,/g, "");
            const mobileDate = new Date(`${race.date}T${race.time || "00:00:00"}`).toLocaleString(LOCALE, race.time ? mobileDateOpts : { weekday: "short", day: "numeric", month: "short" }).replace(/,/g, "");

            row.innerHTML = `<td>${race.round}</td><td>${race.raceName}</td><td class="desktop-only">${race.Circuit.circuitName}</td><td class="desktop-only">${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</td><td><span class="desktop-only">${desktopDate}</span><span class="mobile-only">${mobileDate}</span></td>`;

            if (isCurrentYear && race.round == currentRound) {
                row.classList.add("current-race");
            }
            frag.appendChild(row);
        });

        tbody.appendChild(frag);
        hideLoading(tbody.closest("table"));
        yearEl.textContent = `${year} Race Calendar`;
        totalEl.textContent = `${races.length} Races`;
    } catch (err) {
        hideLoading(tbody.closest("table"));
        showError(errorEl, `Error loading calendar for ${year}.`);
    }
}

// === YEAR PICKER ===
function initYearPicker() {
    const select = els.yearPicker();
    const icon = els.calIcon();

    const frag = document.createDocumentFragment();
    for (let y = 1950; y <= currentYear; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        frag.appendChild(opt);
    }
    select.appendChild(frag);
    select.value = currentYear;

    select.addEventListener('change', () => {
        const year = parseInt(select.value, 10);
        window.scrollTo({ top: 0, behavior: "smooth" });
        updateAllTables(year);
        toggleNextRaceVisibility(year);
        setCalIconVisibility(year !== currentYear);
    });

    icon.style.opacity = '0';
    icon.style.pointerEvents = 'none';
}

function setCalIconVisibility(show) {
    const icon = els.calIcon();
    icon.style.opacity = show ? '1' : '0';
    icon.style.pointerEvents = show ? 'all' : 'none';
    icon.onclick = show ? () => {
        els.yearPicker().value = currentYear;
        window.scrollTo({ top: 0, behavior: "smooth" });
        updateAllTables(currentYear);
        toggleNextRaceVisibility(currentYear);
        setCalIconVisibility(false);
    } : null;
}

function updateAllTables(year) {
    loadStandings("driver", year);
    loadStandings("constructor", year);
    loadCalendar(year);
}

function initScroll() {
    const headerEle = document.getElementById("header");

    const updateHeader = () => {
        if (window.scrollY > 25) {
            headerEle.classList.add("scrolled");
        } else {
            headerEle.classList.remove("scrolled");
        }
    };

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    });
    updateHeader();
}

// === INIT ===
document.addEventListener("DOMContentLoaded", () => {
    loadNextRace();
    updateAllTables(currentYear);
    initYearPicker();
    initScroll();
    toggleNextRaceVisibility(currentYear);

    document.getElementById("footerBtn").onclick = () => {
        window.open("https://github.com/adm410/Formula-Dashboard", "_blank");
    };
});