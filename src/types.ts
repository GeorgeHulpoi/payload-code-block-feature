export interface CodeBlockFeatureConfig {
    languages?: (defaultLanguages: [string, string][]) => [string, string][];
}
