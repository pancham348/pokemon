Pokedex.RootView.prototype.addPokemonToList = function (pokemon) {
  // create a list item with class of poke-list-item
  // Get naem and poke_type
  // Append result to this.$pokeList
  console.log("adding to list")
  var $pokemonLi = $("<li></li>");
  $pokemonLi.append(pokemon.get("name") + " " + pokemon.get("poke_type"));
  $pokemonLi.addClass("poke-list-item");
  this.$pokeList.append($pokemonLi);
};

Pokedex.RootView.prototype.refreshPokemon = function (callback) {
  var that = this;
  this.pokes.fetch({
    success: function() {
      console.log("fetch successful");
      that.pokes.each(that.addPokemonToList.bind(that));
    },
    
    error: function(){
    console.log("I am sorry Pokemon are not real");}  
  });
  
};
