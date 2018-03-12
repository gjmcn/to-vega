"use strict";

var tv;

{
  
  let tv_new = function(data) {  
    this._sp = {};
    this._obj = this._sp;           //current object
    this._specStack = [this._obj];  //object stack for spec objects
    this._level = false;            //current level
    this._levelStack = [];          //array stack for levels (layer, hconcat, vconcat)
    this._actionStack = [];         //entries are 'spec' or 'level'
    this._depth = 0;                //current depth - spec and level add to depth
    //this._isLevel = false;          //true if most recently opened level rather than spec
    this.sp = {$schema: 'https://vega.github.io/schema/vega-lite/v2.json'};
    if (data) this._data(data);
  };

  let typeLookup = { n:'nominal', o:'ordinal', q:'quantitative', t:'temporal' };
  let expandType = t => {
    t = '' + t;
    if (t.length !== 1) return t;
    t = typeLookup[t];
    if (!t) throw new Error('invalid 1-character channel type');
    return t;
  };

  //let level = a => ['layer','hconcat','vconcat'].indexOf(a) >= 0;
  
  let simpleProps = ['description','title','width','height','name','transform',
    '$schema','background','padding','autosize','config','selection','facet','repeat'];
  let composeProps = ['layer','spec','hconcat','vconcat'];
  let markProps = ['area','bar','circle','line','point','rect','rule', 'square','text',
    'tick','geoshape'];
  let channelProps = ['x','y','x2','y2','color','opacity','size','shape','text',
    'tooltip','href','order','detail','row','column'];
   
  let proto = tv_new.prototype;

  //top-level properties
  simpleProps.map(a => proto[a] = function(x) {
    this._obj[a] = x;
    return this;
  });
  proto.data = function(d) {
    this._obj .data = (typeof d === 'string' ? {url: d} : {values: d});
    return this;
  };
  ['across','down'].map(direc => proto[direc] = function(flds) {
    this._obj .repeat = this._obj .repeat || {};
    this._obj .repeat[direc === 'across' ? 'column' : 'row'] = flds;
    return this;
  });
  proto.desc = function(d) { return this.description(d) };
  proto.projection = function(ops) {
    this._obj .projection = (typeof ops === 'string' ? {type: ops} : ops);
    return this;
  };
  proto.proj = function(ops) { return this.projection(ops) };
  proto.prop = function(p,x) {
    this._obj [p] = x;
    return this;
  }
    
  //compose
  composeProps.map(a => proto[a] = function() {
    if (a === 'spec') {
      this._obj.spec = {};
      this._obj = this._obj.spec;
      this._specStack.push(this._obj);
      this._level = false;
      this._actionStack.push('spec');  
    }
    else {
      this._obj = undefined;
      this._level = [];
      
      !!!!!!!!!!!!!!!HEREE!!!!!!!!!!!!!!!!!!!!
      REMEMBER TO CHECK UF THERE IS EVEN AN OBJ ADDED TO THE CURRENT LEVEL WHERE APPROP
        -OR IS IT BETTER TO AUTO ADD FIRST OBJ? - THEN NEED TO BE AWARE IF HAVE USED MARK - I THINK THIS IS BETTER
          -CHANGE DOCS IF GO WITH THIS!!!!!!!!!!!!!!
      
      
      
      this._levelStack.push(this._level);
      this._actionStack.push('level');
    }
    this._depth++;
    return this;
  });
  
  //next - THIS SHOULD BE ADD????
  proto.next = function() {
    if (!this._level) {
      throw new Error('Can only use next inside a level (layer, hconcat or vconcat)');
    }
    this._obj = {};
    this._level.push(this._obj);
  };
  
  //end
  proto.end = function() {
    if (this._depth === 0) throw new Error('already at top-level');
    if (this._level) {
      HOW KNOW IF SPEC OR LEVEL?
    }
    else {
      
    }
    this._depth--;
  };
  

  //marks
  markProps.map(a => proto[a] = function() {
    if (this._level) this._next();
    this._markObj.mark = a;
    this._markObj.encoding = {};
    return this;
  });
  proto.mark = function(m) {
    this[m]();
    return this;
  };
    
  //channels
  channelProps.map(a => proto[a] = function(fld, typ, ops) {
    if (!this._mark) throw new Error('call a mark function before any encoding functions');
    let channel = {};
    if (fld) {
      channel.field = fld;
      channel.type = expandType(typ || 'q');
    }
    else if (typ) channel.type = expandType(typ);  //if field omitted, no default type
    if (typeof ops === 'object') channel = {...channel, ...ops};
    this._markObj.encoding[a] = channel;
    this._enc = true;
    return this;
  });
  proto.channel = function(chn, fld, typ, ops) {
    this[chn](fld, typ, ops);
    return this;
  };

  //plot - user should overwrite this based on environment
  proto.plot = function(){};
  
  tv = data => new tv_new(data);
}

//export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = tv;
}

WRITE end() next() - to add new obj when not a mark

mark ops can open a new level with truthy arg, eg circle(1) - not nec since should do if in level, otherwise not allowed


DOCUMENT, ALWAYS ENTER NEW OBJECT WHEN ENTER LEVEL, SPEC
  -WHEN USE OR MARK?


// TO DO:
// -CHECK
// -UNIT TESTS - PUT INTO TEST FIELD OF PACKAGE.JSON
//    in node and browser

// Docs:
// -not trying to cover all possibilities - cover many and fast way to init for others
  // -use full {} notation for inner props - except for encoding
  // -is for people who know vega-lite
  //  ._ props should not be changed directly
  //  once change .spec, then its state is not what the class thinks it is
  //    -typically use all vf funcs that intend to first, then change the spec further
  //     manually as reqd
  // -sequential natures is important:  compose -> mark -> encoding
//  -poss missed some ueseful convenience funcs, but shouldn't be too many 
// -not copying anything - except when pass ops object in an encoding function - it is shallow copied since merged
// mostly test on falsy


// Future:
// -more error checking - eg that mark type valid

//test using a repeatRef for a field value

//should we be copying anything? - I think not - but poss note that do not
//  note that where use ... to merge (or copy) only get shallow copy


