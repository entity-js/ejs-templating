# EntityJS - Components

## Templating

Provides the templating component, with the default 'swig' templating engine.

### Usage

```javascript
var templating = require('ejs-templating');

templating.register(...);
templating.render(function (err, output) {
  //
}, 'html', { ... });
```
