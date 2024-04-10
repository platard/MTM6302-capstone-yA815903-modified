const pokemonList = document.getElementById('list-Pokemon');
const $return = document.getElementById('return');
let pokemons = []
let caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon')) || []

function parseUrl (url) {
  return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1)
}

async function fetchPokemons() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
  const data = await response.json()
  pokemons = data.results
  generatePokemon(pokemons)
}

// Create Pokemon elements
async function generatePokemon(pokemons) {
  pokemonList.innerHTML = '';
  // for (const type in pokemonTypes) {
    for (const item of pokemons) {
      if(!item.id)  {
        item.id = parseUrl(item.url)
      }
      const pokemon = document.createElement('div');
      pokemon.classList.add('pokemon');

      const idBack = document.createElement('p');
      idBack.classList.add('pokemon-id-back');
      // idBack.textContent = `#${id.toString().padStart(3, '0')}`;
      idBack.textContent = `#${item.id}`

      const pokemonData = await fetchPokemonData(item.id);

      const image = document.createElement('div');
      image.classList.add('pokemon-image');
      const imageImg = document.createElement('img');
      imageImg.src = pokemonData.sprites.other['official-artwork'].front_default;
      image.appendChild(imageImg);

      const info = document.createElement('div');
      info.classList.add('pokemon-info');

      const nameContainer = document.createElement('div');
      nameContainer.classList.add('name-container');

      const idFront = document.createElement('p');
      idFront.classList.add('pokemon-id');
      idFront.textContent = item.id;

      const name = document.createElement('h1');
      name.classList.add('pokemon-name');
      name.textContent = pokemonData.name;

      nameContainer.appendChild(idFront);
      nameContainer.appendChild(name);

      const typeDiv = document.createElement('div');
      typeDiv.classList.add('pokemon-type');

      pokemonData.types.forEach(type => {
        const typeElement = document.createElement('p');
        typeElement.classList.add('type', type.type.name);
        typeElement.textContent = type.type.name;
        typeDiv.appendChild(typeElement);
      });

      const stats = document.createElement('div');
      stats.classList.add('pokemon-stats');

      const height = document.createElement('p');
      height.classList.add('height');
      height.textContent = `${pokemonData.height * 10} cm`;

      const weight = document.createElement('p');
      weight.classList.add('weight');
      weight.textContent = `${pokemonData.weight / 10} kg`;

      stats.appendChild(height);
      stats.appendChild(weight);

      const caughtButton = document.createElement('button');
      caughtButton.classList.add('btn', 'btn-caught');
      caughtButton.textContent = 'Catch';

    if (caughtPokemon.some(pokemon => pokemon.id === item.id)) {
        caughtButton.textContent = 'Caught';
    }

      info.appendChild(nameContainer);
      info.appendChild(typeDiv);
      info.appendChild(stats);
      info.appendChild(caughtButton);

      pokemon.appendChild(idBack);
      pokemon.appendChild(image);
      pokemon.appendChild(info);
      pokemonList.appendChild(pokemon);
    }
  // } close for...in loop
}

// Fetch Pokemon data from PokeAPI
async function fetchPokemonData(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function catchPokemon(event) {
  event.preventDefault();

  const pokemonContainer = event.target.closest('.pokemon');
  const pokemonId = pokemonContainer.querySelector('.pokemon-id').textContent;
  const pokemonName = pokemonContainer.querySelector('.pokemon-name').textContent;

  if (!caughtPokemon.some(pokemon => pokemon.id === pokemonId)) {
    caughtPokemon.push({ id: pokemonId, name: pokemonName });
    localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
    generatePokemon(caughtPokemon)
    alert(`${pokemonName} has been caught!`);
  } else {
    alert(`${pokemonName} is already caught!`);
  }
}

pokemonList.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn-caught')) {
    catchPokemon(event);
  }
});

$return.addEventListener('click', function() {
  fetchPokemons()
})

fetchPokemons()