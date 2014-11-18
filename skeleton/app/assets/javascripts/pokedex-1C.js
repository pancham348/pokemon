Pokedex.RootView.prototype.createPokemon = function (attrs, callback) {
  //get a new pokemon and save it
  // if things go well then
    // add pokemon to this.pokes
    //add the pokemon to the list
  // else we are all doomed
  var pokemon = new Pokedex.Models.Pokemon(attrs);
  pokemon.save(attrs,{
    success: function(){
      console.log("saved")
      console.log(pokemon.toJSON())
    },
    error: function(){
      console.log("Fool! man was not meant to play god!")
    }
  })
  
  
};

Pokedex.RootView.prototype.submitPokemonForm = function (event) {
};
