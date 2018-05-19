import * as ts from 'typescript'
import {flatten} from './utils'

function mapToPropArray(res: string) {
  return res
    .replace(/{|}/g, '')
    .split(';')
    .map(r => r.trim())
    .filter(r => r)
}

function isArrowFunction(node: ts.Node) {
  return node.kind === ts.SyntaxKind.ArrowFunction
}

function isJsxElement(node: ts.Node) {
  return node.getChildren().some(n => n.kind === ts.SyntaxKind.JsxElement)
}

function isConnectChild(node: ts.Node) {
  return node.parent.getFullText().includes('connect')
}

export function getProps(results: string[]) {
  return results.map(mapToPropArray).reduce(flatten, [])
}

export function isConnectArrowFunctionArgument(node: ts.Node) {
  return isArrowFunction(node) && !isJsxElement(node) && isConnectChild(node)
}

export function isObjectType(flags: ts.TypeFlags) {
  return flags === ts.TypeFlags.Object
}

export function getTypeInformationFromNode(
  node: ts.Node,
  typeChecker: ts.TypeChecker,
) {
  const results = [] as Array<string>

  function visitNode(node: ts.Node) {
    if (isConnectArrowFunctionArgument(node)) {
      const sym = typeChecker.getTypeAtLocation(node).symbol
      const type = typeChecker.getTypeOfSymbolAtLocation(
        sym,
        sym.valueDeclaration,
      )
      const returnType = type.getCallSignatures()[0].getReturnType()
      if (isObjectType(returnType.flags)) {
        results.push(typeChecker.typeToString(returnType))
      }
    }
    ts.forEachChild(node, visitNode)
  }

  visitNode(node)

  return getProps(results)
}
