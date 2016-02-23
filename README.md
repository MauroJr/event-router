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
    
    route = router('johndoe:insert:34');
    // true
    
    route.toObject();
    // { user: 'johndoe', action: 'insert', id: '32' }
    
    route.toArray();
    // [ 'johndoe', 'insert', '32' ]
    
    route('johndoe:remove:32');
    // false
    
    route.toObject();
    // false
    
    route.toArray();
    // false
    
    route('janedoe:insert:33');
    // true
    
    route.toObject();
    // { user: 'janedoe', action: 'insert', id: '33' }
    
    route.toArray();
    // [ 'janedoe', 'insert', '33' ]
    
    // you can even call toArray or toObject directly with the route string parameter
    route.toArray('janedoe:update:33');
    // [ 'janedoe', 'update', '33' ]
    
    route.toArray('janedoe:delete:33');
    // false
    
    // or you can use "unnamed" route sections
    router = EventRouter.create('*:insert|update:*');
    
    route = router('johndoe:insert:32');
    // true
    
    route.toObject();
    // { '1': 'johndoe', '2': 'insert', '3': '32' }
    
    route.toArray();
    // [ 'johndoe', 'insert', '32' ]
    
    // or you can also change the sections "delimeter"
    router = EventRouter.create({
    	route: '*/insert|update/*',
    	delimeter: '/'
    });
    
    route = router('johndoe/insert/32');
    // true
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
