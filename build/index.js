"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs = require("fs");
const type_checker_1 = require("./type-checker");
const template_1 = require("./template");
const path = require("path");
const os_1 = require("os");
function generateConnectTypes(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        let fullFileName = path.resolve(process.cwd(), filename);
        if (os_1.platform() === 'win32') {
            fullFileName = fullFileName.replace(/\\/gi, '/');
        }
        const program = ts.createProgram([fullFileName], {
            noEmit: true,
            target: ts.ScriptTarget.ES2015,
            jsx: ts.JsxEmit.Preserve,
            rootDir: process.cwd(),
        });
        const checker = program.getTypeChecker();
        const sourceFile = program
            .getSourceFiles()
            .find(file => file.fileName === fullFileName);
        const props = type_checker_1.getTypeInformationFromNode(sourceFile, checker);
        return new Promise((resolve, reject) => {
            fs.readFile(filename, (err, data) => {
                if (err) {
                    return reject(err.message);
                }
                const newFileContent = template_1.insertInterfaceTemplateIntoFileContent(data.toString(), props);
                fs.writeFile(filename, newFileContent, err => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        return resolve();
                    }
                });
            });
        });
    });
}
exports.generateConnectTypes = generateConnectTypes;
