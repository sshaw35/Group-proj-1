const baseUrl = `http://localhost:9001/api`;

let nameH1,
  climateSpan,
  populationSpan,
  terrainSpan,
  gravitySpan,
  orbitalPeriodSpan,
  rotationPeriodSpan,
  diameterSpan,
  surfaceWaterSpan,
  residentsUl;

document.addEventListener('DOMContentLoaded', async () => {
  nameH1 = document.querySelector('#planet-name');
  climateSpan = document.querySelector('#climate');
  populationSpan = document.querySelector('#population');
  terrainSpan = document.querySelector('#terrain');
  gravitySpan = document.querySelector('#gravity');
  orbitalPeriodSpan = document.querySelector('#orbital-period');
  rotationPeriodSpan = document.querySelector('#rotation-period');
  diameterSpan = document.querySelector('#diameter');
  surfaceWaterSpan = document.querySelector('#surface-water');
  residentsUl = document.querySelector('#residents-list');

  const sp = new URLSearchParams(window.location.search);
  const id = sp.get('id');

  try {
    const planet = await getPlanet(id);
    const residents = await getResidents(id);
    renderPlanet(planet);
    renderResidents(residents);
  } catch (err) {
    console.error("error loading planet data :", err.message);
  }
});

async function getPlanet(id) {
  const res = await fetch(`${baseUrl}/planets/${id}`);
  return await res.json();
}

async function getResidents(id) {
  const res = await fetch(`${baseUrl}/planets/${id}/characters`);
  return await res.json();
  console.log("residents fetched : ", data);
  return data;
}

function renderPlanet(planet) {
  document.title = `SWAPI - ${planet.name}`;
  nameH1.textContent = planet.name;
  climateSpan.textContent = planet.climate;
  populationSpan.textContent = planet.population;
  terrainSpan.textContent = planet.terrain;
  gravitySpan.textContent = planet.gravity;
  orbitalPeriodSpan.textContent = planet.orbital_period;
  rotationPeriodSpan.textContent = planet.rotation_period;
  diameterSpan.textContent = planet.diameter;
  surfaceWaterSpan.textContent = planet.surface_water;
}

function renderResidents(residents) {
    if (!residents || residents.length === 0) {
        residentsUl.innerHTML = "<li> no known residents </li>";
        return;

    }

    residentsUl.innerHTML = residents
        .map(resident => `<li><a href="/character.html?id=${resident.id}">${resident.name}</a></li>`)
        .join('');
}
