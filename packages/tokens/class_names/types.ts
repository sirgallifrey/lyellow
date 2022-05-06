export interface ClassNameDefinition {
    readonly name: string,
    readonly description?: string
};

export type NameOrDefinition = string | ClassNameDefinition;

export interface BEMDefinition {
    readonly block: NameOrDefinition,
    readonly elements?: readonly NameOrDefinition[],
    readonly modifiers?: readonly NameOrDefinition[],
};
