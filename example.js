
//print object to full depth
const util = require('util');
const prt = a =>
  console.log(util.inspect(a, {showHidden: false, depth: null}));

const tv = require('to-vega');

let s = tv('data/stocks.csv')
  .line()
    .x('date', 't', {axis: {'format': '%Y'}})
    .y('price')
    .color('symbol', 'n')

prt(s.spec);
