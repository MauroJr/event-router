'use strict';

const toFactory     = require('tofactory'),
const escapeRegex   = require('escape-regex'),
const bracketsRegex = /^\{.*\}$/,
const brackets      = /[\{\}]/g,
const paramError    = new Error('"route" parameter must be a string.'),
const toString      = Object.prototype.toString;

EventRouter.create = () => EventRouter();

module.exports = Object.freeze(EventRouter);


/**
 * Parse route string to a `Array` or 'Object'.
 *
 * @param {Object or String} spec
 * @return {RegExp}
 * @api private
 */
function EventRouter(route = '') {
    const listKeys  = [];

    let hasNamedSections = false, 
        regex, str, delimeter;
    
    createRegex();

    
    /**
     * PUBLIC API
     */
    return Object.freeze({
        parse: hasNamedSections ? resultObject : resultArray
    });
    
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
        const optsList = [];
        const listStr = [];

        str.split(delimeter)
            .map((s => s.trim())

        
        str.split(delimeter).forEach((s, sidx) => {
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