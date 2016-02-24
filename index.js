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
    let hasNamedSections = false, 
        regex, str, delimeter;
    
    const listKeys  = [];
    
    init();
    
    /**
     * PUBLIC API
     */
    if (hasNamedSections) {
        return {
            parse: resultObject
        };
    }
    return {
        parse: resultArray
    };
    
    function init() {
        
        if (toString.call(spec) === '[object Object]') {
            str = spec.route;
            delimeter = spec.delimeter;
        } else {
            str = spec;
        }
        
        if (typeof str !== 'string' || str instanceof RegExp) throw paramError;
        
        delimeter = delimeter || ':';
        
        createRegex();
    }
    
    function resultArray(route) {
        return regex.test(route) ? regex.exec(route).slice(1) : false;
    }
    
    function resultObject(route) {
        const resultObj     = Object.create(null),
              resultList    = resultArray(route);
        
        if (resultList === false) return false;
        
        listKeys.forEach(function (key, i) {
            resultObj[key] = resultList[i];
        });
        
        return resultObj;
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
                
                hasNamedSections = true;
                
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
        
        regex = new RegExp(`^${optsList.join(delimeter)}$`);
    }
}