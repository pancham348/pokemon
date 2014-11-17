Pokedex.RootView.prototype.addPokemonToList = function (pokemon) {
  // create a list item with class of poke-list-item
  // Get naem and poke_type
  // Append result to this.$pokeList
  var $pokemonLi = $("<li></li>");
  $pokemonLi.append(pokemon.get("name") + " " + pokemon.get("poke_type"));
  $pokemonLi.addClass("poke-list-item");
  this.$pokeList.append($pokemonLi);
};

Pokedex.RootView.prototype.refreshPokemon = function (callback) {
};
