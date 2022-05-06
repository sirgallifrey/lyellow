import * as ts from "typescript"
import * as CSS from "../class_names";
import { BEMDefinition, NameOrDefinition, ClassNameDefinition } from "../class_names/types";

const blocks: BEMDefinition[] = Object.values(CSS).filter(t => typeof t !== "boolean");

const file = ts.createSourceFile("class_names.ts", '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const nodes: ts.Node[] = [];

function printClassName(name: string, value: string, description?: string) {
    const constStatement = ts.factory.createPropertyDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.ConstKeyword)],
        name, undefined, undefined,
        ts.factory.createAsExpression(ts.factory.createStringLiteral(value), ts.factory.createKeywordTypeNode(ts.SyntaxKind.ConstKeyword as ts.KeywordTypeSyntaxKind))
    )
    if (description) {
        const doc = ts.factory.createJSDocComment(description)
        nodes.push(doc);
        printer.printNode(ts.EmitHint.Unspecified, doc, file)
    }
    nodes.push(constStatement)
}

function getDefinition(value: NameOrDefinition): ClassNameDefinition {
    if (typeof value === "string") {
        return { name: value };
    }
    return value;
}

function printDefinition(def: ClassNameDefinition, parentName: string = "", separator: string = "") {
    const name = `${parentName}${def.name}`;
    const value = `${parentName}${separator}${def.name}`
    printClassName(name, value, def.description);
}

blocks.forEach(block => {
    const blockDef = getDefinition(block.block);
    printDefinition(blockDef);

    if (block.elements) {
        block.elements.forEach(element => {
            const elementDef = getDefinition(element);
            printDefinition(elementDef, blockDef.name, "__")
        })
    }
    if (block.modifiers) {
        block.modifiers.forEach(modifier => {
            const modifierDef = getDefinition(modifier);
            printDefinition(modifierDef, blockDef.name, "--")
        })
    }

    console.log(nodes.map(n => printer.printNode(ts.EmitHint.Unspecified, n, file)).join("\n"));
})