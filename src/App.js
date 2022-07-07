import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// presentational
const PokemonImage = ({ url, defaultURL }) => {
  return url ? (
    <img src={url} className='pokemon' />
  ) : (
    <img src={defaultURL} className='pokemon' />
  );
};

const PokemonMovesList = ({ moves }) => {
  return (
    <ul className='moves-list'>
      {moves.map(({ move }, index) => {
        return <li key={index}>{move.name}</li>;
      })}
    </ul>
  );
};

// const PokemonFlavorText = ({ url }) => {
//   console.log(url);
//   const [test, setTest] = useState({});

//   useEffect(() => {
//     (async () => {
//       const data = await axios.get(url);
//       setTest(data.data);
//     })();
//   }, [url]);
//   console.log(test);
//   return (
//     <p style={{ width: '200px', paddingLeft: '15px' }}>
//       {test?.flavor_text_entries?.[0]?.flavor_text}
//     </p>
//   );
// };

class PokemonFlavorText extends React.Component {
  constructor() {
    super();
    this.state = {
      flavor_text: '',
    };
  }

  componentDidMount() {
    (async () => {
      const data = await axios.get(this.props.url);
      this.setState(() => ({
        flavor_text: data.data.flavor_text_entries[0].flavor_text,
      }));
      console.log(data);
    })();
  }
  render() {
    return (
      <p style={{ width: '200px', paddingLeft: '15px' }}>
        {this.state.flavor_text}
      </p>
    );
  }
}
const App = () => {
  const [pokemon, setPokemon] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [currentImage, setCurrentImage] = useState('official-artwork');
  const [hasDetails, setHasDetails] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto');
      console.log(data.data);
      setPokemon(data.data);
    })();
  }, []);

  const reloadPokemon = async (pokemon) => {
    const data = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );
    console.log(data.data);
    setPokemon(data.data);
  };

  const onPokeSearchHandler = (e) => {
    e.preventDefault();
    reloadPokemon(searchInput);
  };

  console.log(pokemon.sprites?.other[currentImage]['front_default']);
  return (
    <>
      <h1 style={{ textAlign: 'center', fontSize: '50px', marginBottom: 0 }}>
        POKEMON
      </h1>
      <div className='App'>
        {pokemon['sprites'] && (
          <>
            <div className='pokedex'>
              <div
                onClick={() => setHasDetails((prevState) => !prevState)}
                className='toggle-details-button'
              ></div>
              <div className='toggle-buttons'>
                <div
                  className='dots'
                  onClick={() => setCurrentImage('official-artwork')}
                ></div>
                <div
                  className='dots'
                  onClick={() => setCurrentImage('dream_world')}
                ></div>
                <div
                  className='dots'
                  onClick={() => setCurrentImage('home')}
                ></div>
              </div>
              <PokemonImage
                url={pokemon.sprites?.other[currentImage]['front_default']}
                defaultURL={
                  pokemon.sprites?.other['official-artwork']['front_default']
                }
              />
              <form onSubmit={onPokeSearchHandler} className='search-form'>
                <input
                  className='search'
                  type='text'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
                />
              </form>
            </div>
            {hasDetails && (
              <>
                <PokemonFlavorText url={pokemon.species.url} />
                <PokemonMovesList moves={pokemon.moves} />
              </>
            )}
            {/* <ul> */}
            {/*   <li>{pokemon.moves[0].move.name}</li> */}
            {/* </ul> */}
          </>
        )}
      </div>
    </>
  );
};

export default App;
