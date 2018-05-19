import * as fs from 'fs'
import {exec} from 'child_process'
import {template, connectedProps, expectedInterface} from './assets/template';

describe('generate-connet-types', async () => {
  beforeEach(() => {
    return new Promise((res, rej) => {
      fs.writeFile(
        'tests/assets/component.tsx',
        template,
        err => (err ? rej(err) : res()),
      )
    })
  })

  it('throw when not supplied a fileName', done => {
    exec('node build/index.js', err => {
      expect(err).toBeTruthy()
      done()
    })
  })

  it('works when supplied a fileName', done => {
    exec('node build/index.js tests/assets/component.tsx', err => {
      expect(err).toBeFalsy()
      done()
    })
  })

  it('injects a ConnectedProps into the file', done => {
    exec('node build/index.js tests/assets/component.tsx', err => {
      expect(err).toBeFalsy()
      const content = fs.readFile('tests/assets/component.tsx', (err, data) => {
        const fileContents = data.toString()
        expect(fileContents.includes('interface ConnectProps')).toBe(true)
        connectedProps.forEach(prop => {
          expect(fileContents.includes(prop.name)).toBe(true)
          expect(fileContents.includes(prop.value.toString())).toBe(true)
          expect(fileContents.includes(expectedInterface)).toBe(true)
        })
        done()
      })
    })
  })
})
