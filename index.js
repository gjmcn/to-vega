"use strict";

let tv;
{
  
  //helpers
  const typeLookup = { n:'nominal', o:'ordinal', q:'quantitative', t:'temporal' };
  const expandType = t => {
    t = '' + t;
    if (t.length !== 1) return t;
    t = typeLookup[t];
    if (!t) throw new Error('invalid 1-character channel type');
    return t;
  };
  const isEmpty = ar => ar.length === 0;
  const last = ar => ar[ar.length - 1];

  //constructor
  const tv_new = function(data) {
    this.spec = {$schema: 'https://vega.github.io/schema/vega-lite/v2.json'};
    this._obj = this.spec;  //current object
    this._stack = [];       //currently open composition arrays and inner spec objects
    if (data) this.data(data);
  };
  const proto = tv_new.prototype;
  tv = data => new tv_new(data);  //wrap constructor so 'new' not required

  //groups of method names
  const props = {
    basic: ['description','title','width','height','name','transform', '$schema',
      'background','padding','autosize','config','selection','facet','repeat'],
    compose: ['layer','hconcat','vconcat'],
    mark: ['area','bar','circle','line','point','rect','rule', 'square','text',
      'tick','geoshape'],
    channel: ['x','y','x2','y2','color','opacity','size','shape','text',
      'tooltip','href','order','detail','row','column']
  };

  //basic
  props.basic.forEach(a => proto[a] = function(x) {
    this._obj[a] = x;
    return this;
  });
  proto.data = function(d) {
    this._obj.data = (typeof d === 'string' ? {url: d} : {values: d});
    return this;
  };
  ['across','down'].forEach(direc => proto[direc] = function(...flds) {
    this._obj.repeat = this._obj.repeat || {};
    this._obj.repeat[direc === 'across' ? 'column' : 'row'] = flds;
    return this;
  });
  proto.desc = function(d) { return this.description(d) };
  proto.projection = function(ops) {
    this._obj.projection = (typeof ops === 'string' ? {type: ops} : ops);
    return this;
  };
  proto.proj = function(ops) { return this.projection(ops) };
  proto.prop = function(p,x) {
    this._obj[p] = x;
    return this;
  };
    
  //compose
  props.compose.forEach(a => proto[a] = function() {
    this._obj[a] = [];
    this._stack.push(this._obj[a]);
    this._obj = {};
    last(this._stack).push(this._obj);
    return this;
  });

  //open inner spec
  proto.open = function() {
    this._obj.spec = {};
    this._obj = this._obj.spec;
    this._stack.push(this._obj);
    return this;
  };
   
  //add
  proto.add = function() {
    if (!Array.isArray(last(this._stack))) throw new Error('not inside a composition array');
    this._obj = {};
    last(this._stack).push(this._obj);
    return this;
  };

  //marks
  props.mark.forEach(a => proto[a] = function() {
    if (Array.isArray(last(this._stack)) && this._obj.mark) {
      this._obj = {};
      last(this._stack).push(this._obj);
    }
    this._obj.mark = a;
    return this;
  });
  proto.mark = function(m) { return this[m]() };

  //end
  proto.end = function() {
    if (isEmpty(this._stack)) throw new Error('already at top-level');
    this._stack.pop();
    if (isEmpty(this._stack)) this._obj = this.spec;
    else {
      this._obj = last(this._stack);
      if (Array.isArray(this._obj)) this._obj = this._obj[this._obj.length-1];
    }
    return this;
  };
    
  //channels
  props.channel.forEach(a => proto[a] = function(fld, typ, ops) {
    let channel = {};
    if (fld) {
      channel.field = fld;
      channel.type = expandType(typ || 'q');
    }
    else if (typ) channel.type = expandType(typ);  //if field omitted, no default type
    if (typeof ops === 'object') channel = {...channel, ...ops};
    if (!this._obj.encoding) this._obj.encoding = {};
    this._obj.encoding[a] = channel;
    return this;
  });
  proto.channel = function(chn, fld, typ, ops) {
    return this[chn](fld, typ, ops);
  };

  //JSON
  proto.json = function() { return JSON.stringify(this.spec) };
  
  //plot
  proto.plot = function(...arg) { return this.plotFunc(...arg) };
  tv.setPlot = f => proto.plotFunc = f;  
    
  //export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = tv;
  }
  
}





