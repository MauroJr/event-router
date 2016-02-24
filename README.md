# event-router

Parse route strings for event emitter

## Installation

	npm install event-router --save


## Usage Example

```javascript
    'use strict';
    
	const EventRouter = require('event-router');
	let router, route;
    
    // you can use "named" route sections
    router = EventRouter.create('{user}:{action=insert|update}:{id}');
    
    router.parse('johndoe:insert:34');
    // { user: 'johndoe', action: 'insert', id: '32' }
    
    route.parse('johndoe:remove:32');
    // false
    
    // or you can use "unnamed" route sections
    router = EventRouter.create('*:insert|update:*');
    
    route = router.parse('johndoe:insert:32');
    // [ 'johndoe', 'insert', '32' ]
    
    // or you can also change the sections "delimeter"
    router = EventRouter.create({
    	route: '*/insert|update/*',
    	delimeter: '/'
    });
    
    route = router.parse('johndoe/insert/32');
    // [ 'johndoe', 'insert', '32' ]
```


#The MIT License (MIT)

Copyright (c) 2016 MauroJr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
