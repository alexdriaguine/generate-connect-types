import * as ts from 'typescript'

export interface Prop {
  propName: string
  typeName: string
}

function isArrowFunction(node: ts.Node) {
  return node.kind === ts.SyntaxKind.ArrowFunction
}

function isJsxComponentDeclaration(node: ts.Node) {
  return node.getChildren().some(n => n.kind === ts.SyntaxKind.JsxElement)
}

function isConnectChild(node: ts.Node) {
  return node.parent.getFullText().includes('connect')
}

export function isConnectArrowFunctionArgument(node: ts.Node) {
  return (
    isArrowFunction(node) &&
    !isJsxComponentDeclaration(node) &&
    isConnectChild(node)
  )
}

export function isObjectType(flags: ts.TypeFlags) {
  return flags === ts.TypeFlags.Object
}

export function getTypeInformationFromNode(
  node: ts.Node,
  typeChecker: ts.TypeChecker,
) {
  const results = [] as Array<Prop>

  function visitNode(node: ts.Node) {
    if (isConnectArrowFunctionArgument(node)) {
      const symbol = typeChecker.getTypeAtLocation(node).symbol
      const type = typeChecker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration,
      )
      const returnType = type.getCallSignatures()[0].getReturnType()
      if (isObjectType(returnType.flags)) {
        const returnTypeProperties = returnType.getProperties()
        returnTypeProperties.forEach(prop => {
          const type = typeChecker.getTypeOfSymbolAtLocation(
            prop,
            prop.valueDeclaration,
          )
          const name = prop.getName()
          const typeName = typeChecker.typeToString(type)
          results.push({propName: name, typeName})
        })
      }
    }
    ts.forEachChild(node, visitNode)
  }

  visitNode(node)

  return results
}
