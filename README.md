# To-Vega

**To-Vega** is a simple JavaScript library for creating [Vega-Lite](https://vega.github.io/vega-lite/) specifications. For example:

```js
tv('data/cars.json').point().x('Horsepower').y('Miles_per_Gallon').sp
```

returns the JavaScript object:

```js
{
  '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
  data: { url: 'data/cars.json' },
  mark: 'point',
  encoding: {
    x: { field: 'Horsepower', type: 'quantitative' },
    y: { field: 'Miles_per_Gallon', type: 'quantitative' }
  }
}
```

A more complex example:

```js
tv('data/stocks.csv')
  .layer()
    .line()
      .x('date','t')
      .y('price')
      .color('symbol','n')
    .rule()
      .y('price','q',{aggregate: 'mean'})
      .size({value:2})
      .color('symbol','n').sp
```

returns:

```js
{
  '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
  data: { url: 'data/stocks.csv' },
  layer: [
    {
      mark: 'line',
      encoding: {
        x: { field: 'date', type: 'temporal' },
        y: { field: 'price', type: 'quantitative' },
        color: { field: 'symbol', type: 'nominal' }
      }
    },
    {
      mark: 'rule',
      encoding: {
        y: { field: 'price', type: 'quantitative', aggregate: 'mean' },
        size: { field: { value: 2 }, type: 'quantitative' },
        color: { field: 'symbol', type: 'nominal' }
      }
    }
  ]
}
```

To-Vega makes it particularly easy to genereate a spec and set commonly-used properties. More advanced options can also be set with To-Vega or standard JavaScript can be used.

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

### Channels

Call merk before enc

###Plot


















