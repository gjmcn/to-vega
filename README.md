# To-Vega

---

**Note**: this project is no longer active. Please try its replacement: [Vizsla](https://github.com/gjmcn/vizsla).

---

**To-Vega** is a simple JavaScript library for creating [Vega-Lite](https://vega.github.io/vega-lite/) specifications. For example:

```js
tv('pets.json').point().x('cat').y('dog').spec
```

returns the object:

```js
{
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  data: { url: 'pets.json' },
  mark: 'point',
  encoding: {
    x: { field: 'cat', type: 'quantitative' },
    y: { field: 'dog', type: 'quantitative' }
  }
}
```

Typically, it is easy to add a suitable `plot` method to the library (the details depend on the context) allowing for code such as:

```js
tv('pets.json').point().x('cat').y('dog').plot()
```

To-Vega makes it easy to generate a spec and set commonly used properties. More advanced options can also be set with To-Vega or alternatively, standard JavaScript can be used.

See this [Observable notebook](https://beta.observablehq.com/@gjmcn/plotting-with-to-vega-and-vega-lite) for some interactive examples.

## Install/Load

To-Vega uses the Universal Module Definition (UMD) so should work in any JavaScript environment. For example:

* Node.js:
	* install: `npm --save install to-vega`
	* load: `const tv = require('to-vega')`

* Browser, using `<script>`: creates a global variable `tv`

## Usage

Assuming To-Vega has been loaded as above, create a spec with `tv(data)`. If `data` is a string, it is used as the `data.url` property of the spec, otherwise it is used as the `data.values` property. If `data` is omitted, `tv` does not add a data property to the spec.

`tv` returns a To-Vega object. The methods of a To-Vega object return the same object which allows methods to be chained.  The `spec` property of a To-Vega object contains the actual spec.

In the docs below, the term 'current object' refers to the object that we are currently adding properties to &mdash; our current location in the spec. When a spec is first created, the top-level object is the current object.

## Methods

### Basic

The following methods set the corresponding property of the current object:

`description`, `title`, `width`, `height`, `name`, `transform`, `$schema`, `background`, `padding`, `autosize`, `config`, `selection`, `facet`, `repeat`, `resolve`

E.g. `tv().width(300)` or `tv().selection({brush: {type: 'interval'}})`

The following methods have slightly more complex behavior:

* `data` sets the data property of the current object; `data` interprets its argument in the same way as `tv`

* `projection` and `proj` set the projection property of the current object: if passed a string, the projection property is set to `{type: theString}`, otherwise the projection property is set to the argument

* `across` and `down` set the column and row properties respectively of the repeat property of the current object
	* the repeat property is created if it does not exist
	* pass field names as separate arguments to `across` and `down` (use spread syntax to pass an array, e.g. `.down(...theArray)`)

* `desc` is an alias for `description`

* `prop` sets a property of the current object, e.g. `.prop('width',300)` is equivalent to `.width(300)`

### Compose

`hconcat`, `vconcat`, `layer`

These methods set the property of the same name (on the current object) to an array, add an empty object to the array and make it the current object.

The `open` method is similar, but does not add an array: `open` sets the spec property (of the current object) to an empty object and makes it the current object.

`hconcat`, `vconcat`, `layer` and `open` take no arguments.

Call `.end` to exit an array or object:

* if inside a 'composition array' (created by `hconcat`, `vconcat` or `layer`), `end` closes the current object (the array entry) and closes the array

* if inside an inner spec object (created with `open`), `end` closes the object

* otherwise, `end` throws an error


### Marks

`area`, `bar`, `boxplot`, `circle`, `errorband`, `errorbar`, `geoshape`, `line`, `point`, `rect`, `rule`, `square`,`text`, `tick`, `trail`

If the current object is the top-level object or an inner spec object (created with `open`), mark methods set the mark property.

Inside a composition array, mark methods set the mark property if it does not exist (or is falsy). However, if the mark property already exists (and is truthy), mark methods add a new object to the composition array, make this the current object and set its mark property.

If a mark method is passed an object, the object is used as the value of the relevant mark property. The passed object need not have a type property; the name of the mark method is used by default. If a mark method is not passed an object, the relevant mark property is set to the name of the mark method.

`mark` is a generic method, e.g. `.mark('bar', ops)` is equivalent to `.bar(ops)`.

Use `add` inside a composition array to add an empty object and make it the current object (but not set its mark property). `add` takes no arguments.

### Channels

`x`, `y`, `x2`, `y2`, `longitude`, `latitude`, `longitude2`, `latitude2`, `color`, `opacity`, `size`, `shape`, `label`, `tooltip`, `href`, `key`, `order`, `detail`, `row`, `column`

These methods set properties (channels) of the encoding property of the current object &mdash; the encoding property is added if it does not exist (or is falsy).

Note: `label` actually sets the text channel (recall that `text` is a mark method).

A channel method can take up to 3 arguments:

`tv.x(field, type, ops)`

* `field`: field property; no field property is added if `field` is `undefined` or `null`

* `type`: type property
	* `'n'`, `'o'`, `'q'`, or `'t'` can be passed instead of `'nominal'`, `'ordinal'`, `'quantitative'` or `'temporal'` respectively
	* if `type` is falsy, the type property defaults to `'q'` if `field` is used; otherwise, the type property is not set

* `ops`: object with any other properties to set, e.g.
`{aggregate: 'sum', axis: {title: 'population}, stack: normalize}`

There is also a generic `channel` method. For example, `.channel('x','dogs','q',ops)` is equivalent to `.x('dogs','q',ops)`.

### Other

`json` returns the spec as a JSON string.

`setPlot` sets the `plot` method. For example, if the function `vegalite` plots a Vega-Lite spec, we could write:

```js
tv.setPlot(function() {return vegalite(this.spec)})
```
then write code such as:

```js
tv('pets.json').point().x('cat').y('dog').plot()
```

`setPlot` must be used to set the `plot` method; setting `plot` directly (e.g. `tv.prototype.plot = someFunction`) will not work.

## Notes

* the `_obj` and `_stack` properties of a To-Vega object are the current object and stack respectively; do not modify these directly

* the `spec` property is the 'live' spec; if you modify the spec directly, do not use To-Vega methods to modify it further

* the argument of a mark method and the third argument of a channel method are shallow copied; other methods do not copy objects before adding them to the spec

* `instanceof` will not work on To-Vega objects

## Contributions

Are welcome! Open an issue or create a pull request.

## Also See

* [Altair](https://github.com/ellisonbg/altair) &mdash; Python
* [VegaLite.jl](https://github.com/fredo-dedup/VegaLite.jl) &mdash; Julia

