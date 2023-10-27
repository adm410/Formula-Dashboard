document.addEventListener("DOMContentLoaded", getRaceDetails);
document.addEventListener("DOMContentLoaded", getSeasonDetails);
document.addEventListener("DOMContentLoaded", getTrackDetails);
window.onscroll = function () { scrollFunction() };

const urlSeason = "https://ergast.com/api/f1/current.json"
const urlNext = "https://ergast.com/api/f1/current/next.json"
const urlFlag = "https://raw.githubusercontent.com/adm410/Sports-Flags/main/track.json"
const localeType = "en-IN"

let raceDetailsName;
let p1txt;
let p1dt;
let p2txt;
let p2dt;
let p3txt;
let p3dt;
let qualitxt;
let qualidt;
let racetxt;
let racedt;

function openGitHub() {
    window.open('https://github.com/adm410/Formula-Dashboard', '_blank');
}

function copyText() {
    const raceName = raceDetailsName;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(`${raceName}\n\n${p1txt} ${p1dt}\n${p2txt} ${p2dt}\n\n${p3txt} ${p3dt}\n${qualitxt} ${qualidt}\n\n${racetxt} ${racedt}`)
            .catch((error) => {
                console.error(error);
            });
    }
}

function getRaceDetails() {
    fetch(urlNext)
        .then(response => response.json())
        .then(data => {
            locale = localeType
            const options = {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };
            const race = data.MRData.RaceTable.Races[0];

            const practice1 = race.FirstPractice;
            const p1d = practice1 ? practice1.date : "P1_Date";
            const p1t = practice1 ? practice1.time : "P1_Time";
            const p1Date = new Date(p1d + "T" + p1t);
            p1txt = "Practice 1:"
            p1dt = p1Date.toLocaleString(locale, options);

            const practice2 = race.SecondPractice;
            let p2d = practice2 ? practice2.date : "P2_Date";
            let p2t = practice2 ? practice2.time : "P2_Time";
            const p2Date = new Date(p2d + "T" + p2t);
            p2txt = "Practice 2:"
            p2dt = p2Date.toLocaleString(locale, options);

            const practice3 = race.ThirdPractice;
            let p3d = practice3 ? practice3.date : "P3_Date";
            let p3t = practice3 ? practice3.time : "P3_Time";
            const p3Date = new Date(p3d + "T" + p3t);
            p3txt = "Practice 3:"
            p3dt = p3Date.toLocaleString(locale, options);

            const sprint = race.Sprint;
            let sd = sprint ? sprint.date : "Sprint_Date";
            let st = sprint ? sprint.time : "Sprint_Time";
            const sDate = new Date(sd + "T" + st);

            const quali = race.Qualifying;
            const qd = quali ? quali.date : "Quali_Date";
            const qt = quali ? quali.time : "Quali_Time";
            const qDate = new Date(qd + "T" + qt);
            qualitxt = "Qualifying:"
            qualidt = qDate.toLocaleString(locale, options);

            const rd = race ? race.date : "Race_Date";
            const rt = race ? race.time : "Race_Time";
            const rDate = new Date(rd + "T" + rt);
            racetxt = "Race:"
            racedt = rDate.toLocaleString(locale, options);

            if (p3d === "P3_Date") {
                p2txt = "Qualifying:"
                p2dt = qDate.toLocaleString(locale, options);

                p3txt = "Sprint Shootout:"
                p3dt = p2Date.toLocaleString(locale, options);

                qualitxt = "Sprint:"
                qualidt = sDate.toLocaleString(locale, options);
            }

            const documentName = `
    Next: ${race.Circuit.Location.locality} ${data.MRData.RaceTable.season}
    `
            raceDetailsName = `${race.raceName}`

            const raceDetailsTrack = `${race.Circuit.circuitName}`
            const raceCountry = `${race.Circuit.Location.locality}, ${race.Circuit.Location.country} `

            const raceRound = `Round ${data.MRData.RaceTable["round"]}`

            const raceDetails = `
    <div style="margin: auto; width:fit-content; text-align: justify;">
    <div>
        <div class="p1txt">${p1txt}</div>
        <div class="p1dt">${p1dt}</div>
    </div>
    <div>
        <div class="p2txt">${p2txt}</div>
        <div class="p2dt pb-4">${p2dt}</div>
    </div>
    <div>
        <div class="p3txt">${p3txt}</div>
        <div class="p3dt">${p3dt}</div>
    </div>
    <div>
        <div class="qualitxt">${qualitxt}</div>
        <div class="qualidt pb-4">${qualidt}</div>
    </div>
    <div>
        <div class="racetxt">${racetxt}</div>
        <div class="racedt">${racedt}</div>
    </div>
    </div>
  `;

            document.getElementById("document-name").innerHTML = documentName;
            document.getElementById("race-details-name").innerHTML = raceDetailsName;
            document.getElementById("race-details-track").innerHTML = raceDetailsTrack;
            document.getElementById("race-details-venue").innerHTML = raceCountry;
            document.getElementById("race-details").innerHTML = raceDetails;
            document.getElementById("race-round").innerHTML = raceRound;
        })
        .catch(error => {
            document.getElementById("race-details-name").innerHTML = `<p class='error-cell'>Error: ${error}</p>`;
        });
}


function getSeasonDetails() {
    fetch(urlSeason)
        .then(response => response.json())
        .then(data => {

            const seasonRound = `
        of ${data.MRData["total"]}
        `
            document.getElementById("season-round").innerHTML = seasonRound;
        })
}


function getTrackDetails() {
    fetch(urlNext)
        .then(response => response.json())
        .then(data => {
            const race = data.MRData.RaceTable.Races[0];
            const raceTrack = race.Circuit.circuitName;

            fetch(urlFlag)
                .then(response => response.json())
                .then(data => {
                    const track = data.Data.track.find(track => track.name === raceTrack);

                    if (track) {
                        const trackLaps = `
                ${track.laps}
              `
                        const trackLength = `
              ${track.length} km
              `
                        const trackDistance = `
              ${track.distance} km
              `
                            ;
                        document.getElementById("track-laps").innerHTML = trackLaps;
                        document.getElementById("track-length").innerHTML = trackLength;
                        document.getElementById("track-distance").innerHTML = trackDistance;
                    } else {
                        document.getElementById("trackData").innerHTML = `<p class='error-cell'>Error: Track Not Found.</p>`;
                    }
                })
                .catch(error => {
                    document.getElementById("trackData").innerHTML = `<p class='error-cell'>Error: ${error}</p>`;
                });
        })
        .catch(error => {
            document.getElementById("trackData").innerHTML = `<p class='error-cell'>Error: ${error}</p>`;
        });
}


function updateDriverTable(year) {
    const driverTable = document.getElementById("driver-table").getElementsByTagName('tbody')[0];
    driverTable.innerHTML = "<tr><td colspan='5' class='loading-cell'><span class='spinner-border' role='status' aria-hidden='true'></span></td></tr>";

    fetch(`https://ergast.com/api/f1/${year}/driverstandings.json`)
        .then(response => response.json())
        .then(data => {
            const drivers = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

            while (driverTable.firstChild) {
                driverTable.removeChild(driverTable.firstChild);
            }

            const driverTotal = `
          ${data.MRData["total"]} Drivers
        `
            document.getElementById("driver-total").innerHTML = driverTotal;
            document.getElementById("driver-year").innerHTML = year + " Drivers Standings";

            drivers.forEach(driver => {
                const position = driver.position;
                const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
                const nationality = driver.Driver.nationality;
                const constructor = driver.Constructors[0].name;
                const points = driver.points;

                const row = driverTable.insertRow();
                const positionCell = row.insertCell(0);
                const driverCell = row.insertCell(1);
                const nationalityCell = row.insertCell(2);
                const constructorCell = row.insertCell(3);
                const pointsCell = row.insertCell(4);

                positionCell.textContent = position;
                driverCell.textContent = driverName;
                nationalityCell.textContent = nationality
                constructorCell.textContent = constructor;
                pointsCell.textContent = points;
            });
        })
        .catch(error => {
            driverTable.innerHTML = `<tr><td colspan='5' class='error-cell'>Error: ${error}</td></tr>`;
        });
}


function updateConstructorTable(year) {
    const constructorTable = document.getElementById("constructor-table").getElementsByTagName('tbody')[0];
    constructorTable.innerHTML = "<tr><td colspan='4' class='loading-cell'><span class='spinner-border spinner-border' role='status' aria-hidden='true'></span></td></tr>";
    fetch(`https://ergast.com/api/f1/${year}/constructorstandings.json`)
        .then(response => response.json())
        .then(data => {
            const constructors = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

            while (constructorTable.firstChild) {
                constructorTable.removeChild(constructorTable.firstChild);
            }

            const constructorTotal = `${constructors.length} Teams`;
            document.getElementById("constructor-total").innerHTML = constructorTotal;
            document.getElementById("constructor-year").innerHTML = year + " Constructors Standings";

            constructors.forEach(constructor => {
                const position = constructor.position;
                const constructorName = constructor.Constructor.name;
                const nationality = constructor.Constructor.nationality;
                const points = constructor.points;

                const row = constructorTable.insertRow();
                const positionCell = row.insertCell(0);
                const constructorCell = row.insertCell(1);
                const nationalityCell = row.insertCell(2);
                const pointsCell = row.insertCell(3);

                positionCell.textContent = position;
                constructorCell.textContent = constructorName;
                nationalityCell.textContent = nationality;
                pointsCell.textContent = points;
            });
        })
        .catch(error => {
            constructorTable.innerHTML = `<tr><td colspan='4' class='error-cell'>Error: ${error}</td></tr>`;
        });
}


function updateCalendarTable(year) {
    const calendarTable = document.getElementById("calendar-table").getElementsByTagName('tbody')[0];
    calendarTable.innerHTML = "<tr><td colspan='4' class='loading-cell'><span class='spinner-border spinner-border' role='status' aria-hidden='true'></span></td></tr>";

    fetch(`https://ergast.com/api/f1/${year}.json`)
        .then(response => response.json())
        .then(data => {
            locale = localeType
            const options = {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };
            const options2 = {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour12: true,
            };

            const races = data.MRData.RaceTable.Races;

            while (calendarTable.firstChild) {
                calendarTable.removeChild(calendarTable.firstChild);
            }

            const calendarTotal = `${races.length} Races`;
            document.getElementById("calendar-total").innerHTML = calendarTotal;
            document.getElementById("calendar-year").innerHTML = year + " Race Calendar";

            races.forEach(race => {
                const round = race.round;
                const raceName = race.raceName;
                const circuitName = `${race.Circuit.circuitName}`;
                const country = `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`;
                const rd = race ? race.date : "Race_Date";
                let rt;
                let format;
                if (year >= 2005) {
                    rt = race ? race.time : "Race_Time";
                    format = options
                } else {
                    rt = "00:00:00Z";
                    format = options2
                }
                const rDate = new Date(rd + "T" + rt);
                let date = rDate.toLocaleString(locale, format);

                const row = calendarTable.insertRow();
                const roundCell = row.insertCell(0);
                const raceCell = row.insertCell(1);
                const countryCell = row.insertCell(2);
                const dateCell = row.insertCell(3);

                roundCell.textContent = round;
                raceCell.textContent = raceName;
                countryCell.textContent = country;
                dateCell.textContent = date;


                fetch(urlNext)
                    .then(response => response.json())
                    .then(data => {
                        const roundNum = `${data.MRData.RaceTable.round}`;

                        if (round === roundNum && new Date().getFullYear() === year) {
                            roundCell.style.backgroundColor = "var(--red)";
                            roundCell.style.color = "var(--white)";
                            roundCell.style.fontWeight = "500";
                            raceCell.style.backgroundColor = "var(--red)";
                            raceCell.style.color = "var(--white)";
                            raceCell.style.fontWeight = "500";
                            countryCell.style.backgroundColor = "var(--red)";
                            countryCell.style.color = "var(--white)";
                            countryCell.style.fontWeight = "500";
                            dateCell.style.backgroundColor = "var(--red)";
                            dateCell.style.color = "var(--white)";
                            dateCell.style.fontWeight = "500";
                            roundCell.style.borderTopLeftRadius = "10px";
                            roundCell.style.borderBottomLeftRadius = "10px";
                            dateCell.style.borderTopRightRadius = "10px";
                            dateCell.style.borderBottomRightRadius = "10px";
                        }
                    });

            });
        })
        .catch(error => {
            calendarTable.innerHTML = `<tr><td colspan='4' class='error-cell'>Error: ${error}</td></tr>`;
        });
}


document.addEventListener("DOMContentLoaded", function () {
    const yearPicker = document.getElementById('yearPicker');
    const currentYear = new Date().getFullYear();
    yearPicker.value = currentYear;
    yearPicker.max = currentYear;

    updateDriverTable(currentYear);
    updateConstructorTable(currentYear);
    updateCalendarTable(currentYear);

    yearPicker.addEventListener('input', () => {
        const selectedYear = yearPicker.value;
        if (selectedYear && selectedYear.length == 4) {
            updateDriverTable(selectedYear);
            updateConstructorTable(selectedYear);
            updateCalendarTable(selectedYear);
        }
        if (currentYear != selectedYear) {
            document.getElementById("calIcon").style.opacity = "1";
        } else {
            document.getElementById("calIcon").style.opacity = "0";
        }
    });
});

function updateYear() {
    const yearPicker = document.getElementById('yearPicker');
    const currentYear = new Date().getFullYear();
    yearPicker.value = currentYear;
    yearPicker.max = currentYear;
    document.getElementById("calIcon").style.opacity = "0";
    updateDriverTable(currentYear);
    updateConstructorTable(currentYear);
    updateCalendarTable(currentYear);
}


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    document.getElementById("body").classList.add('dark-mode');
    document.getElementById("headertxt").classList.add('dark-mode');
    document.getElementById("yearPicker").classList.add('dark-mode');
    document.getElementById("next").classList.add('dark-mode');
    document.getElementById("race-details-name").classList.add('dark-mode');
    document.getElementById("race-details-track").classList.add('dark-mode');
    document.getElementById("driver").classList.add('dark-mode');
    document.getElementById("driver-year").classList.add('dark-mode');
    document.getElementById("driver-table").classList.add('dark-mode');
    document.getElementById("constructor").classList.add('dark-mode');
    document.getElementById("constructor-year").classList.add('dark-mode');
    document.getElementById("constructor-table").classList.add('dark-mode');
    document.getElementById("tableFooter").classList.add('dark-mode');
}
window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
    const darkModeOn = e.matches;
    document.body.classList.toggle('dark-mode', darkModeOn);
    document.getElementById("body").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("headertxt").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("yearPicker").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("next").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("race-details-name").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("race-details-track").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("driver").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("driver-year").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("driver-table").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("constructor").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("constructor-year").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("constructor-table").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("calendar").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("calendar-year").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("calendar-table").classList.toggle('dark-mode', darkModeOn);
    document.getElementById("tableFooter").classList.toggle('dark-mode', darkModeOn);
});