Pokedex.RootView.prototype.renderPokemonDetail = function (pokemon) {
  // var $pokemonLi = $("<li></li>");
 //  $pokemonLi.append(pokemon.get("name") + " " + pokemon.get("poke_type"));
 //  $pokemonLi.addClass("poke-list-item");
 //  this.$pokeList.append($pokemonLi);
  var $pokemonDiv = $("<div></div>");
  $pokemonDiv.addClass("detail");
  var $pokemonImg = $("<img>").attr("src", pokemon.get("image_url")).attr(
    "title", pokemon.get("name"));
  $pokemonDiv.append($pokemonImg);
  
  this.$pokeDetail.append($pokemonDiv);
};

Pokedex.RootView.prototype.selectPokemonFromList = function (event) {
  
};
