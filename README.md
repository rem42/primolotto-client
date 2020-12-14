# primolotto-client

[![Greenkeeper badge](https://badges.greenkeeper.io/rem42/primolotto-client.svg)](https://greenkeeper.io/)

A client for primolotto using node

[![npm](https://img.shields.io/npm/v/primolotto-client.svg)](https://www.npmjs.com/package/primolotto-client)
[![npm](https://img.shields.io/npm/dt/primolotto-client.svg)](https://www.npmjs.com/package/primolotto-client)
[![install size](https://packagephobia.now.sh/badge?p=primolotto-client)](https://packagephobia.now.sh/result?p=primolotto-client)
[![Greenkeeper badge](https://badges.greenkeeper.io/rem42/primolotto-client.svg)](https://greenkeeper.io/)

## Installation 
```sh
npm install primolotto-client --save
```
## Usage
### TypeScript

```typescript
import {Kingoloto} from "kingoloto-client";

Kingoloto.init('email@email.com', 'password')
.then((client: Kingoloto) => {
    // code
});
```
