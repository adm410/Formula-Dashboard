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
      const rd = race ? race.date : "Race_Date";
      const rt = race ? race.time : "Race_Time";
      const rDate = new Date(rd + "T" + rt);
      let r = "Race: " + rDate.toLocaleString(locale, options);


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
      let s = "Sprint: " + sDate.toLocaleString(locale, options);

      const quali = race.Qualifying;
      const qd = quali ? quali.date : "Quali_Date";
      const qt = quali ? quali.time : "Quali_Time";
      const qDate = new Date(qd + "T" + qt);
      let q = "Qualifying: " + qDate.toLocaleString(locale, options);

      if (p3d === "P3_Date") {
        p2 = "Qualifying: " + qDate.toLocaleString(locale, options);
        p3 = "Sprint Shootout: " + p2Date.toLocaleString(locale, options);
        q = "Sprint: " + sDate.toLocaleString(locale, options);
      }

      const documentName = `
      Next: ${race.Circuit.Location.locality} ${data.MRData.RaceTable.season}
      `
      const raceDetailsName = `
      <p>${race.raceName}</p>
      `

      const raceDetailsTrack = `
      <p>${race.Circuit.circuitName}</p>
      `

      const raceCountry = `
      <p>${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</p>
      `

      const raceRound = `
      ${data.MRData.RaceTable["round"]}
      `

      // const raceSeason = `
      // ${data.MRData.RaceTable.season}
      // `

      const raceDetails = `
    <p>${p1}</p>
    <p class="pb-3">${p2}</p>
    <p>${p3}</p>
    <p class="pb-3">${q}</p>
    <p>${r}</p>
  `;
      document.getElementById("document-name").innerHTML = documentName;
      document.getElementById("race-details-name").innerHTML = raceDetailsName;
      document.getElementById("race-details-track").innerHTML = raceDetailsTrack;
      document.getElementById("race-details-country").innerHTML = raceCountry;
      document.getElementById("race-details").innerHTML = raceDetails;
      document.getElementById("race-round").innerHTML = raceRound;
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("race-details").innerHTML = "Failed to fetch race details.";
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
      console.error("Error:", error);
      document.getElementById("season-round").innerHTML = "Failed to fetch season details.";
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetch('https://ergast.com/api/f1/current/driverstandings.json')
    .then(response => response.json())
    .then(data => {
      const drivers = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      const driverTable = document.getElementById("driver-table").getElementsByTagName('tbody')[0];

      const driverTotal = `
      ${data.MRData["total"]} Drivers
      `
      document.getElementById("driver-total").innerHTML = driverTotal;

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
    .catch(error => console.log(error));
});

document.addEventListener("DOMContentLoaded", function () {
  fetch('https://ergast.com/api/f1/current/constructorstandings.json')
    .then(response => response.json())
    .then(data => {
      const constructors = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      const constructorTable = document.getElementById("constructor-table").getElementsByTagName('tbody')[0];

      const constructorTotal = `
      ${data.MRData["total"]} Teams
      `;
      document.getElementById("constructor-total").innerHTML = constructorTotal;

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
    .catch(error => console.log(error));
});

function scrollFunction() {
  if (document.body.scrollTop > 25 || document.documentElement.scrollTop > 25) {
    document.getElementById("header").style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";
    document.getElementById("header").style.fontSize = "30px";
    document.getElementById("header").style.height = "65px";
    document.getElementById("versiontxt").style.fontSize = "0px";

    document.getElementById("header").style.boxShadow = "";
    document.getElementById("header").style.fontSize = "40px";
    document.getElementById("header").style.height = "85px";
    document.getElementById("versiontxt").style.fontSize = "15px";
  }
}


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
  document.getElementById("headertxt").classList.add('dark-mode');
  document.getElementById("next").classList.add('dark-mode');
  document.getElementById("driver").classList.add('dark-mode');
  document.getElementById("constructor").classList.add('dark-mode');
  document.getElementById("darkText").classList.add('dark-mode');
}
window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
  const darkModeOn = e.matches;
  document.body.classList.toggle('dark-mode', darkModeOn);
  document.getElementById("headertxt").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("next").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("driver").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("constructor").classList.toggle('dark-mode', darkModeOn);
  document.getElementById("darkText").classList.toggle('dark-mode', darkModeOn);
});