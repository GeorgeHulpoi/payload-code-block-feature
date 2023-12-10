import { $createCodeNode, CodeHighlightNode, CodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import {
    SlashMenuOption,
    type FeatureProvider,
} from "@payloadcms/richtext-lexical";
import {
    DEPRECATED_$isGridSelection,
    $getSelection,
    $isRangeSelection,
} from "lexical";

import type { CodeBlockFeatureConfig } from "./types";

export const CodeBlockFeature = (
    config: CodeBlockFeatureConfig = {}
): FeatureProvider => {
    const { languages } = config;
    return {
        feature: () => {
            return {
                slashMenu: {
                    options: [
                        {
                            displayName: "Code Block",
                            key: "code-block",
                            options: [
                                new SlashMenuOption("code-block", {
                                    Icon: () =>
                                        import("./Icon").then(
                                            (m) => m.CodeBlockIcon
                                        ),
                                    displayName: "Code Block",
                                    keywords: ["code"],
                                    onSelect: ({ editor }) => {
                                        editor.update(() => {
                                            let selection = $getSelection();

                                            if (
                                                $isRangeSelection(selection) ||
                                                DEPRECATED_$isGridSelection(
                                                    selection
                                                )
                                            ) {
                                                if (selection.isCollapsed()) {
                                                    $setBlocksType(
                                                        selection,
                                                        () => $createCodeNode()
                                                    );
                                                } else {
                                                    const textContent =
                                                        selection.getTextContent();
                                                    const codeNode =
                                                        $createCodeNode();
                                                    selection.insertNodes([
                                                        codeNode,
                                                    ]);
                                                    selection = $getSelection();
                                                    if (
                                                        $isRangeSelection(
                                                            selection
                                                        )
                                                    )
                                                        selection.insertRawText(
                                                            textContent
                                                        );
                                                }
                                            }
                                        });
                                    },
                                }),
                            ],
                        },
                    ],
                },
                nodes: [
                    {
                        node: CodeNode,
                        type: CodeNode.getType(),
                    },
                    {
                        node: CodeHighlightNode,
                        type: CodeHighlightNode.getType(),
                    },
                ],
                plugins: [
                    {
                        Component: () =>
                            import("./plugins/Toolbar").then((m) => {
                                const toolbar = m.Toolbar;
                                return import("payload/utilities").then(
                                    (module) =>
                                        module.withMergedProps({
                                            Component: toolbar,
                                            toMergeIntoProps: {
                                                languages,
                                            },
                                        })
                                );
                            }),
                        position: "floatingAnchorElem",
                    },
                    {
                        Component: () =>
                            import("./Plugin").then((m) => m.default),
                        position: "normal",
                    },
                ],
                props: null,
            };
        },
        key: "code-block",
    };
};
