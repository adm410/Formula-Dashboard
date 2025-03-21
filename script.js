document.addEventListener("DOMContentLoaded", getRaceDetails);
document.addEventListener("DOMContentLoaded", getSeasonDetails);
document.addEventListener("DOMContentLoaded", getTrackDetails);
window.onscroll = function () { scrollFunction() };

const urlSeason = "https://api.jolpi.ca/ergast/f1/current.json"
const urlNext = "https://api.jolpi.ca/ergast/f1/current/next.json"
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

function copyText() {
    setTimeout(() => {
        document.getElementById("race-details-name").style.display = "none";
        document.getElementById("copyTxt").style.display = "block";
    }, 100);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(`${raceDetailsName}\n\n${p1txt} ${p1dt}\n${p2txt} ${p2dt}\n\n${p3txt} ${p3dt}\n${qualitxt} ${qualidt}\n\n${racetxt} ${racedt}`)
            .catch((error) => {
                console.error(error);
            });
    }
    setTimeout(() => {
        document.getElementById("copyTxt").style.display = "none";
        document.getElementById("race-details-name").style.display = "block";
    }, 3000);
}

function copyRace() {
    setTimeout(() => {
        document.getElementById("race-details-name").style.display = "none";
        document.getElementById("copyTxt").style.display = "block";
    }, 100);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(`${raceDetailsName}\n${racetxt} ${racedt}`)
            .catch((error) => {
                console.error(error);
            });
    }
    setTimeout(() => {
        document.getElementById("copyTxt").style.display = "none";
        document.getElementById("race-details-name").style.display = "block";
    }, 3000);
}
function getRaceDetails() {
    fetch(urlNext)
        .then(response => response.json())
        .then(data => {
            const locale = localeType;
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

            const formatEvent = (event, defaultText) => {
                if (event) {
                    const eventDate = new Date(event.date + "T" + event.time);
                    return eventDate.toLocaleString(locale, options);
                }
                return defaultText;
            };

            const p1txt = "Practice 1:";
            const p1dt = formatEvent(race.FirstPractice, "Not Available");

            const p2txt = race.SprintQualifying ? "Sprint Qualifying:" : "Practice 2:";
            const p2dt = formatEvent(race.SprintQualifying || race.SecondPractice, "Not Available");

            const p3txt = race.Sprint ? "Sprint:" : "Practice 3:";
            const p3dt = formatEvent(race.Sprint || race.ThirdPractice, "Not Available");

            const qualitxt = "Qualifying:";
            const qualidt = formatEvent(race.Qualifying, "Not Available");

            const racetxt = "Race:";
            const racedt = formatEvent({ date: race.date, time: race.time }, "Not Available");

            const documentName = `Next: ${race.Circuit.Location.locality} ${data.MRData.RaceTable.season}`;
            raceDetailsName = `${race.raceName}`;
            const raceDetailsTrack = `${race.Circuit.circuitName}`;
            const raceCountry = `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`;
            const raceRound = `Round ${data.MRData.RaceTable["round"]}`;

            const raceDetails = `
                <div style="margin: auto; width: fit-content; text-align: justify;">
                    <div>
                        <div class="p1txt">${p1txt}</div>
                        <div class="p1dt">${p1dt}</div>
                    </div>
                    <div style="padding-bottom: 20px">
                        <div class="p2txt">${p2txt}</div>
                        <div class="p2dt pb-4">${p2dt}</div>
                    </div>
                    <div>
                        <div class="p3txt">${p3txt}</div>
                        <div class="p3dt">${p3dt}</div>
                    </div>
                    <div style="padding-bottom: 20px">
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
            document.getElementById("race-details-name").innerHTML = `<p class='errorTxt'>Error: ${error}</p>`;
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
                        const trackFlag = `
                ${track.flag}
              `
                        const trackLaps = `
                ${track.laps}
              `
                        const trackLength = `
              ${track.length} Km
              `
                        const trackDistance = `
              ${track.distance} Km
              `
                            ;
                        document.getElementById("race-details-name").innerHTML = raceDetailsName;
                        var combinedText = raceDetailsName + " " + trackFlag;
                        document.getElementById("race-details-name").innerHTML = combinedText;
                        document.getElementById("track-laps").innerHTML = trackLaps;
                        document.getElementById("track-length").innerHTML = trackLength;
                        document.getElementById("track-distance").innerHTML = trackDistance;
                    } else {
                        document.getElementById("trackData").innerHTML = `<p class='errorTxt'>Error: Track Not Found.</p>`;
                    }
                })
                .catch(error => {
                    document.getElementById("trackData").innerHTML = `<p class='errorTxt'>:Error</pr`;
                });
        });
}


function updateDriverTable(year) {
    const driverTable = document.getElementById("driver-table").getElementsByTagName('tbody')[0];
    const driverError = document.getElementById("driverError");
    driverTable.innerHTML = "<tr><td colspan='5'><i class='ti ti-loader-2'></i></td></tr>";

    fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverstandings.json`)
        .then(response => response.json())
        .then(data => {
            const drivers = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

            while (driverTable.firstChild) {
                driverTable.removeChild(driverTable.firstChild);
            }

            const driverTotal = `${data.MRData.total} Drivers`;
            document.getElementById("driver-total").innerHTML = driverTotal;
            document.getElementById("driver-year").innerHTML = year + " Drivers Standings";

            drivers.forEach((driver, index) => {
                const position = index + 1;
                const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
                const nationality = driver.Driver.nationality;
                const constructor = driver.Constructors.map(constructor => constructor.name).join(", ");
                const points = driver.points;

                const row = driverTable.insertRow();
                const positionCell = row.insertCell(0);
                const driverCell = row.insertCell(1);
                const nationalityCell = row.insertCell(2);
                const constructorCell = row.insertCell(3);
                const pointsCell = row.insertCell(4);

                positionCell.textContent = position;
                driverCell.textContent = driverName;
                nationalityCell.textContent = nationality;
                constructorCell.textContent = constructor;
                pointsCell.textContent = points;
            });
        })
        .catch(error => {
            if (error) {
                updateDriverTable(--year);
                driverError.style.display = "block";
                driverError.innerHTML = `Error loading ${year + 1} data.`;
            } else {
                driverError.style.display = "none";
            }
        });
}


function updateConstructorTable(year) {
    const constructorTable = document.getElementById("constructor-table").getElementsByTagName('tbody')[0];
    const constructorError = document.getElementById("constructorError");
    constructorTable.innerHTML = "<tr><td colspan='4'><i class='ti ti-loader-2'></i></td></tr>";

    fetch(`https://api.jolpi.ca/ergast/f1/${year}/constructorstandings.json`)
        .then(response => response.json())
        .then(data => {
            const constructors = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

            while (constructorTable.firstChild) {
                constructorTable.removeChild(constructorTable.firstChild);
            }

            const constructorTotal = `${constructors.length} Teams`;
            document.getElementById("constructor-total").innerHTML = constructorTotal;
            document.getElementById("constructor-year").innerHTML = year + " Constructors Standings";

            constructors.forEach((constructor, index) => {
                const position = index + 1;
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
            if (error) {
                updateConstructorTable(--year);
                constructorError.style.display = "block";
                constructorError.innerHTML = `Error loading ${year + 1} data.`;
            } else {
                constructorError.style.display = "none";
            }
        });
}


function updateCalendarTable(year) {
    const calendarTable = document.getElementById("calendar-table").getElementsByTagName('tbody')[0];
    calendarTable.innerHTML = "<tr><td colspan='5'><span><i class='ti ti-loader-2'></i></span></td></tr>";

    fetch(`https://api.jolpi.ca/ergast/f1/${year}.json`)
        .then(response => response.json())
        .then(data => {
            locale = localeType
            const wideScreen = window.innerWidth > 786;
            const options = {
                weekday: wideScreen ? 'long' : 'short',
                day: 'numeric',
                month: wideScreen ? 'long' : 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };
            const options2 = {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour12: true,
                year: 'numeric';
            };
            if (wideScreen) {
                options.year = 'numeric';
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
                if (race.time) {
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
                const circuitCell = row.insertCell(2);
                const countryCell = row.insertCell(3);
                const dateCell = row.insertCell(4);

                roundCell.textContent = round;
                raceCell.textContent = raceName;
                circuitCell.textContent = circuitName;
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
                            circuitCell.style.backgroundColor = "var(--red)";
                            circuitCell.style.color = "var(--white)";
                            circuitCell.style.fontWeight = "500";
                            countryCell.style.backgroundColor = "var(--red)";
                            countryCell.style.color = "var(--white)";
                            countryCell.style.fontWeight = "500";
                            dateCell.style.backgroundColor = "var(--red)";
                            dateCell.style.color = "var(--white)";
                            dateCell.style.fontWeight = "500";
                            if (window.innerWidth > 786) {
                                roundCell.style.borderTopLeftRadius = "11px";
                                roundCell.style.borderBottomLeftRadius = "11px";
                                dateCell.style.borderTopRightRadius = "11px";
                                dateCell.style.borderBottomRightRadius = "11px";
                            } else {
                                roundCell.style.borderTopLeftRadius = "6px";
                                roundCell.style.borderBottomLeftRadius = "6px";
                                dateCell.style.borderTopRightRadius = "6px";
                                dateCell.style.borderBottomRightRadius = "6px";
                            }
                        }
                    });

            });
        })
        .catch(error => {
            calendarTable.innerHTML = `<tr><td colspan='4' class='errorTxt'>Error: ${error}</td></tr>`;
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
        document.getElementById("driverError").style.display = "none";
        document.getElementById("constructorError").style.display = "none";
        document.getElementById("calendarError").style.display = "none";

        if (selectedYear && selectedYear.length == 4) {
            updateDriverTable(selectedYear);
            updateConstructorTable(selectedYear);
            updateCalendarTable(selectedYear);
        }
        if (currentYear != selectedYear) {
            document.getElementById("calIcon").style.opacity = "1";
            document.getElementById("calIcon").style.pointerEvents = "all";
        } else {
            document.getElementById("calIcon").style.opacity = "0";
            document.getElementById("calIcon").style.pointerEvents = "none";
        }
    });
});

function updateYear() {
    const yearPicker = document.getElementById('yearPicker');
    const currentYear = new Date().getFullYear();
    yearPicker.value = currentYear;
    yearPicker.max = currentYear;
    document.getElementById("calIcon").style.opacity = "0";
    document.getElementById("calIcon").style.pointerEvents = "none";

    updateDriverTable(currentYear);
    updateConstructorTable(currentYear);
    updateCalendarTable(currentYear);
}

function enableDarkMode() {
    body.classList.add('dark-mode');
}
function disableDarkMode() {
    body.classList.remove('dark-mode');
}

function scrollFunction() {
    const nextElement = document.getElementById("next").getBoundingClientRect().top;
    const driverElement = document.getElementById("driver").getBoundingClientRect().top;
    const constructorElement = document.getElementById("constructor").getBoundingClientRect().top;
    const calendarElement = document.getElementById("calendar").getBoundingClientRect().top;

    window.addEventListener("scroll", function () {
        const scrollPosition = window.scrollY;
        if (window.innerWidth > 786) {
            if (scrollPosition > 25) {
                document.getElementById("header").style.height = "65px";
                document.getElementById("header").style.boxShadow = "0 4px 10px 0 rgba(0, 0, 0, 0.2)";
                document.getElementById("headerTxt").style.margin = "10px 15px 0";
                document.getElementById("yearPicker").style.margin = "18px 0px";
                document.getElementById("calIcon").style.margin = "13px 5px";
                document.getElementById("desktopMenu").style.margin = "23px 30px";
            } else {
                document.getElementById("header").style.height = "80px";
                document.getElementById("header").style.boxShadow = "";
                document.getElementById("headerTxt").style.margin = "20px 20px 0";
                document.getElementById("yearPicker").style.margin = "28px 0";
                document.getElementById("calIcon").style.margin = "22px 5px";
                document.getElementById("desktopMenu").style.margin = "33px 50px";
            }
        } else {
            if (scrollPosition > 25) {
                document.getElementById("header").style.height = "70px";
                document.getElementById("header").style.boxShadow = "0 4px 10px 0 rgba(0, 0, 0, 0.2)";
                document.getElementById("headerTxt").style.margin = "0";
                document.getElementById("yearPicker").style.margin = "8px 0";
                document.getElementById("calIcon").style.margin = "4px 5px 0";
                document.getElementById("mobileMenu").style.paddingTop = "13px";
            } else {
                document.getElementById("header").style.height = "85px";
                document.getElementById("header").style.boxShadow = "";
                document.getElementById("headerTxt").style.margin = "6px 0";
                document.getElementById("yearPicker").style.margin = "12px 0";
                document.getElementById("calIcon").style.margin = "8px 5px 0";
                document.getElementById("mobileMenu").style.paddingTop = "16px";
            }
        }
    });
}