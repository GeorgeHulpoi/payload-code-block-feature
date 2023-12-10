"use client";

import {
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    getLanguageFriendlyName,
} from "@lexical/code";
import { ToolbarDropdown } from "@payloadcms/richtext-lexical/dist/field/lexical/plugins/FloatingSelectToolbar/ToolbarDropdown";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import type { LangDropdownProps } from "./types";

import "../../../../styles/LangDropdown.css";

export const LangDropdown: React.FC<LangDropdownProps> = ({
    editor,
    codeNode,
    languages,
}) => {
    const [lang, setLang] = useState<string>("");
    const wrapper = useRef<HTMLDivElement>();

    let CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

    if (languages) {
        CODE_LANGUAGE_OPTIONS = languages(CODE_LANGUAGE_OPTIONS);
    }

    useEffect(() => {
        if (codeNode) {
            editor.getEditorState().read(() => {
                setLang(codeNode.getLanguage());
            });
        } else {
            setLang("");
        }
    }, [codeNode, editor]);

    const LangComp = useMemo(() => {
        return () => <>{getLanguageFriendlyName(lang)}</>;
    }, [lang]);

    const onCodeLanguageSelect = useCallback(
        (value: string) => {
            editor.update(() => {
                if (codeNode !== null) {
                    setLang(value);
                    codeNode.setLanguage(value);
                }
            });
        },
        [codeNode, setLang, editor]
    );

    return (
        <div ref={wrapper}>
            <ToolbarDropdown
                Icon={LangComp}
                editor={editor}
                anchorElem={wrapper.current}
                entries={CODE_LANGUAGE_OPTIONS.map(([value, name]) => ({
                    key: value,
                    label: name,
                    onClick: () => onCodeLanguageSelect(value),
                }))}
            />
        </div>
    );
};

function getCodeLanguageOptions(): [string, string][] {
    const options: [string, string][] = [];

    for (const [lang, friendlyName] of Object.entries(
        CODE_LANGUAGE_FRIENDLY_NAME_MAP
    )) {
        options.push([lang, friendlyName]);
    }

    return options;
}
