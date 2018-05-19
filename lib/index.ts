import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'
import {
  isConnectArrowFunctionArgument,
  isObjectType,
  getProps,
  getTypeInformationFromNode,
} from './type-checker'
import {template, insertInterfaceTemplateIntoFileContent} from './template'

const fileName = process.argv.slice(2)[0]
if (!fileName) {
  throw new Error('Need a filename!')
}
const fullFileName = path.resolve(process.cwd(), fileName)

const program = ts.createProgram([fullFileName], {
  noEmit: true,
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.Preserve,
  rootDir: process.cwd(),
})

const checker = program.getTypeChecker()

const sourceFile = program
  .getSourceFiles()
  .find(file => file.fileName === fullFileName)

const props = getTypeInformationFromNode(sourceFile, checker)

fs.readFile(fileName, (err, data) => {
  if (err) {
    throw new Error(err.message)
  }
  const newFileContent = insertInterfaceTemplateIntoFileContent(
    data.toString(),
    props,
  )

  fs.writeFile(fileName, newFileContent, err => {
    if (err) {
      throw new Error(err.message)
    } else {
      console.log('Created some props for you')
    }
  })
})
