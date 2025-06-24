let titleH1;
let episodeSpan;
let directorSpan;
let producerSpan;
let releaseSpan;
let characterUl;
let planetUl;
const baseUrl = `http://localhost:9001/api`;

// Runs on page load
addEventListener('DOMContentLoaded', async () => {
  titleH1 = document.querySelector('#title');
  episodeSpan = document.querySelector('#episode');
  directorSpan = document.querySelector('#director');
  producerSpan = document.querySelector('#producer');
  releaseSpan = document.querySelector('#release_date');
  crawlP = document.querySelector('#opening_crawl');
  characterUl = document.querySelector('#characterList');
  planetUl = document.querySelector('#planetList');
  const sp = new URLSearchParams(window.location.search);
  const id = sp.get('id');

  await loadFilm(id);
});

const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error();
    return response.json();
}

const loadFilm = async (id) => {
    try {
        let film = await fetchJson(`${baseUrl}/films/${id}`);

        const [characters, planets] = await Promise.all([
            fetchJson(`${baseUrl}/films/${id}/characters`),
            fetchJson(`${baseUrl}/films/${id}/planets`)
        ])

        renderFilm(film, characters, planets);
    } catch (e) {
        console.error('Error loading films', e);
        titleH1.textContent = 'Error loading films';
    }
    
}

const renderFilm = (film, characters, planets) => {
  document.title = `SWAPI - ${film?.title}`;  // So the browser says the film title
  titleH1.textContent =  film?.title;
  episodeSpan.textContent = film?.episode_id;
  directorSpan.textContent = film?.director;
  producerSpan.textContent = film?.producer;
  releaseSpan.textContent = film?.release_date;
  crawlP.textContent = film?.opening_crawl;

  characterUl.replaceChildren(
    ...characters.map(c => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="character.html?id=${c.id}">${c.name}</a>`;
        return li;
    })
  );

  planetUl.replaceChildren(
    ...planets.map(p => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="planet.html?id=${p.id}">${p.name}</a>`;
        return li;
    })
  );

}
