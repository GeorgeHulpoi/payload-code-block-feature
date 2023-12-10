"use client";

import { $isCodeNode, CodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeFromDOMNode, $getRoot } from "lexical";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { $getChildrenRecursively } from "../../utils/getChildrenRecursively";
import { useDebounce } from "../../utils/useDebounce";
import { CopyButton } from "./components/CopyButton";
import { LangDropdown } from "./components/LangDropdown";
import type { Position, ToolbarProps } from "./types";

import "../../styles/Toolbar.css";

const CODE_PADDING = 8;

export const Toolbar: React.FC<ToolbarProps> = (props) => {
    const { anchorElem = document.body, languages } = props;

    const [editor] = useLexicalComposerContext();

    const [position, setPosition] = useState<Position>({
        right: "0",
        top: "0",
    });
    const codeNodesSet = useRef<Set<string>>(new Set());
    const [show, setShow] = useState<boolean>(false);
    const [codeNode, setCodeNode] = useState<CodeNode | null>(null);
    const [shouldListenMouseMove, setShouldListenMouseMove] =
        useState<boolean>(false);

    const debouncedOnMouseMove = useDebounce(
        (event: MouseEvent) => {
            const { codeDOMNode, isOutside } = getMouseInfo(event);

            if (isOutside) {
                setShow(false);
                return;
            }

            if (!codeDOMNode) {
                return;
            }

            let codeNode: CodeNode | null = null;

            editor.update(() => {
                const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode);

                if ($isCodeNode(maybeCodeNode)) {
                    codeNode = maybeCodeNode;
                }
            });

            setCodeNode(codeNode);

            if (codeNode) {
                const { y: editorElemY, right: editorElemRight } =
                    anchorElem.getBoundingClientRect();
                const { y, right } = codeDOMNode.getBoundingClientRect();
                setShow(true);
                setPosition({
                    right: `${editorElemRight - right + CODE_PADDING}px`,
                    top: `${y - editorElemY}px`,
                });
            }
        },
        50,
        300
    );

    useEffect(() => {
        if (!shouldListenMouseMove) {
            return;
        }

        document.addEventListener("mousemove", debouncedOnMouseMove);

        return () => {
            setShow(false);
            debouncedOnMouseMove.cancel();
            document.removeEventListener("mousemove", debouncedOnMouseMove);
        };
    }, [shouldListenMouseMove, debouncedOnMouseMove]);

    useEffect(() => {
        editor.getEditorState().read(() => {
            for (const node of $getChildrenRecursively($getRoot())) {
                if ($isCodeNode(node)) {
                    codeNodesSet.current.add(node.getKey());
                    setShouldListenMouseMove(codeNodesSet.current.size > 0);
                }
            }
        });
    }, []);

    editor.registerMutationListener(CodeNode, (mutations) => {
        editor.getEditorState().read(() => {
            mutations.forEach((type, key) => {
                switch (type) {
                    case "created":
                        codeNodesSet.current.add(key);
                        setShouldListenMouseMove(codeNodesSet.current.size > 0);
                        break;

                    case "destroyed":
                        codeNodesSet.current.delete(key);
                        setShouldListenMouseMove(codeNodesSet.current.size > 0);
                        break;

                    default:
                        break;
                }
            });
        });
    });

    const className = useMemo(() => {
        return ["code-action-menu-container", show ? "show" : ""]
            .filter((v) => v !== "")
            .join(" ");
    }, [show]);

    return (
        <div className={className} style={position}>
            <LangDropdown
                editor={editor}
                codeNode={codeNode}
                languages={languages}
            />
            <CopyButton editor={editor} codeNode={codeNode} />
        </div>
    );
};

function getMouseInfo(event: MouseEvent): {
    codeDOMNode: HTMLElement | null;
    isOutside: boolean;
} {
    const target = event.target;

    if (target && target instanceof HTMLElement) {
        let codeDOMNode = target;

        if (
            codeDOMNode.tagName !== "CODE" ||
            !codeDOMNode.classList.contains("LexicalEditorTheme__code")
        ) {
            codeDOMNode = target.closest<HTMLElement>(
                "code.PlaygroundEditorTheme__code"
            );
        }

        const isOutside = !(
            codeDOMNode ||
            target.closest<HTMLElement>(".code-action-menu-container") ||
            target.closest<HTMLElement>(
                ".floating-select-toolbar-popup__dropdown-item"
            )
        );

        return { codeDOMNode, isOutside };
    } else {
        return { codeDOMNode: null, isOutside: true };
    }
}
