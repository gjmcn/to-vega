

const tv = require('to-vega')
const util = require('util')
const prt = a =>
  console.log(util.inspect(a, {showHidden: false, depth: null}));

let s = tv('myData.json')
  .layer()
    .bar().x('a').y('b','n')
    .line().x('a').y('c',undefined,{aggregate: 'sum'})
    .end()
  .desc('my plot')
  .down(...['d','e'])
  
prt(s.spec)