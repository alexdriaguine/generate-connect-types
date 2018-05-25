import * as fs from 'fs'
import {exec} from 'child_process'
import {
  template,
  connectedProps,
  expectedInterface,
  templateInferred,
} from './assets/template'

const writeTemplate = (path: string, template: string) =>
  new Promise((res, rej) =>
    fs.writeFile(path, template, err => (err ? rej(err) : res())),
  )

const interfaceSubString = 'interface ConnectProps'

describe('generate-connet-types', async () => {
  it('throw when not supplied a fileName', done => {
    exec('node build/bin.js', err => {
      expect(err).toBeTruthy()
      done()
    })
  })
  describe('state is implicityly typed in callback to connect from own wrapper function', () => {
    beforeEach(() =>
      writeTemplate('tests/assets/component-inferred.tsx', templateInferred))

    it('injects a ConnectedProps into the file', done => {
      exec('node build/bin.js tests/assets/component-inferred.tsx', err => {
        expect(err).toBeFalsy()
        const content = fs.readFile(
          'tests/assets/component-inferred.tsx',
          (err, data) => {
            const fileContents = data.toString()
            expect(fileContents.includes(interfaceSubString)).toBe(true)
            connectedProps.forEach(prop => {
              expect(fileContents.includes(prop.name)).toBe(true)
              expect(fileContents.includes(prop.value.toString())).toBe(true)
            })
            done()
          },
        )
      })
    })
  })
  describe('state is explicitly typed in callback to connect', () => {
    beforeEach(() => writeTemplate('tests/assets/component.tsx', template))

    it('works when supplied a fileName', done => {
      exec('node build/bin.js tests/assets/component.tsx', err => {
        expect(err).toBeFalsy()
        done()
      })
    })

    it('injects a ConnectedProps into the file', done => {
      exec('node build/bin.js tests/assets/component.tsx', err => {
        expect(err).toBeFalsy()
        const content = fs.readFile(
          'tests/assets/component.tsx',
          (err, data) => {
            const fileContents = data.toString()
            expect(fileContents.includes('interface ConnectProps')).toBe(true)
            connectedProps.forEach(prop => {
              expect(fileContents.includes(prop.name)).toBe(true)
              expect(fileContents.includes(prop.value.toString())).toBe(true)
            })
            done()
          },
        )
      })
    })
  })
})
