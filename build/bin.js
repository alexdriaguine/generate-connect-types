#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const filename = process.argv.slice(2)[0];
if (!filename) {
    throw new Error('Need a filename!');
}
_1.generateConnectTypes(filename)
    .then(() => console.log('Generated some props!'))
    .catch(() => console.log('could not generate props!'));
