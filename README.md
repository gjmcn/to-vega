# To-Vega

**To-Vega** is a simple JavaScript library for creating [Vega-Lite](https://vega.github.io/vega-lite/) specifications. For example:

```js
tv('pets.json').point().x('cat').y('dog').spec
```

returns the object:

```js
{
  '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
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

See !!OBSERVABLE LINK HERE WHEN DONE!! for a hands-on introduction.

## Install/Load

To-Vega is a Node.js module:

* install: `npm --save install to-vega`.
* load: `const tv = require('to-vega')`

To use To-Vega in a browser, use e.g. Browserify or load `index.js` in a `<script>` tag. When `<script>` is used, a global variable `tv` is created.

## Usage

### Creating a Spec

Assuming To-Vega has been loaded as above, create a spec with `tv(data)`. If `data` is a string, it is used as the `data.url` property of the spec, otherwise it is used as the `data.values` property. If `data` is omitted, no data property is added to the spec.

`tv` returns a To-Vega object; the `spec` property of the object contains the actual spec.

In the docs below, the term 'current object' refers to the object that we are currently adding properties to &mdash; our current location in the spec. When a spec is first created, the top-level object is the current object.


## Methods

### Basic

The following methods set the corresponding property of the current object:

`description` `title` `width` `height` `name` `transform` `$schema` `background` `padding` `autosize` `config` `selection` `facet` `repeat`

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

`hconcat` `vconcat` `level`

These methods set the property of the same name (on the current object) to an array, add an empty object to the array and make it the current object.

The `open` method is similar, but does not add an array: `open` sets the spec property (of the current object) to an empty object and makes it the current object.

`hconcat`, `vconcat`, `level` and `open` take no arguments.

Call `.end` to exit an array or object:

* if inside a 'composition array' (created by `hconcat`, `vconcat` or `level`), `end` closes the current object (the array entry) and closes the array

* if inside an inner spec object (created with `open`), `end` closes the object

* otherwise, `end` throws an error


### Marks

`area` `bar` `circle` `line` `point` `rect` `rule`  `square` `text`  `tick` `geoshape`

If the current object is the top-level object or an inner spec object (created with `open`), mark methods set the mark property to the name of the method.

Inside a composition array, mark methods set the mark property if it does not exist (or is falsy). However, if the mark property already exists (and is truthy), mark methods add a new object to the composition array, make this the current object and set its mark property.

Use `add` inside a composition array to add an empty object and make it the current object (but not set its mark property).

Mark methods and `add` take no arguments. The exception is the generic `mark` method:  `.mark('bar')` is equivalent to `.bar()`.

### Channels

 `x` `y` `x2` `y2` `color` `opacity` `size` `shape` `text` `tooltip` `href` `order` `detail` `row` `column`

These methods set properties of the encoding property of the current object &mdash; the encoding property is added if it does not exist (or is falsy). A channel method can take up to 3 arguments:

`tv.x(field, type, ops)`

* `field`: field property; no field property is added if this is falsy

* `type`: type property
	* `'n'`, `'o'`, `'q'`, or `'t'` can be passed instead of `'nominal'`, `'ordinal'`, `'quantitative'` or `'temporal'` respectively
	* `'q'` is used by default if `field` is truthy
	* no type property is added if `field` and `type` are both falsy

* `ops`: object with any other properties to set, e.g.
`{aggregate: 'sum', axis: {title: 'population}, stack: normalize}`

There is also a generic `channel` method. For example, `.channel('x','dogs','q',ops)` is equivalent to `.x('dogs','q',ops)`.

### Other

`json` returns the spec as a JSON string.

## Notes

* the `_obj` and `_stack` properties of a To-Vega object are the current object and stack respectively; do not modify these directly

* the `spec` property is the 'live' spec; if you modify the spec directly, do not use To-Vega methods to modify it further

* the third argument to a channel method is shallow copied; other methods do not copy objects before adding them to the spec

* `instanceof` will not work on To-Vega objects

## Contributions

Are welcome!

## Also See

* [Altair](https://github.com/ellisonbg/altair]) &mdash; Python
* [VegaLite.jl](https://github.com/fredo-dedup/VegaLite.jl) &mdash; Julia

