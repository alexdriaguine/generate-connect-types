"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettier = require("prettier");
exports.template = (props) => {
    const interfaceTemplate = `
    interface ConnectProps {
      ${props.map(prop => {
        return `${prop.propName}: ${prop.typeName}\n`;
    })}
    }
  `;
    return prettier.format(interfaceTemplate);
};
function insertInterfaceTemplateIntoFileContent(fileContent, props) {
    const lines = fileContent.split('\n');
    const imports = lines.filter(l => l.includes('import') && l.includes('from'));
    const indexOfLastImport = lines.indexOf(imports[imports.length - 1]);
    const start = lines.slice(0, indexOfLastImport + 1);
    const middle = exports.template(props).split('\n');
    const end = lines.slice(indexOfLastImport + 1);
    const all = start.concat(middle).concat(end).join('\n').toString();
    return all;
}
exports.insertInterfaceTemplateIntoFileContent = insertInterfaceTemplateIntoFileContent;
