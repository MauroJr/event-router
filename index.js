'use strict';
const toFactory     = require('tofactory'),
      escapeRegex   = require('escape-regex'),
      bracketsRegex = /^\{.*\}$/,
      brackets      = /[\{\}]/g,
      paramError    = new Error('"route" parameter must be a string.'),
      toString      = Object.prototype.toString;

module.exports = toFactory(EventRouter);

/**
 * Parse route string to a `Array` or 'Object'.
 *
 * @param {Object or String} spec
 * @return {RegExp}
 * @api private
 */
function EventRouter(spec) {
    let regex, str, delimeter, _routeString;
    
    const listKeys  = [];
    
    init();
    
    /**
     * PUBLIC API
     */
    parse.toArray           = toArray;
    parse.toObject          = toObject;
    parse.hasNamedSections  = hasNamedSections;
    return parse;
    
    function init() {
        if (toString.call(spec) === '[object Object]') {
            str = spec.route;
            delimeter = spec.delimeter;
        } else {
            str = spec;
        }
        
        if (typeof str !== 'string' || str instanceof RegExp) throw paramError;
        
        delimeter = delimeter || ':';
        
        regex = createRegex();
    }
    
    function parse(str) {
        _routeString = str || _routeString;
        return regex.test(_routeString);
    }
    
    function toArray(routeString) {
        if (parse(routeString)) return regex.exec(_routeString).slice(1);
        return false;
    }
    
    function hasNamedSections() {
        return bracketsRegex.test(_routeString);
    }
    
    function toObject(routeString) {
        const resultObj = {},
              resultList = toArray(routeString);
        
        if (resultList) {
            listKeys.forEach(function (key, i) {
                resultObj[key] = resultList[i];
            });
            
            return resultObj;
        }
        return false;
    }
    
    function createRegex() {
        const optsList  = [],
              listStr   = [];
        
        str.split(delimeter).forEach(function (s, sidx) {
            let opts;
            
            s = s.trim();
            listStr[sidx] = [];
            
            if (bracketsRegex.test(s)) {
                let route   = s.split('=');
                
                listKeys[sidx] = route[0].trim().replace(brackets, '');
                opts = route[1] ? route[1].trim().replace(brackets, '') : '*';    
            } else {
                opts = s;
                listKeys[sidx] = sidx + '';
            }

            opts.split('|').forEach(function (o, i) {
                listStr[sidx][i] = escapeRegex(o).replace(/\\\*/g, '(.+)');
            });
        });
        
        listStr.forEach(function (list, i) {
            let opts = list.join('|');
            
            if (list.length > 1) opts = '(' + opts + ')';
            optsList[i] = opts; 
        });
        
        return new RegExp(`^${optsList.join(delimeter)}$`);
    }
}