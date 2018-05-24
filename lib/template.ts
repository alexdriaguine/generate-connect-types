import {Prop} from './type-checker'
import * as prettier from 'prettier'

export const template = (props: Array<Prop>) => {
  const interfaceTemplate = `
    interface ConnectProps {
      ${props.map(prop => {
        return `${prop.propName}: ${prop.typeName}\n`
      })}
    }
  `

  return prettier.format(interfaceTemplate)
}

export function insertInterfaceTemplateIntoFileContent(
  fileContent: string,
  props: Array<Prop>,
) {
  const lines = fileContent.split('\n')
  const imports = lines.filter(l => l.includes('import') && l.includes('from'))
  const indexOfLastImport = lines.lastIndexOf(imports[imports.length - 1])
  const start = lines.slice(0, indexOfLastImport + 1)
  const middle = template(props).split('\n')
  const end = lines.slice(indexOfLastImport + 1)
  const all = start
    .concat(['\n']) // For a space between imports and our generated interface
    .concat(middle)
    .concat(end)
    .join('\n')
    .toString()

  return all
}
