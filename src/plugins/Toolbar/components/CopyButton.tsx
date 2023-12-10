"use client";

import { CodeNode } from "@lexical/code";
import { LexicalEditor } from "lexical";
import React, { useCallback, useState } from "react";

import { useDebounce } from "../../../utils/useDebounce";

import "../../../styles/CopyButton.css";

interface Props {
    editor: LexicalEditor;
    codeNode?: CodeNode;
}

export function CopyButton({ editor, codeNode }: Props) {
    const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);

    const removeSuccessIcon = useDebounce(() => {
        setCopyCompleted(false);
    }, 1000);

    const handleClick = useCallback(() => {
        if (editor && codeNode) {
            editor.getEditorState().read(() => {
                const content = codeNode.getTextContent();

                try {
                    if (window.isSecureContext) {
                        navigator.clipboard.writeText(content).then(() => {
                            setCopyCompleted(true);
                            removeSuccessIcon();
                        });
                    } else {
                        console.warn(
                            "Clipboard copy is available only for secured connections."
                        );
                    }
                } catch (err) {
                    console.error("Failed to copy: ", err);
                }
            });
        }
    }, [codeNode, editor]);

    return (
        <button
            className="floating-select-toolbar-popup__button copy"
            onClick={handleClick}
            aria-label="Copy"
            type="button"
        >
            {isCopyCompleted ? (
                <svg
                    version="1.1"
                    viewBox="0 0 50 50"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="m25 0a25 25 0 0 0-25 25 25 25 0 0 0 25 25 25 25 0 0 0 25-25 25 25 0 0 0-25-25zm12.9 12.5a2.5 2.5 0 0 1 1.81 0.627 2.5 2.5 0 0 1 0.209 3.53l-16 18a2.5 2.5 0 0 1-3.43 0.293l-10-8a2.5 2.5 0 0 1-0.391-3.52 2.5 2.5 0 0 1 3.52-0.391l8.15 6.52 14.4-16.2a2.5 2.5 0 0 1 1.72-0.836z"
                        fill="#25ae88"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1000 1000"
                    height="16"
                    width="16"
                >
                    <path d="M710 10H360c-38.6 0-70 31.4-70 70v630c0 38.6 31.4 70 70 70h490c38.6 0 70-31.4 70-70V220L710 10zm0 99 111 111H710V109zm140 601H360V80h280v210h210v420z" />
                    <path d="M430 360h350v70H430v-70zm0 140h350v70H430v-70z" />
                    <path d="M640 920H150V290h70v-70h-70c-38.6 0-70 31.4-70 70v630c0 38.6 31.4 70 70 70h490c38.6 0 70-31.4 70-70v-70h-70v70z" />
                </svg>
            )}
        </button>
    );
}
