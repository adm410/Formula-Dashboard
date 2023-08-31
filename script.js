document.addEventListener("DOMContentLoaded", getRaceDetails);
document.addEventListener("DOMContentLoaded", getSeasonDetails);
window.onscroll = function () { scrollFunction() };

const urlSeason = "https://ergast.com/api/f1/current.json"
const urlNext = "https://ergast.com/api/f1/current/next.json"

function getRaceDetails() {
  fetch(urlNext)
    .then(response => response.json())
    .then(data => {
      locale = "en-GB"
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
    <p>${p1}
    <br><div class="pb-0">${p2}</div>
    <br>${p3}
    <br><div class="pb-0">${q}</div>
    <br>${r}</p>
  `;
      document.getElementById("document-name").innerHTML = documentName;
      document.getElementById("race-details-name").innerHTML = raceDetailsName;
      document.getElementById("race-details-track").innerHTML = raceDetailsTrack;
      document.getElementById("race-details-country").innerHTML = raceCountry;
      document.getElementById("race-details").innerHTML = raceDetails;
      document.getElementById("race-round").innerHTML = raceRound;
    })
    .catch(error => {
      document.getElementById("race-details-name").innerHTML = `<tr><td colspan='4' class='error-cell'>Error: ${error}</td></tr>`;
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
  driverTable.innerHTML = "<tr><td colspan='4' class='loading-cell'><span class='spinner-border spinner-border' role='status' aria-hidden='true'></span></td></tr>";

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
        const constructor = driver.Constructors[0].name;
        const points = driver.points;

        const row = driverTable.insertRow();
        const positionCell = row.insertCell(0);
        const driverCell = row.insertCell(1);
        const constructorCell = row.insertCell(2);
        const pointsCell = row.insertCell(3);

        positionCell.textContent = position;
        driverCell.textContent = driverName;
        constructorCell.textContent = constructor;
        pointsCell.textContent = points;
      });
    })
    .catch(error => {
      driverTable.innerHTML = `<tr><td colspan='4' class='error-cell'>Error: ${error}</td></tr>`;
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
        const points = constructor.points;

        const row = constructorTable.insertRow();
        const positionCell = row.insertCell(0);
        const constructorCell = row.insertCell(1);
        const pointsCell = row.insertCell(2);

        positionCell.textContent = position;
        constructorCell.textContent = constructorName;
        pointsCell.textContent = points;
      });
    })
    .catch(error => {
      constructorTable.innerHTML = `<tr><td colspan='4' class='error-cell'>Error: ${error}</td></tr>`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const yearPicker = document.getElementById('yearPicker');
  const currentYear = new Date().getFullYear();
  yearPicker.value = currentYear;
  yearPicker.max = currentYear;

  updateConstructorTable(currentYear);
  updateDriverTable(currentYear);

  yearPicker.addEventListener('input', () => {
    const selectedYear = yearPicker.value;
    if (selectedYear && selectedYear.length >= 4) {
      updateConstructorTable(selectedYear);
      updateDriverTable(selectedYear);
    }
    if (currentYear != selectedYear) {
      document.getElementById("calIcon").style.display = "block";
    } else {
      document.getElementById("calIcon").style.display = "none";
    }
  });
});

function updateYear() {
  const yearPicker = document.getElementById('yearPicker');
  const currentYear = new Date().getFullYear();
  yearPicker.value = currentYear;
  yearPicker.max = currentYear;
  document.getElementById("calIcon").style.display = "none";
  updateConstructorTable(currentYear);
  updateDriverTable(currentYear);
}

function scrollFunction() {
  if (document.body.scrollTop > 25 || document.documentElement.scrollTop > 25) {
    document.getElementById("header").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0)";
    document.getElementById("header").style.fontSize = "27px";
    document.getElementById("header").style.height = "65px";
    document.getElementById("versiontxt").style.opacity = "0";
    document.getElementById("yearPicker").style.fontSize = "15px";
  } else {
    document.getElementById("header").style.boxShadow = "";
    document.getElementById("header").style.fontSize = "33px";
    document.getElementById("header").style.height = "70px";
    document.getElementById("versiontxt").style.opacity = "0.4";
    document.getElementById("yearPicker").style.fontSize = "17px";
  }
}


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
  document.getElementById("headertxt").classList.add('dark-mode');
  document.getElementById("next").classList.add('dark-mode');
  document.getElementById("driver").classList.add('dark-mode');
  document.getElementById("constructor").classList.add('dark-mode');
  document.getElementById("darkText").classList.add('dark-mode');
  document.getElementById("driver-table").classList.add('dark-mode');
  document.getElementById("constructor-table").classList.add('dark-mode');
  document.getElementById("yearPicker").classList.add('dark-mode');
}
window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
  const darkModeOn = e.matches;
  document.body.classList.toggle('dark-mode', darkModeOn);
  document.getElementById("headertxt").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("next").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("driver").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("constructor").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("darkText").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("driver-table").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("constructor-table").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("yearPicker").classList.toggle('dark-mode', darkModeOn);
});