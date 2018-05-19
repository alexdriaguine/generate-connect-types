export const template = (props: string[]) => `
interface ConnectProps {
  ${props.join('\n  ')}
}`

export function insertInterfaceTemplateIntoFileContent(
  fileContent: string,
  props: Array<string>,
) {
  const lines = fileContent.split('\n')
  const imports = lines.filter(l => l.includes('import') && l.includes('from'))
  const indexOfLastImport = lines.indexOf(imports[imports.length - 1])
  const firstPart = lines.slice(0, indexOfLastImport + 1)
  const middle = template(props).split('\n')
  const end = lines.slice(indexOfLastImport + 1)
  const all = [...firstPart, ...middle, ...end].join('\n').toString()

  return all
}
