document.addEventListener("DOMContentLoaded", getRaceDetails);
document.addEventListener("DOMContentLoaded", getSeasonDetails);
document.addEventListener("DOMContentLoaded", getTrackDetails);
window.onscroll = function () { scrollFunction() };

const urlSeason = "https://ergast.com/api/f1/current.json"
const urlNext = "https://ergast.com/api/f1/current/next.json"
const localeType = "en-GB"
// const localeType = "mr-IN"

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
      let p1 = "Practice 1: " + p1Date.toLocaleString(locale, options);

      const practice2 = race.SecondPractice;
      let p2d = practice2 ? practice2.date : "P2_Date";
      let p2t = practice2 ? practice2.time : "P2_Time";
      const p2Date = new Date(p2d + "T" + p2t);
      let p2 = "Practice 2: " + p2Date.toLocaleString(locale, options);

      const practice3 = race.ThirdPractice;
      let p3d = practice3 ? practice3.date : "P3_Date";
      let p3t = practice3 ? practice3.time : "P3_Time";
      const p3Date = new Date(p3d + "T" + p3t);
      let p3 = "Practice 3: " + p3Date.toLocaleString(locale, options);

      const sprint = race.Sprint;
      let sd = sprint ? sprint.date : "Sprint_Date";
      let st = sprint ? sprint.time : "Sprint_Time";
      const sDate = new Date(sd + "T" + st);

      const quali = race.Qualifying;
      const qd = quali ? quali.date : "Quali_Date";
      const qt = quali ? quali.time : "Quali_Time";
      const qDate = new Date(qd + "T" + qt);
      let q = "Qualifying: " + qDate.toLocaleString(locale, options);

      const rd = race ? race.date : "Race_Date";
      const rt = race ? race.time : "Race_Time";
      const rDate = new Date(rd + "T" + rt);
      let r = "Race: " + rDate.toLocaleString(locale, options);

      if (p3d === "P3_Date") {
        p2 = "Qualifying: " + qDate.toLocaleString(locale, options);
        p3 = "Sprint Shootout: " + p2Date.toLocaleString(locale, options);
        q = "Sprint: " + sDate.toLocaleString(locale, options);
      }

      const documentName = `
      Next: ${race.Circuit.Location.locality} ${data.MRData.RaceTable.season}
      `
      const raceDetailsName = `
      ${race.raceName}
      `

      const raceDetailsTrack = `
      ${race.Circuit.circuitName}
      `

      const raceCountry = `
      ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}
      `

      const raceRound = `
      ${data.MRData.RaceTable["round"]} 
      `

      // const raceSeason = `
      // ${data.MRData.RaceTable.season}
      // `

      const raceDetails = `
    <div class="justified-text">
    <div>${p1}</div>
    <div class="pb-4">${p2}</div>
    <div>${p3}</p>
    <div class="pb-4">${q}</div>
    <div class="pb-3">${r}</div>
    </div>
  `;

      document.getElementById("document-name").innerHTML = documentName;
      document.getElementById("race-details-name").innerHTML = raceDetailsName;
      document.getElementById("race-details-track").innerHTML = raceDetailsTrack;
      document.getElementById("race-details-country").innerHTML = raceCountry;
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
      ${data.MRData["total"]}
      `
      document.getElementById("season-round").innerHTML = seasonRound;
    })
    .catch(error => {
      document.getElementById("season-round").innerHTML = `<tr><td colspan='4' class='error-cell'>Error</td></tr>`;
    });
}

function updateDriverTable(year) {
  const driverTable = document.getElementById("driver-table").getElementsByTagName('tbody')[0];
  driverTable.innerHTML = "<tr><td colspan='5' class='loading-cell'><span class='spinner-border spinner-border' role='status' aria-hidden='true'></span></td></tr>";

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
  calendarTable.innerHTML = "<tr><td colspan='5' class='loading-cell' colspan='3'><span class='spinner-border spinner-border' role='status' aria-hidden='true'></span></td></tr>";

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
        const rt = race ? race.time : "Race_Time";
        const rDate = new Date(rd + "T" + rt);
        let date = rDate.toLocaleString(locale, options);

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
              roundCell.style.backgroundColor = "red";
              roundCell.style.color = "white";
              raceCell.style.backgroundColor = "red";
              raceCell.style.color = "white";
              circuitCell.style.backgroundColor = "red";
              circuitCell.style.color = "white";
              countryCell.style.backgroundColor = "red";
              countryCell.style.color = "white";
              dateCell.style.backgroundColor = "red";
              dateCell.style.color = "white";
              roundCell.style.borderTopLeftRadius = "6px";
              roundCell.style.borderBottomLeftRadius = "6px";
              dateCell.style.borderTopRightRadius = "6px";
              dateCell.style.borderBottomRightRadius = "6px";
            }
          });

      });
    })
    .catch(error => {
      calendarTable.innerHTML = `<tr><td colspan='5' class='error-cell'>Error: ${error}</td></tr>`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const yearPicker = document.getElementById('yearPicker');
  const currentYear = new Date().getFullYear();
  yearPicker.value = currentYear;
  yearPicker.max = currentYear;

  updateConstructorTable(currentYear);
  updateDriverTable(currentYear);
  updateCalendarTable(currentYear);

  yearPicker.addEventListener('input', () => {
    const selectedYear = yearPicker.value;
    if (selectedYear && selectedYear.length >= 4) {
      updateConstructorTable(selectedYear);
      updateDriverTable(selectedYear);
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
  updateConstructorTable(currentYear);
  updateDriverTable(currentYear);
  updateCalendarTable(currentYear);
}

function getTrackDetails() {
  fetch(urlNext)
    .then(response => response.json())
    .then(data => {
      const race = data.MRData.RaceTable.Races[0];
      const raceTrack = race.Circuit.circuitName;

      fetch('https://raw.githubusercontent.com/adm410/Formula-Dashboard/main/track.json')
        .then(response => response.json())
        .then(data => {
          const track = data.Data.track.find(track => track.name === raceTrack);

          if (track) {
            const trackLaps = `
              Laps: ${track.laps}
            `
            const trackLength = `
            Length: ${track.length} km
            `
            const trackDistance = `
            Distance: ${track.distance} km
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


function scrollFunction() {
  if (document.body.scrollTop > 25 || document.documentElement.scrollTop > 25) {
    document.getElementById("header").style.boxShadow = "0 4px 10px 0 rgba(0, 0, 0, 0.2)";
    document.getElementById("headereffect").style.scale = "0.9"
  } else {
    document.getElementById("header").style.boxShadow = "";
    document.getElementById("headereffect").style.scale = "1"
  }
}

function rotateArrow() {
  var arrow = document.querySelector('.bi-chevron-right');
  arrow.classList.toggle('rotate-90');
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
  document.getElementById("headertxt").classList.add('dark-mode');
  document.getElementById("next").classList.add('dark-mode');
  document.getElementById("next").classList.add('dark-mode');
  document.getElementById("driver").classList.add('dark-mode');
  document.getElementById("constructor").classList.add('dark-mode');
  document.getElementById("calendar").classList.add('dark-mode');
  document.getElementById("darkText").classList.add('dark-mode');
  document.getElementById("driver-table").classList.add('dark-mode');
  document.getElementById("constructor-table").classList.add('dark-mode');
  document.getElementById("calendar-table").classList.add('dark-mode');
  document.getElementById("yearPicker").classList.add('dark-mode');
}
window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
  const darkModeOn = e.matches;
  document.body.classList.toggle('dark-mode', darkModeOn);
  document.getElementById("headertxt").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("next").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("next").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("driver").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("constructor").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("calendar").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("darkText").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("driver-table").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("constructor-table").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("calendar-table").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("yearPicker").classList.toggle('dark-mode', darkModeOn);
});