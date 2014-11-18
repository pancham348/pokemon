Pokedex.RootView.prototype.createPokemon = function (attrs, callback) {
  //get a new pokemon and save it
  // if things go well then
    // add pokemon to this.pokes
    //add the pokemon to the list
  // else we are all doomed
  var that = this;
  var pokemon = new Pokedex.Models.Pokemon(attrs);
  pokemon.save(attrs,{
    success: function(){
      console.log("saved")
      console.log(pokemon.toJSON())
      that.addPokemonToList(pokemon);
      that.pokes.add(pokemon);
    },
    error: function(){
      console.log("Fool! man was not meant to play god!")
    }
  })
  
  
};

Pokedex.RootView.prototype.submitPokemonForm = function (event) {
  // var pokeId = $(event.currentTarget).attr("data-id");
  // var pokemon = this.pokes.get(pokeId);
  // this.renderPokemonDetail(pokemon);
  console.log(event.currentTarget);
};

Pokedex.RootView.prototype.submitListener = function(){
  this.$el.on("submit", ".new-pokemon", this.submitPokemonForm.bind(this))
}
