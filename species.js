let nameH1;
let classificationSpan;
let designationSpan;
let averageHeightSpan;
let languageSpan;
const baseUrl = `http://localhost:9001/api`;

addEventListener('DOMContentLoaded', () => {
  nameH1 = document.querySelector('h1#name');
  classificationSpan = document.querySelector('span#classification');
  designationSpan = document.querySelector('span#designation');
  averageHeightSpan = document.querySelector('span#average_height');
  languageSpan = document.querySelector('span#language');

  const sp = new URLSearchParams(window.location.search);
  const id = sp.get('id');
  if (id) {
    getSpecies(id);
  } else {
    console.error("No species ID provided in URL");
  }
});

async function getSpecies(id) {
  try {
    const species = await fetchSpecies(id);
    renderSpecies(species);
  } catch (ex) {
    console.error(`Error fetching species ${id}`, ex.message);
  }
}

async function fetchSpecies(id) {
  const url = `${baseUrl}/species/${id}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch species with id ${id}`);
  return await response.json();
}

function renderSpecies(species) {
  document.title = `SWAPI - ${species.name}`;
  nameH1.textContent = species.name;
  classificationSpan.textContent = species.classification || 'Unknown';
  designationSpan.textContent = species.designation || 'Unknown';
  averageHeightSpan.textContent = species.average_height || 'Unknown';
  languageSpan.textContent = species.language || 'Unknown';
}
