# To-Vega

**To-Vega** is a simple JavaScript library for creating [Vega-Lite](https://vega.github.io/vega-lite/) specifications. For example:

```js
tv('pets.json').point().x('cat').y('dog').sp
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

To-Vega makes it particularly easy to genereate a spec and set commonly used properties. More advanced options can also be set with To-Vega or alternatively, standard JavaScript can be used.

Typically, it is easy to add a `plot` method to the library (the details depend on the context) allowing for code such as:

```js
tv('pets.json').point().x('cat').y('dog').plot()
```

See !!!!!!!!!!OBSERVABLE LINK!!!!!!!! for a hands-on introduction.

## Install/Load

To-Vega is a Node.js module:

* install: `npm --save install to-vega`.
* load: `let tv = require('to-vega')`

To use To-Vega in a browser, use e.g. Browserify or load `index.js` in a `<script>` tag. When `<script>` is used, a global variable `tv` is created.

## Usage

### Creating a Spec

Assuming To-Vega has been loaded as above, create a spec with `tv(data)`. If `data` is a string, it is used as the `data.url` property of the spec, otherwise it is used as the `data.values` property. If `data` is omitted, no data property is added to the spec.

`tv` returns a To-Vega object; the `sp` property of the object contains the actual spec.

When writing a spec in JSON, we can think of the object that we are currently adding properties to as the 'currrent object' &mdash; our current location in the spec. Creating specs with To-Vega is similar to writing JSON (but with much less boilerplate) and this idea of the 'current object' is useful. Note that the current object is the top-level object unless `hconcat`, `vconcat`, `level` or `spec` have been used (these are described below).

## Methods

### Basic

The following methods set the corresponding property of the current object:

`description` `title` `width` `height` `name` `transform` `$schema` `background` `padding` `autosize` `config` `selection` `facet` `repeat`

E.g. `tv.width(300)` or `tv.selection({brush: {type: 'interval'}})`

The following methods have slightly more complex behavior:

* `across`, `down`: set the column and row property respectively of the repeat property of the current object; the repeat property is created if it does not exist

* `data`: set the data property of the current object; interprets its argument in the same way as `tv`

* `projection`, `proj`: set the projection property of the current object: if passed a string, the projection property is set to `{type: theString}`, otherwise the projection property is set to the argument

* `desc`: set the description property of the current object

* `prop`: set a property of the current object, e.g. `.prop('width',300)` is equivalent to `.width(300)`; the property name need not appear in the above list


### Compose

`hconcat` `vconcat` `level`

These methods take no argument; they add a property of the same name to the current object and assign an empty array to it. At this point, there is no current object so we typically call a mark method or `add` to add an object to the array; the added object becomes the current object.

The `spec` method (no arguments) adds a spec property to the current object; the property is an empty object which becomes the current object.

Call `.end` to exit an array or object:

* if inside a 'composition array' (created by `hconcat`, `vconcat` or `level`), `end` closes the current object  if there is one (i.e. the array entry created by a mark method or `add`) and closes the array

* if inside an object created with `spec` spec property, `end` closes the object

* otherwise, `end` throws an error


### Marks

`area` `bar` `circle` `line` `point` `rect` `rule`  `square` `text`  `tick` `geoshape`

If the current object is the top level object or an object created by `spec`, mark methods add a mark property and set it to the name of the method.

Inside a composition array, mark objects add a new object to the array, set this to the current object and add (and set) a mark property. Use `add` inside a composition array to add an empty object (no mark property) to the array.

Mark methods take no arguments. The exception is the generic `mark` method &mdash e.g. `.mark('bar')` is equivalent to `.bar()`.

### Channels

 `x` `y` `x2` `y2` `color` `opacity` `size` `shape` `text` `tooltip` `href` `order` `detail` `row` `column`

These methods set properties of the encoding property of the current object &mdash; the encoding property is added if it does not exist. A channel method can take up to 3 arguments:

`tv.x(field, type, ops)`

* `field`: field property; no field property is added if this is falsy

* `type`: type property;
	* `'n'`, `'o'`, `'q'`, or `'t'` can be passed instead of `'nominal'`, `'ordinal'`, `'quantitative'` or `'temporal'` respectively
	* `'q'` is used by default if `field` is truthy
	* no field property is added if `field` and `type` are both falsy

* `ops`: object with any other properties to set, e.g.
`{aggregate: 'sum', axis: {title: 'population}, stack: normalize}`

There is also a generic `channel` method. For example, `.channel('x','q',ops)` is equivalent to `.x('q',ops)`.



