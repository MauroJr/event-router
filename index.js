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
    return function parse(routeString) {
        if (regex.test(routeString)) {
            if (hasNamedSections) {
                return resultObject(routeString);
            }
            return resultArray(routeString);
        }
        return false;
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
    
    function resultArray(routeString) {
        return regex.exec(routeString).slice(1);
    }
    
    function resultObject(routeString) {
        const resultObj     = {},
              resultList    = resultArray(routeString);
        
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