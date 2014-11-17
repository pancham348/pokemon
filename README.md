# w7d1 Backbone Pokedex

**Gotta Fetch 'em All**

In this project, we'll write an app to manage your `Pokemon` and their
`Toy`s. We've already setup migrations/models/controllers for you to
start with in a skeleton that we will email to you at the beginning of the day. 
**Set things up with a `bundle install`, then `rake db:create db:migrate db:seed`**.

Here's the schema:

```ruby
ActiveRecord::Schema.define(version: 20141105185704) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "pokemons", force: true do |t|
    t.string   "name",       null: false
    t.integer  "attack",     null: false
    t.integer  "defense",    null: false
    t.string   "poke_type",  null: false
    t.string   "moves",      null: false
    t.string   "image_url",  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "toys", force: true do |t|
    t.integer  "pokemon_id", null: false
    t.string   "name",       null: false
    t.integer  "price",      null: false
    t.integer  "happiness",  null: false
    t.string   "image_url",  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "toys", ["pokemon_id"], name: "index_toys_on_pokemon_id", using: :btree

end
```

And the routes file:

```ruby
Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources(
    :pokemon,
    defaults: {format: :json},
    only: [:create, :destroy, :index, :show, :update]
  )
end
```

**Note the `defaults: {format: :json}`**. This means that HTTP
requests that Rails handles for the `pokemon` resource should be
assumed to be asking for a JSON response instead of HTML. When we
render a template, instead of looking for `template.html.erb`, Rails
will look for `template.json.jbuilder`. We'll see that soon!

**Also**: the root url `localhost:3000` will be the home of
our JS application. We have provided this controller and view
for you.

## Phase 0A: JBuilder

In `app/views/pokemon/` fill in the three empty jbuilder files - one 
each for `show` and `index`, and a partial called `_pokemon`. Your 
`show` and `index` files should both call the partial to render 
individual Pokemon. Render all the attributes of the `Pokemon`:

```json
{ "id":1,
  "attack":125,
  "defense":100,
  "image_url":"/assets/pokemon_snaps/127.png",
  "moves":["vicegrip"],
  "name":"Pinsir",
  "poke_type":"bug" }
```

Refer to [this excellent simple documentation][jbuilder-doc]. You'll use `json.array!` `json.partial!` and `json.extract` in your
JBuilder templates. These are all the major JBuilder options!

**Test your views by visiting `/pokemon/123` and `/pokemon`. Call your
TA to review.**

[jbuilder-doc]: https://github.com/rails/jbuilder

## Phase 0B: `Models.Pokemon` and `Collections.Pokemon`

In `app/assets/javascripts/pokedex-0.js`, let's write a `Pokemon` model.
The purpose of this model class is to allow us to easily interact with our
Rails API without having to manually make `$.ajax` requests each time we want
to fetch data from the server or push changes. This `ajax` work will be done for
us by a base class, `Backbone.Model`. 

So, let's write our new `Pokedex.Models.Pokemon` class. Instead of just creating
a new function, let's `extend` the base class: `Backbone.Model`. Now, we can
selectively overwrite and add properties and functions. Since most of the base class
will perfectly fit our needs, we only need to overwrite one default property: `urlRoot`.

The `urlRoot` property specifies the base path of where the `ajax` operations need to go.
For example: creating a new pokemon would necessitate a `POST` to `/pokemon`, and
updating the first pokemon  would need a `PATCH` to /pokemon/1. The _root_ of all
operations involving pokemon is `/pokemon`, so this will be our `urlRoot`.

Now we also need to write a collection: `Pokedex.Collections.Pokemon`. This class
will store all of our `Pokemon` models and allow us to manage them as a group. To 
write this class, like our model, we will `extend` a `Backbone` base class, `Backbone.Collection`.
We will need to overwrite the `url` and `model` properties. The `url` will be the same
value as `Pokedex.Models.Pokemon`'s `urlRoot` property. The `model` property will be set to
the `Pokemon` model we created above. This tells the base class that when we `fetch` all
the pokemon from the server and store them in individual models, we should use instances of
the `Pokemon` model as the class to store them in.

We've written and defined a "view" class `Pokedex.RootView`. This
class will be responsible for listening to user clicks and displaying
Pokemon data. Look at the class, but there is nothing to write for it
just yet.

**Test your model and collection.** Navigate to the [root url](http://localhost:3000).
Once you are there, in the Chrome console, run the following commands and ensure they work
as expected.

```js
// Should print out the attributes of Pokemon #1
Pokedex.Test.testShow(1);
// Should print out the attributes of all Pokemon!
Pokedex.Test.testIndex();
```

## Phase 1A: `refreshPokemon` and `addPokemonToList`

**Pokedex.RootView.prototype.addPokemonToList**

The first thing to do is get your `RootView` displaying `Pokemon`. To do
this, we should first fill out `addPokemonToList(pokemon)` method in
`pokedex-1A.js`. Create an `li` with jQuery, and list a few high-level
details of the Pokemon: `name` and `poke_type`. This is just an index
of Pokemon, so we won't display all data here. Append your `li` to
`this.$pokeList`.

If you give your `li` a class of `poke-list-item`, it'll style nicely
with the CSS rules we've provided. You can look at `application.css`
to check them out.

You can test your method in the console like so:

```js
var pokemon = new Pokedex.Models.Pokemon({ id: 1 });
pokemon.fetch({
  success: function () {
    window.Pokedex.rootView.addPokemonToList(pokemon);
  }
});
```

Does a Pokemon get added to the list?

**Pokedex.RootView.prototype.refreshPokemon**

Next, write `refreshPokemon` method. This method should fetch all the
Pokemon by fetching `this.pokes`. Iterate through the `this.pokes`,
calling `addPokemonToList`.

You can verify this is working by reloading the page; your Pokemon
should appear!

## Phase 1B: `renderPokemonDetail` and `selectPokemonFromList`

**Pokedex.RootView.prototype.renderPokemonDetail**

What we're going to do next is allow ourselves to see more detail
about a `Pokemon` by selecting it from the index.

We're going to show the details of the `Pokemon` in the
`this.$pokeDetail`. Create a `div.detail`. Add an image tag with the
Pokemon's photo; iterate through all the Pokemon properties, adding
each to the `div.detail`. Add the `div.detail` to `this.$pokeDetail`.

You can verify this is working:

```javascript
var pokemon = new Pokedex.Models.Pokemon({ id: 1 });
pokemon.fetch({
  success: function () {
    Pokedex.rootView.renderPokemonDetail(pokemon);
  }
});
```

**Pokedex.RootView.prototype.selectPokemonFromList**

We want to call `renderPokemonDetail` in response to clicks. However,
when a user clicks on a `Pokemon` list item in the `this.$pokeList`,
we need to figure out what `Pokemon` they are clicking on, so that we
can pass that pokemon object to `renderPokemonDetail`.

To do this, modify your `addPokemonToList` method to also set a `id`
data-attribute on the Pokemon list item. Next, in the `RootView`
constructor, write a click handler that calls
`this.selectPokemonFromList`. In the click handler, recover the `id`
from `event.target`; look up the `Pokemon` in `this.pokes` with the
id. Finally, use `renderPokemonDetail` to display the Pokemon.

**Test it out; you should be able to click a Pokemon and see more
details about it.**

## Phase IC: `createPokemon` and `submitPokemonForm`

**Pokedex.RootView.prototype.createPokemon**

As you encounter new Pokemon, you will want to record your findings
and share your wisdom with other poke-scientists. For this reason, we
have provided you with a form. It doesn't do anything yet.

Before we play with the form, let's write a
`createPokemon(attributes)` method. This should build a new `Pokemon`
model and save it. You'll want to manually add the pokemon to the
`this.pokes` collection and call `addPokemonToList`. Do both of these
in the success callback; that way, you don't add the pokemon to the
collection or list **unless it was saved properly**.

You can test it:

```javascript
Pokedex.rootView.createPokemon({
  name: "PikachuAndAsh",
  image_url: "http://upload.wikimedia.org/wikipedia/en/9/92/Pok%C3%A9mon_episode_1_screenshot.png",
  poke_type: "bug",
  attack: 0,
  defense: 0,
  moves: ["spinning!", "twirling!"]
});
```

Verify that a new pokemon is added to the list. Likewise, make sure a
new pokemon **is not added to the list** for an invalid pokemon:

```javascript
Pokedex.rootView.createPokemon({
  name: "PikachuAndAsh",
  // No image! Invalid!
  poke_type: "bug",
  attack: 0,
  defense: 0,
  moves: ["spinning!", "twirling!"]
});
```

**Pokedex.RootView.prototype.submitPokemonForm**

Again, we want to improve our user interface so the user can create a
Pokemon through the form, not the console.

To do this, write a `submitPokemonForm` method; in the `RootView`
constructor, install this as a submit handler on the form. In the
handler, use `serializeJSON` on the target to extract the data from
the form and convert it to a JS object. Then call your `createPokemon`
method.

**Display Details of Newly Created Pokemon**

Lastly, we'd like to to display the Pokemon details when creating a
new Pokemon. Modify your `createPokemon` method so that it accepts two
arguments: attributes, and a callback. On successful save of a newly
created Pokemon, your `createPokemon` method should call the callback,
passing the newly created Pokemon as the argument.

The `submitPokemonForm` method can now pass `this.renderPokemonDetail`
(after properly binding it).

Adding callback arguments to asynchronous methods is extremely common,
because it gives the caller flexibility to optionally do more work
**after** the asynchronous work of the method is completed.

**Call your TA over to check your work and to revel in your success!**

## Phase 2A: Rendering Toys

Pokemon love to play, so we've seeded the database with some toys. Our
first step is to update our JBuilder templates to render not just the
Pokemon, but also their Toys.

To do this, first write a `toys/_toy.json.jbuilder` partial template,
even though we won't write a `ToysController`. Write your template to
display the attributes of a toy: `id`, `happiness`, `image_url`,
`name`, `pokemon_id`, and `price`.

Modify your `pokemon/_pokemon` partial using `json.toys` to display a
list of toys. In the block you pass to `json.toys`, use `json.array!`
and render the partial (using `json.partial!`) for each of the toys of
the Pokemon.

There is a caveat: we want to display the toys when we go to
`/pokemon/123`, **but not when we go to `/pokemon`**. When you are
writing a large application, it is not possible to send *all* the data
down in a single JSON response. Therefore, `/pokemon` should just
list the pokemons, while fetching a single Pokemon can additionally
request further, more specific data.

For that reason, change your `pokemon/_pokemon` template so that
`pokemon/show` can **optionally** specify the toys to be rendered. You
can have it do this by passing a partial variable `display_toys:
true`. If `display_toys`, render the toys in `pokemon/_pokemon`, else
don't. You can write an if statement right in your JBuilder!

**Check that this is working by loading `/pokemon` and
`/pokemon/123`.** Call your TA over to check.

## Phase 2B: Write a `Toy` Model, `PokemonToys` Collection

We're ready to write our `Toy` model and `PokemonToys` collection in
`pokedex-0.js`. At this point, they need only extend their respective
Backbone classes. Additionally, set the `model` property of
`PokemonToys`.

On the server side a Pokemon model has a `has_many` toys association.
Backbone does not have a built in mechanism for representing
associations, so we'll wire up our own. Write a `toys` method on
`Pokemon` that memoizes a `PokemonToys` collection. Javascript doesn't
have an `||=` operator so we'll need to check: if `this._toys` is
undefined, set `this._toys` equal to a new instance of `PokemonToys`.
Finally return `this._toys`.

Now each `Pokemon` has a `toys` association. You might be wondering:
how this association collection is populated?

The Backbone `parse` method gives us the opportunity to massage an
incoming JSON object into the attributes our Backbone model will have.
`parse` also happens to be a great place to intercept any nested data
and use that data to populate associated collections.

Write a `parse(payload)` method on `Pokemon`. `payload` here is the
raw JSON object. The `parse` method will be called by backbone when
parsing a single model, or a collection of models returned from the
server during a fetch. **Remember** we're including `toys` in the
`show` action, but _not_ the `index` action.  Our `parse` method needs
to handle either case. If `payload` has a `toys` property, use the
array of `toys` to populate the `PokemonToys` collection returned by
the `toys()` method using [`set`][collection-set].

Finally, we must return a JSON object from `parse`. This object will
be used to set the attributes of the `Pokemon`. We prefer using our
shiny new `toys()` association over a raw array of toy JSON objects,
so lets be sure to delete the toys property from the `payload` before
returning the `payload`.

If you're still a bit fuzzy on how parse works review [the
reading][parse-reading].

To test that `toys` and `parse` are up and running, try this in the
Chrome console:

```js
var pokemon = new Pokedex.Models.Pokemon({ id: 1 });
pokemon.fetch({
  success: function () {
    console.log(pokemon.toys().length); // SHOULD BE 3+
  }
});
```

## Phase 2C: Displaying Toys in Pokemon Detail View

**Pokedex.RootView.prototype.renderPokemonDetail**

First, in your `renderPokemonDetail` method (in `pokedex-1B.js`),
build and append a `ul.toys` to your `div.detail` that you are
constructing. We'll display the toys inside this `ul` inside the
detail view.

Next, in the `renderPokemonDetail`, instigate a fetch of the
`Pokemon`, so that we can pull down the Pokemon's toys. For now, in
the success callback, just `console.log` each of the fetched
`pokemon.toys()`. Verify that the toys are fetched properly.

**Pokedex.RootView.prototype.addToyToList**

Instead of `console.log`ing the toys, we want to add them to the toys
list ul we've built. To do this, we'll write an `addToyToList(toy)`
method in `pokedex-2.js`.

In this method, construct an `li` for the Toy. Display basic info
about the toy: it's `name`, `happiness`, and `price`. Add the `li` to
the `ul.toys` inside of the `this.pokeDetail` element.

Last, modify `renderPokemonDetail` a last time to call `addToyToList`
for each toy, instead of logging.

**Pokedex.RootView.prototype.renderToyDetail and Pokedex.RootView.prototype.selectToyFromList**

We want to be able to show more detailed attributes of the Toy; in
particular its image. Write the `renderToyDetail(toy)` method, which
should make a `div.detail` and place it in `this.$toyDetail`.

Likewise, write a click handler `selectToyFromList` as before. You
will need a `toy-id` data-attribute as before, but you should also set
a `pokemon-id`, so that you can look up the `toy-id` in the
appropriate collection of `pokemon.toys()`.

[collection-set]: http://backbonejs.org/#Collection-set
[parse-reading]: https://github.com/appacademy/backbone-curriculum/blob/268498c3e594fa9bfa5f87825295ca8dd1d84d60/w7d3/backbone-model-ii.md
