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
    seasonRound: () => document.getElementById("season-round"),
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
let defaultDocumentName = 'Formula Dashboard';

const formatDate = (dateStr, timeStr, fallback = "Not Available") => {
    if (!dateStr) return fallback;
    const date = new Date(`${dateStr}T${timeStr || "00:00:00"}`);
    const opts = {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
        hour: "numeric", minute: "numeric", hour12: true,
    };
    return date.toLocaleString(LOCALE, opts);
};

const formatRelativeDate = (dateStr, timeStr, fallback = "Not Available") => {
    if (!dateStr) return fallback;
    const hasTime = Boolean(timeStr);
    const target = new Date(`${dateStr}T${timeStr || "00:00:00"}`);
    if (isNaN(target.getTime())) return fallback;

    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const isFuture = diffMs > 0;
    const absDiffMs = Math.abs(diffMs);
    const diffMin = Math.round(absDiffMs / (1000 * 60));
    const diffHours = Math.round(absDiffMs / (1000 * 60 * 60));

    const timeFormatted = hasTime
        ? target.toLocaleTimeString(LOCALE, {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).replace(/,/g, "")
        : "";

    const midnightNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const midnightTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const calDaysDiff = Math.round((midnightTarget.getTime() - midnightNow.getTime()) / (1000 * 60 * 60 * 24));
    const absDays = Math.abs(calDaysDiff);

    let res = "";
    if (isFuture) {
        if (hasTime && diffMin < 1) res = "Starting now";
        else if (hasTime && diffMin < 60) res = diffMin === 1 ? "in 1 min" : `in ${diffMin} mins`;
        else if (hasTime && diffHours < 24 && calDaysDiff === 0) res = diffHours === 1 ? "in 1 hour" : `in ${diffHours} hours`;
        else if (calDaysDiff === 0) res = hasTime ? `Today at ${timeFormatted}` : "Today";
        else if (calDaysDiff === 1) res = hasTime ? `Tomorrow at ${timeFormatted}` : "Tomorrow";
        else if (calDaysDiff >= 2 && calDaysDiff < 7) res = hasTime ? `in ${calDaysDiff} days at ${timeFormatted}` : `in ${calDaysDiff} days`;
        else if (calDaysDiff >= 7 && calDaysDiff < 30) {
            const weeks = Math.max(1, Math.round(calDaysDiff / 7));
            res = weeks === 1 ? "in 1 week" : `in ${weeks} weeks`;
        } else if (calDaysDiff >= 30 && calDaysDiff < 365) {
            const months = Math.max(1, Math.round(calDaysDiff / 30.44));
            res = months === 1 ? "in 1 month" : `in ${months} months`;
        } else {
            const years = Math.max(1, Math.round(calDaysDiff / 365.25));
            res = years === 1 ? "in 1 year" : `in ${years} years`;
        }
    } else {
        if (hasTime && diffMin < 1) res = "Just now";
        else if (hasTime && diffMin < 60) res = diffMin === 1 ? "1 min ago" : `${diffMin} mins ago`;
        else if (hasTime && diffHours < 24 && calDaysDiff === 0) res = diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
        else if (calDaysDiff === 0) res = hasTime ? `Today ${timeFormatted}` : "Today";
        else if (calDaysDiff === -1) res = hasTime ? `Yesterday ${timeFormatted}` : "Yesterday";
        else if (absDays >= 2 && absDays < 7) res = absDays === 1 ? "1 day ago" : `${absDays} days ago`;
        else if (absDays >= 7 && absDays < 30) {
            const weeks = Math.max(1, Math.round(absDays / 7));
            res = weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
        } else if (absDays >= 30 && absDays < 365) {
            const months = Math.max(1, Math.round(absDays / 30.44));
            res = months === 1 ? "a month ago" : `${months} months ago`;
        } else {
            const years = Math.max(1, Math.round(absDays / 365.25));
            res = years === 1 ? "a year ago" : `${years} years ago`;
        }
    }
    return res.replace(/,/g, "");
};

const showLoading = (tbody, colSpan = 6) => {
    const table = tbody.closest("table");
    table.setAttribute("aria-busy", "true");
    tbody.innerHTML = `<tr><td colspan="${colSpan}" style="padding:0;border:none;"></td></tr>`;
    const container = table.closest("div[id]");
    container.querySelector(".table-loader")?.remove();
    const loader = document.createElement("div");
    loader.className = "table-loader";
    loader.innerHTML = `<i class="ti ti-loader-2"></i>`;
    container.style.position = "relative";
    container.appendChild(loader);
};

const hideLoading = (table) => {
    table?.removeAttribute("aria-busy");
    const container = table?.closest("div[id]");
    container?.querySelector(".table-loader")?.remove();
};

const showError = (el, msg) => { el.style.display = "block"; el.textContent = msg; };
const hideError = (el) => { el.style.display = "none"; };

const apiCache = {};
const fetchJSON = async (url) => {
    if (apiCache[url]) return apiCache[url];
    const jolpiUrl = url.includes("ergast.com") ? url.replace("ergast.com", "api.jolpi.ca/ergast") : url;
    const res = await fetch(jolpiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${jolpiUrl}`);
    const data = await res.json();
    apiCache[url] = data;
    return data;
};

// === GAP MODE ===
let gapMode = 'adjacent'; // 'adjacent' or 'leader'

window.toggleGapMode = function () {
    gapMode = gapMode === 'adjacent' ? 'leader' : 'adjacent';
    const year = parseInt(els.yearPicker().value, 10) || currentYear;

    const fadingElements = document.querySelectorAll('.gap-text, .points-text, #driver-table tbody, #constructor-table tbody');
    fadingElements.forEach(el => el.style.opacity = '0');

    setTimeout(async () => {
        document.querySelectorAll('.gap-text').forEach(el => {
            el.textContent = gapMode === 'adjacent' ? 'Interval' : 'Delta';
        });

        document.querySelectorAll('.points-text').forEach(el => {
            el.textContent = gapMode === 'adjacent' ? 'Points' : 'Delta';
        });

        await Promise.all([
            loadStandings("driver", year),
            loadStandings("constructor", year)
        ]);

        fadingElements.forEach(el => el.style.opacity = '1');
    }, 200);
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
    if (raceNameBtn.classList.contains("past-race")) return;
    const originalHTML = raceNameBtn.innerHTML;
    const text = `${copyData.raceName}\n\n${copyData.p1}\n${copyData.p2}\n\n${copyData.p3}\n${copyData.quali}\n\n${copyData.race}`;

    try {
        await navigator.clipboard.writeText(text);
        raceNameBtn.innerHTML = `<i class="ti ti-circle-check-filled" style="color:var(--success);margin-right:6px;"></i> Copied!`;
        raceNameBtn.style.color = "var(--success)";
        raceNameBtn.style.fontWeight = "600";
        setTimeout(() => {
            raceNameBtn.innerHTML = originalHTML;
            raceNameBtn.style.color = "";
            raceNameBtn.style.fontWeight = "";
        }, 2500);
    } catch {
        raceNameBtn.innerHTML = `<i class="ti ti-x" style="color:var(--accent);margin-right:6px;"></i> Failed`;
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
        const stopwatchIcon = `<i class="ti ti-stopwatch" style="color: var(--accent);margin-right:6px;"></i>`;
        const getTime = (session) => new Date(`${session?.date || race.date}T${session?.time || race.time || "00:00:00Z"}`).getTime();

        const events = [
            { label: "Practice 1:", date: race.FirstPractice, durationMs: 60 * 60 * 1000 },
            { label: race.Sprint ? "Sprint Qualifying:" : "Practice 2:", date: race.SprintQualifying || race.SecondPractice, durationMs: race.Sprint ? 45 * 60 * 1000 : 60 * 60 * 1000 },
            { label: race.Sprint ? "Sprint Race:" : "Practice 3:", date: race.Sprint || race.ThirdPractice, durationMs: 60 * 60 * 1000 },
            { label: "Qualifying:", date: race.Qualifying, durationMs: 60 * 60 * 1000 },
            { label: "Race:", date: { date: race.date, time: race.time }, durationMs: 120 * 60 * 1000 },
        ];

        const mainRaceStart = getTime(events[4].date);
        const mainRaceEnd = mainRaceStart + events[4].durationMs;
        const mainRaceActive = now >= mainRaceStart && now < mainRaceEnd;
        const mainRaceFinished = now >= mainRaceEnd;
        const isPastOrActiveRace = now >= mainRaceStart;

        const scheduleHTML = events.map((e, i) => {
            const dt = formatDate(e.date?.date, e.date?.time);
            const relDt = formatRelativeDate(e.date?.date, e.date?.time);
            const startTime = getTime(e.date);
            const endTime = startTime + e.durationMs;

            let statusIcon = "";
            if (now >= endTime) {
                statusIcon = mainRaceFinished ? "" : flagIcon;
            } else if (now >= startTime) {
                statusIcon = stopwatchIcon;
            }

            let wrapperClass = "pb-4";
            if (i === 2) wrapperClass = "pt-5 pb-4";
            if (i === 4) wrapperClass = "pt-5 pb-0";
            return `<div class="schedule-row ${wrapperClass}"><div class="schedule-label">${statusIcon}${e.label}</div>   <div class="schedule-date" title="${relDt}"><span class="date-full">${dt}</span><span class="date-relative">${relDt}</span></div></div>`;
        }).join("");

        copyData = {
            raceName: race.raceName,
            p1: `${events[0].label} ${formatDate(events[0].date?.date, events[0].date?.time)}`,
            p2: `${events[1].label} ${formatDate(events[1].date?.date, events[1].date?.time)}`,
            p3: `${events[2].label} ${formatDate(events[2].date?.date, events[2].date?.time)}`,
            quali: `${events[3].label} ${formatDate(events[3].date?.date, events[3].date?.time)}`,
            race: `${events[4].label} ${formatDate(race.date, race.time)}`,
        };

        defaultDocumentName = `Next Race: ${race.Circuit.Location.country}`;
        if (parseInt(els.yearPicker().value, 10) === currentYear) {
            document.getElementById("document-name").textContent = defaultDocumentName;
        }

        const track = flagData.Data.track.find(t => t.name === race.Circuit.circuitName);
        const flagSpan = track ? ` <span style="margin-left:3px;">${track.flag}</span>` : "";
        const raceRelTime = formatRelativeDate(race.date, race.time);

        let mainRaceIcon = "";
        if (mainRaceFinished) {
            mainRaceIcon = flagIcon;
        } else if (mainRaceActive) {
            mainRaceIcon = stopwatchIcon;
        }

        if (isPastOrActiveRace) {
            els.raceNameBtn().classList.add("past-race");
            els.raceNameBtn().innerHTML = `<span class="name-full">${mainRaceIcon}${race.raceName}${flagSpan}</span><span class="name-relative">${mainRaceIcon}${raceRelTime}${flagSpan}</span>`;
        } else {
            els.raceNameBtn().classList.remove("past-race");
            els.raceNameBtn().innerHTML = `<span class="name-full">${mainRaceIcon}${race.raceName}${flagSpan}</span>`;
        }

        els.raceTrack().textContent = race.Circuit.circuitName;
        els.raceVenue().textContent = `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`;
        els.raceDetails().innerHTML = `<div class="schedule-container">${scheduleHTML}</div>`;
        els.raceRound().textContent = `Round ${nextData.MRData.RaceTable.round}`;
        els.seasonRound().textContent = `of ${seasonData.MRData.total}`;

        if (track) {
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
                const referencePts = gapMode === 'adjacent' ? parseFloat(items[i - 1].points) : parseFloat(items[0].points);
                const cur = parseFloat(item.points);
                const gap = referencePts - cur;
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
                    <td>${item.Constructor.nationality}</td>
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
            const desktopDate = new Date(`${race.date}T${race.time || "00:00:00"}`).toLocaleString(LOCALE, race.time ? dateOpts : { weekday: "long", day: "numeric", month: "long", year: "numeric" });
            const mobileDate = new Date(`${race.date}T${race.time || "00:00:00"}`).toLocaleString(LOCALE, race.time ? mobileDateOpts : { weekday: "short", day: "numeric", month: "short" });

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
        updateAllTables(year);
        toggleNextRaceVisibility(year);
        setCalIconVisibility(year !== currentYear);
        document.getElementById("document-name").textContent = year === currentYear ? defaultDocumentName : `${year} Results`;
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
        updateAllTables(currentYear);
        toggleNextRaceVisibility(currentYear);
        setCalIconVisibility(false);
        document.getElementById("document-name").textContent = defaultDocumentName;
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

    els.raceDetails()?.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            els.raceDetails()?.classList.toggle("show-relative");
        }
    });

    document.getElementById("footerBtn").onclick = () => {
        window.open("https://github.com/adm410/Formula-Dashboard", "_blank");
    };
});