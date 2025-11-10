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
    copyBadge: () => document.getElementById("copyTxt"),
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

const formatDate = (dateStr, timeStr, fallback = "Not Available") => {
    if (!dateStr) return fallback;
    const date = new Date(`${dateStr}T${timeStr || "00:00:00"}`);
    const opts = {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
        hour: "numeric", minute: "numeric", hour12: true,
    };
    return date.toLocaleString(LOCALE, opts);
};

const showLoading = (tbody, colSpan = 6) => {
    const table = tbody.closest("table");
    table.setAttribute("aria-busy", "true");
    tbody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align:center; padding:20px;">
        <i class="ti ti-loader-2"></i>
    </td></tr>`;
};

const hideLoading = (table) => table?.removeAttribute("aria-busy");

const showError = (el, msg) => { el.style.display = "block"; el.textContent = msg; };
const hideError = (el) => { el.style.display = "none"; };

// === FETCH WITH FALLBACK ===
const fetchJSON = async (url) => {
    const jolpiUrl = url.includes("ergast.com")
        ? url.replace("ergast.com", "api.jolpi.ca/ergast")
        : url;

    const res = await fetch(jolpiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${jolpiUrl}`);
    return await res.json();
};

// === COPY TEXT (Updated: Replaces race name button) ===
async function copyText() {
    const raceNameBtn = els.raceNameBtn();
    const originalHTML = raceNameBtn.innerHTML; // Save original

    const text = `${copyData.raceName}\n\n${copyData.p1}\n${copyData.p2}\n\n${copyData.p3}\n${copyData.quali}\n\n${copyData.race}`;

    try {
        await navigator.clipboard.writeText(text);
        showCopySuccess();
    } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (success) {
            showCopySuccess();
        } else {
            showCopyFail();
        }
    }

    function showCopySuccess() {
        raceNameBtn.innerHTML = `<i class="ti ti-circle-check-filled" style="color:var(--green);margin-right:6px;"></i> Copied!`;
        raceNameBtn.style.color = "var(--green)";
        raceNameBtn.style.fontWeight = "600";
        setTimeout(() => {
            raceNameBtn.innerHTML = originalHTML;
            raceNameBtn.style.color = "";
            raceNameBtn.style.fontWeight = "";
        }, 2500);
    }

    function showCopyFail() {
        raceNameBtn.innerHTML = `<i class="ti ti-x" style="color:var(--red);margin-right:6px;"></i> Failed`;
        raceNameBtn.style.color = "var(--red)";
        setTimeout(() => {
            raceNameBtn.innerHTML = originalHTML;
            raceNameBtn.style.color = "";
        }, 2500);
    }
}

// === NEXT RACE ===
// === NEXT RACE ===
async function loadNextRace() {
    try {
        const [nextData, seasonData, flagData] = await Promise.all([
            fetchJSON(API.next), fetchJSON(API.season), fetchJSON(API.flag)
        ]);

        const race = nextData.MRData.RaceTable.Races[0];
        const now = new Date();
        const isPast = (dt) => now > new Date(dt);
        const flagIcon = `<i class="ti ti-flag-2-filled" style="color: var(--red);"></i>`;

        const events = [
            { label: "Practice 1:", date: race.FirstPractice },
            { label: race.SprintQualifying ? "Sprint Qualifying:" : "Practice 2:", date: race.SprintQualifying || race.SecondPractice },
            { label: race.Sprint ? "Sprint Race:" : "Practice 3:", date: race.Sprint || race.ThirdPractice },
            { label: "Qualifying:", date: race.Qualifying },
            { label: "Race:", date: { date: race.date, time: race.time } },
        ];

        const scheduleHTML = events.map((e, i) => {
            const dt = formatDate(e.date?.date, e.date?.time);
            const isOld = i === 0 && isPast(dt) && !isPast(formatDate(race.date, race.time));
            const labelClass = "schedule-label";
            const dateClass = "schedule-date";

            let wrapperClass = "pb-4";
            if (i === 2) wrapperClass = "pt-5 pb-4";
            if (i === 4) wrapperClass = "pt-5 pb-0";

            return `<div class="${wrapperClass}">
                <div class="${labelClass}">${isOld ? flagIcon : ""} ${e.label}</div>
                <div class="${dateClass}">${dt}</div>
            </div>`;
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
        els.raceNameBtn().innerHTML = `${isPast(formatDate(race.date, race.time)) ? flagIcon : ""} ${race.raceName}`;
        els.raceTrack().textContent = race.Circuit.circuitName;
        els.raceVenue().textContent = `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`;
        els.raceDetails().innerHTML = `<div style="margin:auto;width:fit-content;text-align:justify">${scheduleHTML}</div>`;
        els.raceRound().textContent = `Round ${nextData.MRData.RaceTable.round}`;
        els.seasonRound().textContent = `of ${seasonData.MRData.total}`;

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

    const isMobile = window.innerWidth <= 768;
    const colSpan = isMobile ? (isDriver ? 2 : 2) : (isDriver ? 7 : 5);
    showLoading(tbody, colSpan);
    hideError(errorEl);

    try {
        const data = await fetchJSON(url);
        const list = data.MRData.StandingsTable.StandingsLists[0];
        const items = isDriver ? list.DriverStandings : list.ConstructorStandings;

        tbody.innerHTML = "";
        const frag = document.createDocumentFragment();

        items.forEach((item, i) => {
            const row = document.createElement("tr");

            // Points difference
            let diff = "";
            if (i > 0) {
                const prev = parseFloat(items[i - 1].points);
                const cur = parseFloat(item.points);
                const gap = prev - cur;
                diff = Number.isInteger(gap) ? gap : gap.toFixed(1);
                diff = `-${diff}`;
            }

            const pointsCell = isMobile
                ? `<td>${item.points}${diff ? ` (${diff})` : ""}</td>`
                : `<td>${item.points}</td><td class="delta">${diff || "-"}</td>`;

            if (isDriver) {
                const name = `${item.Driver.givenName} ${item.Driver.familyName}`;
                const short = `${item.Driver.givenName[0]}. ${item.Driver.familyName}`;
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${name}</td>
                    <td class="desktop-only">${short}</td>
                    <td class="desktop-only">${item.Driver.nationality}</td>
                    <td class="desktop-only">${item.Constructors.map(c => c.name).join(", ")}</td>
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
    1;
    hideError(errorEl);

    try {
        const [data, nextData] = await Promise.all([fetchJSON(API.schedule(year)), fetchJSON(API.next)]);
        const races = data.MRData.RaceTable.Races;
        const currentRound = nextData.MRData.RaceTable.round;
        const isCurrentYear = year === currentYear;
        const wide = window.innerWidth > 786;

        const dateOpts = { weekday: wide ? "long" : "short", day: "numeric", month: wide ? "long" : "short", hour: "numeric", minute: "numeric", hour12: true, ...(wide && { year: "numeric" }) };

        tbody.innerHTML = "";
        const frag = document.createDocumentFragment();

        races.forEach(race => {
            const row = document.createElement("tr");
            const date = new Date(`${race.date}T${race.time || "00:00:00"}`).toLocaleString(LOCALE, race.time ? dateOpts : { weekday: "long", day: "numeric", month: "long", year: "numeric" });
            row.innerHTML = `<td>${race.round}</td><td>${race.raceName}</td><td>${race.Circuit.circuitName}</td><td>${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</td><td>${date}</td>`;

            if (isCurrentYear && race.round == currentRound) {
                [...row.cells].forEach(cell => {
                    cell.style.backgroundColor = "var(--red)";
                    cell.style.color = "var(--white)";
                    cell.style.fontWeight = "500";
                    const r = wide ? "11px" : "6px";
                    if (cell.cellIndex === 0) { cell.style.borderTopLeftRadius = r; cell.style.borderBottomLeftRadius = r; }
                    if (cell.cellIndex === 4) { cell.style.borderTopRightRadius = r; cell.style.borderBottomRightRadius = r; }
                });
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
let debounceTimer;
function initYearPicker() {
    const picker = els.yearPicker();
    picker.value = currentYear;
    picker.min = 1950;
    picker.max = currentYear;

    picker.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const year = parseInt(picker.value.trim(), 10);
            if (Number.isInteger(year) && year >= 1950 && year <= currentYear) {
                updateAllTables(year);
                setCalIconVisibility(year !== currentYear);
            } else {
                picker.value = currentYear;
                updateAllTables(currentYear);
                setCalIconVisibility(false);
            }
        }, 300);
    });
}

function setCalIconVisibility(show) {
    const icon = els.calIcon();
    icon.style.opacity = show ? "1" : "0";
    icon.style.pointerEvents = show ? "all" : "none";
    icon.onclick = show ? () => {
        els.yearPicker().value = currentYear;
        updateAllTables(currentYear);
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
    const headerTxtEle = document.getElementById("headerTxt");
    const yearPickerEle = document.getElementById("yearPicker");
    const calIconEle = document.getElementById("calIcon");
    const desktopMenuEle = document.getElementById("desktopMenu");
    let lastScrollY = 0;

    const updateHeader = () => {
        const y = window.scrollY;
        const wide = window.innerWidth > 786;

        if (wide) {
            // Desktop
            if (y > 25) {
                headerEle.style.height = "55px";
                headerEle.style.boxShadow = "0 4px 10px 0 rgba(0, 0, 0, 0.2)";
                headerTxtEle.style.margin = "10px 15px 0";
                yearPickerEle.style.margin = "13px 0px";
                calIconEle.style.margin = "13px 5px";
                desktopMenuEle.style.margin = "23px 30px";
            } else {
                headerEle.style.height = "70px";
                headerEle.style.boxShadow = "";
                headerTxtEle.style.margin = "20px 20px 0";
                yearPickerEle.style.margin = "23px 0px";
                calIconEle.style.margin = "22px 5px";
                desktopMenuEle.style.margin = "33px 50px";
            }
        } else {
            // Mobile
            if (y > 25) {
                headerEle.style.height = "70px";
                headerEle.style.boxShadow = "0 4px 10px 0 rgba(0, 0, 0, 0.2)";
                headerTxtEle.style.margin = "0";
                yearPickerEle.style.margin = "8px 0px";
                calIconEle.style.margin = "4px 5px 0";
                desktopMenuEle.style.margin = "13px";
            } else {
                headerEle.style.height = "85px";
                headerEle.style.boxShadow = "";
                headerTxtEle.style.margin = "6px 0";
                yearPickerEle.style.margin = "12px 0px";
                calIconEle.style.margin = "8px 5px 0";
                desktopMenuEle.style.margin = "16px";
            }
        }

        lastScrollY = y;
    };

    // Throttle scroll for performance
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

    // Initial call
    updateHeader();
}

// === INIT ===
document.addEventListener("DOMContentLoaded", () => {
    loadNextRace();
    updateAllTables(currentYear);
    initYearPicker();
    initScroll();

    document.getElementById("footerBtn").onclick = () => {
        window.open("https://github.com/adm410/Formula-Dashboard", "_blank");
    };
});