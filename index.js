let characters = []
let matchingCharacters = []
let speciesList = []
const charactersList = document.querySelector("#charactersList")

document.addEventListener('DOMContentLoaded', getCharacters)

async function getCharacters() {
  let url = 'http://localhost:9001/api/characters'

  try {
    const fetchedCharacters = await fetch(url)
      .then(res => res.json())
    characters.push(...fetchedCharacters)
  }
  catch (ex) {
    console.error("Error reading characters.", ex.message)
  }
  console.log("All the characters are ", characters)
  renderCharacters(characters)
}

const filterCharacters = () => {
  const searchString = document.querySelector("#searchString").value
  const re = new RegExp(searchString, "i")
  matchingCharacters = characters.filter(character => re.test(character.name))
  renderCharacters(matchingCharacters)
}

const renderCharacters = characters => {
  const divs = characters.map(character => {
    const el = document.createElement('div')
    el.addEventListener('click', () => goToCharacterPage(character.id));
    el.textContent = character.name
    return el
  })
  charactersList.replaceChildren(...divs)
}

const goToCharacterPage = id => window.location = `/character.html?id=${id}`


// DOM references
const characterHeader = document.querySelector('#charactersSection .section-header')
const speciesHeader = document.querySelector('#speciesSection .section-header')
const characterBody = document.querySelector('#charactersSection .section-body')
const speciesBody = document.querySelector('#speciesSection .section-body')

const charactersContainer = document.getElementById('charactersContainer')
const speciesContainer = document.getElementById('speciesContainer')
const characterSearch = document.getElementById('characterSearch')
const speciesSearch = document.getElementById('speciesSearch')

// Load flags
let charactersLoaded = false;
let speciesLoaded = false;

// Toggle visibility of sections and load data on first open
characterHeader.addEventListener('click', async () => {
  toggleSection(characterBody)
  if (!charactersLoaded) {
    await getCharacters()
    charactersLoaded = true
  }
})


speciesHeader.addEventListener('click', async () => {
  toggleSection(speciesBody)
  if (!speciesLoaded) {
    await getSpecies()
    speciesLoaded = true
  }
});

// Search filters
characterSearch.addEventListener('input', () => {
  const query = characterSearch.value.trim()
  const filtered = filterList(characters, query)
  renderList(filtered, charactersContainer, 'character')
})

speciesSearch.addEventListener('input', () => {
  const query = speciesSearch.value.trim();
  const filtered = filterList(speciesList, query);
  renderList(filtered, speciesContainer, 'species')
})

// Toggle section visibility helper
function toggleSection(section) {
  section.style.display = section.style.display === 'block' ? 'none' : 'block'
}

// Filter list by name with case-insensitive regex
function filterList(list, query) {
  try {
    const re = new RegExp(query, 'i')
    return list.filter(item => re.test(item.name))
  } catch {
    return list
  }
}

// Fetch characters from API and render
async function getCharacters() {
  try {
    const res = await fetch('http://localhost:9001/api/characters')
    if (!res.ok) throw new Error('Failed to fetch characters')
    characters = await res.json()
    renderList(characters, charactersContainer, 'character')
  } catch (err) {
    charactersContainer.innerHTML = `<p style="color:red;">Error loading characters: ${err.message}</p>`
  }
}

// Fetch species from API and render
async function getSpecies() {
  try {
    const res = await fetch('http://localhost:9001/api/species')
    if (!res.ok) throw new Error('Failed to fetch species')
    speciesList = await res.json()
    renderList(speciesList, speciesContainer, 'species')
  } catch (err) {
    speciesContainer.innerHTML = `<p style="color:red;">Error loading species: ${err.message}</p>`
  }
}

// Fetch planets from API and render
async function getPlanets() {
  try {
    const res = await fetch('http://localhost:9001/api/planets')
    if (!res.ok) throw new Error('Failed to fetch planets')
    planetsList = await res.json()
    renderList(planetsList, planetsContainer, 'planets')
  } catch (err) {
    planetsContainer.innerHTML = `<p style="color:red;">Error loading planets: ${err.message}</p>`
  }
}

// Render clickable list items that navigate on click
function renderList(list, container, type) {
  container.replaceChildren()
  list.forEach(item => {
    const el = document.createElement('div')
    el.textContent = item.name
    el.classList.add('clickable')
    el.addEventListener('click', () => {
      const url = type === 'character'
        ? `/character.html?id=${item.id}`
        : `/species.html?id=${item.id}` 
      window.location.href = url
    })
    container.appendChild(el)
  })
}