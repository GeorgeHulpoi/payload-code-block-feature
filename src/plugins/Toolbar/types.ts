import { CodeBlockFeatureConfig } from "../../types";

export interface Position {
    top: string;
    right: string;
}

export interface ToolbarProps
    extends Pick<CodeBlockFeatureConfig, "languages"> {
    anchorElem: HTMLElement;
}
