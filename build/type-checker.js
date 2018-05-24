"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function isArrowFunction(node) {
    return node.kind === ts.SyntaxKind.ArrowFunction;
}
function isJsxComponentDeclaration(node) {
    return node.getChildren().some(n => n.kind === ts.SyntaxKind.JsxElement);
}
function isConnectChild(node) {
    return node.parent.getFullText().includes('connect');
}
function isConnectArrowFunctionArgument(node) {
    return (isArrowFunction(node) &&
        !isJsxComponentDeclaration(node) &&
        isConnectChild(node));
}
exports.isConnectArrowFunctionArgument = isConnectArrowFunctionArgument;
function isObjectType(flags) {
    return flags === ts.TypeFlags.Object;
}
exports.isObjectType = isObjectType;
function getTypeInformationFromNode(node, typeChecker) {
    const results = [];
    function visitNode(node) {
        if (isConnectArrowFunctionArgument(node)) {
            const symbol = typeChecker.getTypeAtLocation(node).symbol;
            const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
            const returnType = type.getCallSignatures()[0].getReturnType();
            if (isObjectType(returnType.flags)) {
                const returnTypeProperties = returnType.getProperties();
                returnTypeProperties.forEach(prop => {
                    const type = typeChecker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration);
                    const name = prop.getName();
                    const typeName = typeChecker.typeToString(type);
                    results.push({ propName: name, typeName });
                });
            }
        }
        ts.forEachChild(node, visitNode);
    }
    visitNode(node);
    return results;
}
exports.getTypeInformationFromNode = getTypeInformationFromNode;
