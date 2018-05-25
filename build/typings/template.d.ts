import { Prop } from './type-checker';
export declare const template: (props: Prop[]) => string;
export declare function insertInterfaceTemplateIntoFileContent(fileContent: string, props: Array<Prop>): string;
