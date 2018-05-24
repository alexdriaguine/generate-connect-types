#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const type_checker_1 = require("./type-checker");
const template_1 = require("./template");
const os_1 = require("os");
const fileName = process.argv.slice(2)[0];
if (!fileName) {
    throw new Error('Need a filename!');
}
let fullFileName = path.resolve(process.cwd(), fileName);
if (os_1.platform() === 'win32') {
    fullFileName = fullFileName.replace(/\\/gi, '/');
}
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
const props = type_checker_1.getTypeInformationFromNode(sourceFile, checker);
fs.readFile(fileName, (err, data) => {
    if (err) {
        throw new Error(err.message);
    }
    const newFileContent = template_1.insertInterfaceTemplateIntoFileContent(data.toString(), props);
    fs.writeFile(fileName, newFileContent, err => {
        if (err) {
            throw new Error(err.message);
        }
        else {
            console.log('Created some props for you');
        }
    });
});
