import * as ts from 'typescript'
import * as fs from 'fs'
import {getTypeInformationFromNode} from './type-checker'
import {insertInterfaceTemplateIntoFileContent} from './template'
import * as path from 'path'
import {platform} from 'os'

export async function generateConnectTypes(filename: string) {
  let fullFileName = path.resolve(process.cwd(), filename)
  if (platform() === 'win32') {
    fullFileName = fullFileName.replace(/\\/gi, '/')
  }

  const program = ts.createProgram([fullFileName], {
    noEmit: true,
    target: ts.ScriptTarget.ES2015,
    jsx: ts.JsxEmit.Preserve,
    rootDir: process.cwd(),
  })

  const checker = program.getTypeChecker()

  const sourceFile = program
    .getSourceFiles()
    .find(file => file.fileName === fullFileName)

  const props = getTypeInformationFromNode(sourceFile, checker)

  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        return reject(err.message)
      }
      const newFileContent = insertInterfaceTemplateIntoFileContent(
        data.toString(),
        props,
      )

      fs.writeFile(filename, newFileContent, err => {
        if (err) {
          return reject(err.message)
        } else {
          return resolve()
        }
      })
    })
  })
}
