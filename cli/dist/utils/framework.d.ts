export interface FrameworkConfig {
    name: string;
    dependencies: string[];
    devDependencies: string[];
    configFiles: {
        tailwind: string;
        postcss: string;
        components: string;
    };
    setupFiles: {
        globals: string;
        utils: string;
    };
    aliases: {
        components: string;
        utils: string;
    };
}
export declare function detectFramework(targetDir: string): Promise<string>;
export declare function getFrameworkConfig(framework: string): FrameworkConfig;
//# sourceMappingURL=framework.d.ts.map