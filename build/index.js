"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
function flatten(arr) {
    return arr.reduce((a, b) => a.concat(b), []);
}
const template = (props) => `
interface ConnectProps {
  ${props.join('\n  ')}
}`;
const fileName = process.argv.slice(2)[0];
if (!fileName) {
    throw new Error('Need a filename!');
}
const fullFileName = path.resolve(process.cwd(), fileName);
const program = ts.createProgram([fullFileName], {
    noEmit: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.Preserve,
    rootDir: process.cwd(),
});
const checker = program.getTypeChecker();
const sourceFile = program
    .getSourceFiles()
    .find(file => file.fileName === fullFileName);
const results = [];
getTypeInformationFromConnectNode(sourceFile);
const mapToTypeString = re => { };
const props = flatten(results.map(r => r
    .replace('{', '') // TODO: replace this with regex
    .replace('}', '') // TODO: replace this with regex
    .split(';')
    .map(r => r.trim())
    .filter(r => r)));
fs.readFile(fileName, (err, data) => {
    if (err) {
        throw new Error(err.message);
    }
    const lines = data.toString().split('\n');
    const imports = lines.filter(l => l.includes('import') && l.includes('from'));
    const indexOfLastImport = lines.indexOf(imports[imports.length - 1]);
    const firstPart = lines.slice(0, indexOfLastImport + 1);
    const middle = template(props).split('\n');
    const end = lines.slice(indexOfLastImport + 1);
    const all = [...firstPart, ...middle, ...end].join('\n').toString();
    fs.writeFile(fileName, all, err => {
        if (err) {
            throw new Error(err.message);
        }
        else {
            console.log('Created some props for you');
        }
    });
});
/**
 *
 * @param {ts.Node} node
 */
function getTypeInformationFromConnectNode(node) {
    if (node.kind === ts.SyntaxKind.ArrowFunction &&
        node.getChildren().every(n => n.kind !== ts.SyntaxKind.JsxElement) &&
        node.parent.getFullText().includes('connect')) {
        const sym = checker.getTypeAtLocation(node).symbol;
        const type = checker.getTypeOfSymbolAtLocation(sym, sym.valueDeclaration);
        const returnType = type.getCallSignatures()[0].getReturnType();
        if (type.flags === ts.TypeFlags.Object) {
            results.push(checker.typeToString(returnType));
        }
    }
    ts.forEachChild(node, getTypeInformationFromConnectNode);
}
