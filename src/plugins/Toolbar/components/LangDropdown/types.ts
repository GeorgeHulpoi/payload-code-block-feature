import type { CodeNode } from "@lexical/code";
import type { LexicalEditor } from "lexical";
import type { CodeBlockFeatureConfig } from "../../../../types";

export interface LangDropdownProps
    extends Pick<CodeBlockFeatureConfig, "languages"> {
    editor: LexicalEditor;
    codeNode?: CodeNode;
}
