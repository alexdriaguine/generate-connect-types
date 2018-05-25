import * as ts from 'typescript';
export interface Prop {
    propName: string;
    typeName: string;
}
export declare function isConnectArrowFunctionArgument(node: ts.Node): boolean;
export declare function isObjectType(flags: ts.TypeFlags): boolean;
export declare function getTypeInformationFromNode(node: ts.Node, typeChecker: ts.TypeChecker): Prop[];
