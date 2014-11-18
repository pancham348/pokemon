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
  
  var keys = pokemon.keys();
  for (var i = 0; i < keys.length; i++) {
     if(keys[i] !=  "image_url"){
       $pokemonDiv.append(keys[i] + ": " + pokemon.get(keys[i])).append("<br>");
     }
  }
  
  this.$pokeDetail.append($pokemonDiv);
};

Pokedex.RootView.prototype.selectPokemonFromList = function (event) {
  //listen for clicks
  //when a user clicks on a pokemon, render that pokem
  console.log(event);
  console.log(event.currentTarget)
  
  //give id to pokemon bullshting
  //get the id from event.target to look up the pokemon in the list
  //render the pokermon detail we have
};

Pokedex.RootView.prototype.clickListener = function(){
  this.$el.on("click", ".poke-list-item", this.selectPokemonFromList.bind(this))
}
