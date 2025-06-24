const baseUrl = 'http://localhost:9001/api';

let nameH1,
  classificationSpan,
  designationSpan,
  averageHeightSpan,
  averageLifespanSpan,
  languageSpan,
  eyeColorsSpan,
  skinColorsSpan,
  hairColorsSpan,
  homeworldSpan;

document.addEventListener('DOMContentLoaded', () => {
  nameH1 = document.querySelector('#name');
  classificationSpan = document.querySelector('#classification');
  designationSpan = document.querySelector('#designation');
  averageHeightSpan = document.querySelector('#average_height');
  averageLifespanSpan = document.querySelector('#average_lifespan');
  languageSpan = document.querySelector('#language');
  eyeColorsSpan = document.querySelector('#eye_colors');
  skinColorsSpan = document.querySelector('#skin_colors');
  hairColorsSpan = document.querySelector('#hair_colors');
  homeworldSpan = document.querySelector('#homeworld');

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id) {
    getSpecies(id);
  } else {
    nameH1.textContent = 'No species ID provided.';
  }
});

async function getSpecies(id) {
  try {
    const species = await fetchSpecies(id);
    let homeworldName = 'Unknown';
    let homeworldId = null;

    if (species.homeworld !== null && species.homeworld !== undefined) {
      homeworldId = species.homeworld;
      try {
        const homeworld = await fetchHomeworld(homeworldId);
        homeworldName = homeworld.name || 'Unknown';
      } catch {
        homeworldName = 'Unknown';
      }
    }

    renderSpecies(species, homeworldName, homeworldId);
  } catch (err) {
    console.error('Error fetching species:', err);
    nameH1.textContent = 'Error loading species data.';
  }
}

async function fetchSpecies(id) {
  const url = `${baseUrl}/species/${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch species with id ${id}`);
  return await res.json();
}

async function fetchHomeworld(id) {
  const url = `${baseUrl}/planets/${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch homeworld with id ${id}`);
  return await res.json();
}

// Capitalize each word properly
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(/[\s,]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function renderSpecies(species, homeworldName, homeworldId) {
  document.title = `SWAPI - ${toTitleCase(species.name || 'Unknown')}`;
  nameH1.textContent = toTitleCase(species.name || 'Unknown');
  classificationSpan.textContent = toTitleCase(species.classification || 'Unknown');
  designationSpan.textContent = toTitleCase(species.designation || 'Unknown');
  averageHeightSpan.textContent = species.average_height || 'Unknown';
  averageLifespanSpan.textContent = species.average_lifespan || 'Unknown';
  languageSpan.textContent = toTitleCase(species.language || 'Unknown');
  eyeColorsSpan.textContent = toTitleCase(species.eye_colors || 'Unknown');
  skinColorsSpan.textContent = toTitleCase(species.skin_colors || 'Unknown');
  hairColorsSpan.textContent = toTitleCase(species.hair_colors || 'Unknown');

  homeworldSpan.innerHTML = '';
  if (homeworldId && homeworldName !== 'Unknown') {
    const link = document.createElement('a');
    link.href = `homeworld.html?id=${homeworldId}`;
    link.textContent = toTitleCase(homeworldName);
    homeworldSpan.appendChild(link);
  } else {
    homeworldSpan.textContent = 'Unknown';
  }
}
