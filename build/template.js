"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = (props) => `
interface ConnectProps {
  ${props.join('\n  ')}
}`;
function insertInterfaceTemplateIntoFileContent(fileContent, props) {
    const lines = fileContent.split('\n');
    const imports = lines.filter(l => l.includes('import') && l.includes('from'));
    const indexOfLastImport = lines.indexOf(imports[imports.length - 1]);
    const firstPart = lines.slice(0, indexOfLastImport + 1);
    const middle = exports.template(props).split('\n');
    const end = lines.slice(indexOfLastImport + 1);
    const all = [...firstPart, ...middle, ...end].join('\n').toString();
    return all;
}
exports.insertInterfaceTemplateIntoFileContent = insertInterfaceTemplateIntoFileContent;
