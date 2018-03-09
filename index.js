"use strict";

var tv;

{
  
  let tv_new = function(data) {  
    this._obj  = {};
    this._objList = [this._obj];
    this._actList = ['top'];
    this._depth = 0;
    this.sp = {$schema: 'https://vega.github.io/schema/vega-lite/v2.json'};
    if (data) this._data(data);
  };

  let typeLookup = {
    n: 'nominal',
    o: 'ordinal',
    q: 'quantitative',
    t: 'temporal'
  };

  let expandType = t => {
    t = '' + t;
    if (t.length !== 1) return t;
    t = typeLookup[t];
    if (!t) throw new Error('invalid 1-character channel type');
    return t;
  };

  let level = a => ['layer','hconcat','vconcat'].indexOf(a) >= 0;
  
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
    this._obj [a] = x;
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
      this._obj = {};
      this._objList.push(this._obj);
    }
    this._actList.push(a);
    this._depth++;
    return this;
  });
  
  //marks
  markProps.map(a => proto[a] = function() {
    let isLevel = level(this._actList.slice(-1)[0]);
    if (!isLevel) {
      throw new Error('must be in layer, vconcat, or hconcat to use multiple marks');
    }
    if (level) {
      !!!!!!!!!!!!HERE: PUSH TO ACTLIST LIST, SET OBJ TO {}, PUSH TO OBJLIST
    }
    
???????SHOULD HAVE FUNC TO UPDATE STATE? - ADD TO ACTLIST, NEW OBJ, PUSH TO OBJLIST    

USE .sp for opening level and eg res() for get spec from function
      
      
      
      this._markObj = {};
      this.sp[this._compose].push(this._markObj);
    }
    this._markObj.mark = a;
    this._markObj.encoding = {};
    this._mark = true;
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

WRITE  spec() and end()



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


