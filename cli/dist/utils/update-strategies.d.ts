export interface UpdateStrategy {
    name: string;
    description: string;
    updateComponent: (componentPath: string, newContent: string) => Promise<boolean>;
}
export declare const UPDATE_STRATEGIES: Record<string, UpdateStrategy>;
export declare function updateComponentWithStrategy(componentPath: string, newContent: string, strategy: UpdateStrategy): Promise<{
    updated: boolean;
    message?: string;
}>;
//# sourceMappingURL=update-strategies.d.ts.map