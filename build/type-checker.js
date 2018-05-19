"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const utils_1 = require("./utils");
function mapToPropArray(res) {
    return res
        .replace(/{|}/g, '')
        .split(';')
        .map(r => r.trim())
        .filter(r => r);
}
function isArrowFunction(node) {
    return node.kind === ts.SyntaxKind.ArrowFunction;
}
function isJsxElement(node) {
    return node.getChildren().some(n => n.kind === ts.SyntaxKind.JsxElement);
}
function isConnectChild(node) {
    return node.parent.getFullText().includes('connect');
}
function getProps(results) {
    return results.map(mapToPropArray).reduce(utils_1.flatten, []);
}
exports.getProps = getProps;
function isConnectArrowFunctionArgument(node) {
    return isArrowFunction(node) && !isJsxElement(node) && isConnectChild(node);
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
            const sym = typeChecker.getTypeAtLocation(node).symbol;
            const type = typeChecker.getTypeOfSymbolAtLocation(sym, sym.valueDeclaration);
            const returnType = type.getCallSignatures()[0].getReturnType();
            if (isObjectType(returnType.flags)) {
                results.push(typeChecker.typeToString(returnType));
            }
        }
        ts.forEachChild(node, visitNode);
    }
    visitNode(node);
    return getProps(results);
}
exports.getTypeInformationFromNode = getTypeInformationFromNode;
