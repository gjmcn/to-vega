# To-Vega


# CHANGES (or at least, planned changes)!!

-MARK ADDS OBJECT {} - IF COMPOSING
-LAYER, H/RCONCAT OPEN LEVEL
-.END CLOSES LEVEL
-ALL METHODS SET ON CURRENT LEVEL TO CURRENT LEVEL
-no checking noew if have set mark before enc etc
-no spec until ask for it - prob not that difficult but for now
only construct stack when ask for it?




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

To use To-Vega in a browser, use Browserify or load `index.js` in a `<script>` tag. When `<script>` is used, a global variable `tv` is created.

## Usage

### Create a Spec

Assuming To-Vega has been loaded as above, create a spec with `tv(data)`. If `data` is a string, it is used as the `data.url` property of the spec, otherwise it is used as the `data.values` property. If `data` is omitted, no data property is added to the spec.

`tv` returns a To-Vega object; the `sp` property of the object contains the actual spec.

### Methods

### Basic

The following methods set the corresponding top-level property of the spec:

`description` `title` `width` `height` `name` `transform` `$schema` `background` `padding` `autosize` `config` `selection` `facet` `repeat`

E.g. `tv.width(300)` or `tv.selection({brush: {type: 'interval'}})`

The following methods have slightly more complex behavior:

* `across`, `down`: set the column and row property respectively of repeat; the top-level repeat property is created if necessary

* `data`: sets the top-level data property; interprets its argument in the same way as `tv` &mdash; `tv` is typically used to set the data property

* `projection`, `proj`: set the top-level projection property to the argument unless it is a string, in which case the projection property is set to `{type: theString}`

* `prop`: set a top level property, e.g. `tv.prop('width',300)` is equivalent to `tv.width(300)`; the property name need not appear in the above list

* `desc`: shorthand for `description`


### Compose

`hconcat` `vconcat` `level`

These methods create a top-level property of the same name and assign an empty array to it mdash; these methods do not take an argument. When a mark method is called (see below), a new object is pushed onto the array; this object has a mark property (set to the appropriate value) and an encoding property set to an empty object. Channel methods (see below) set properties of the most recently added encoding object.

The `spec` method (no arguments) creates a top-level spec object &mdash; not an array. Mark and channel methods can are used to set properties of the object. When no compose method is used, mark methods set the top-level mark property; channel methods set properties of the top-level encoding object.

Only a single mark method can be used unless `hconcat`, `vconcat` or `level` is used.
Furthermore, compose methods (including `spec`) throw an error if a mark or channel method has already been called.

### Marks

`area` `bar` `circle` `line` `point` `rect` `rule`  `square` `text`  `tick` `geoshape`

These methods set the 'current' mark property &mdash; see the compose methods for details. Mark methods take no arguments.

There is also a generic `mark` method. For example, `tv.mark('bar')` is equivalent to `tv.bar()`.


### Channels

 `x` `y` `x2` `y2` `color` `opacity` `size` `shape` `text` `tooltip` `href` `order` `detail` `row` `column`

These methods set properties of the 'current' encoding object &mdash; see the compose methods for details. A channel method can take up to 3 arguments:

`tv.x(field, type, ops)`

* `field`: field property; no field property is added if this is falsy

* `type`: type property;
	* `'n'`, `'o'`, `'q'`, or `'t'` can be passed instead of `'nominal'`, `'ordinal'`, `'quantitative'` or `'temporal'` respectively
	* `'q'` is used by default if `field` is truthy
	* no field property is added if `field` and `type` are both falsy

* `ops`: object with any other properties to set, e.g.
`{aggregate: 'sum', axis: {title: 'population}, stack: normalize}`


Channel methods throw an error if no mark method has been called.

There is also a generic `channel` method. For example, `tv.bar().channel('x','q',ops)` is equivalent to `tv.bar().x('q',ops)`.


###Plot


















