#!/usr/bin/env node

import { generateConnectTypes } from ".";



const filename = process.argv.slice(2)[0]
if (!filename) {
  throw new Error('Need a filename!')
}


generateConnectTypes(filename)
  .then(() => console.log('Generated some props!'))
  .catch(() => console.log('could not generate props!'))

