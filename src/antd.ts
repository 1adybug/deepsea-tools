import { css } from "@emotion/css"
import { CSSProperties } from "react"
import type { GetTipString } from "./index"

export type PropertyKey = GetTipString<keyof CSSProperties>

export function getProperty(key: PropertyKey, value: string | undefined) {
    value = value?.trim()
    return value ? `${key.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`)}: ${value};` : ""
}

export function text(value: string | undefined) {
    return getProperty("color", value)
}

export function bg(value: string | undefined) {
    return getProperty("backgroundColor", value)
}

export function border(value: string | undefined) {
    return getProperty("borderColor", value)
}

export type Color = CSSProperties["color"]

export type GetColorConfig<T extends PropertyKey> = Partial<Record<T, Color>>

export type ColorAntdModalConfig = GetColorConfig<"backgroundColor" | "closeIconColor" | "closeHoverBackgroundColor">

export function colorAntdModal(config: ColorAntdModalConfig) {
    const { backgroundColor, closeIconColor, closeHoverBackgroundColor } = config

    return css`
        &.ant-modal {
            .ant-modal-content {
                ${bg(backgroundColor)}

                .ant-modal-header {
                    ${bg(backgroundColor)}

                    .ant-modal-title {
                        ${bg(backgroundColor)}
                    }
                }

                .ant-modal-close {
                    &:hover {
                        ${bg(closeHoverBackgroundColor)}
                    }

                    .ant-modal-close-x {
                        .ant-modal-close-icon {
                            ${text(closeIconColor)}
                        }
                    }
                }
            }
        }
    `
}

export type ColorAntdInputConfig = GetColorConfig<"backgroundColor" | "borderColor" | "color" | "placeholderColor" | "hoverBorderColor" | "focusBorderColor">

export function colorAntdInput(config: ColorAntdInputConfig) {
    const { backgroundColor, borderColor, color, placeholderColor, hoverBorderColor, focusBorderColor } = config

    return css`
        &.ant-input,
        & > input.ant-input {
            ${text(color)}
            ${bg(backgroundColor)}
            ${border(borderColor)}

            &::placeholder {
                ${text(placeholderColor)}
            }
        }

        &.ant-input {
            &:hover {
                ${border(hoverBorderColor)}
            }

            &:focus,
            &:focus-within {
                ${border(focusBorderColor)}
            }
        }
    `
}

export type ColorAntdSelectConfig = GetColorConfig<"borderColor" | "backgroundColor" | "color" | "clearBackgroundColor" | "clearColor" | "placeholderColor" | "tagBackgroundColor" | "removeColor" | "openColor" | "arrowColor" | "focusBorderColor">

export function colorAntdSelect(config: ColorAntdSelectConfig) {
    const { borderColor, backgroundColor, color, clearBackgroundColor, clearColor, placeholderColor, tagBackgroundColor, removeColor, openColor, arrowColor, focusBorderColor } = config

    return css`
        &.ant-select {
            &:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover {
                .ant-select-selector {
                    ${border(borderColor)}
                }
            }

            .ant-select-selector {
                ${text(color)}
                ${bg(backgroundColor)}
                ${border(borderColor)}
            }

            .ant-select-clear {
                ${bg(clearBackgroundColor)}
                ${text(clearColor)}
            }

            .ant-select-selection-placeholder {
                ${text(placeholderColor)}
            }

            &.ant-select-multiple {
                .ant-select-selection-item {
                    ${bg(tagBackgroundColor)}
                }

                .ant-select-selection-item-remove {
                    ${text(removeColor)}
                }
            }

            &.ant-select-open {
                .ant-select-selection-item {
                    ${text(openColor)}
                }
            }

            .ant-select-arrow {
                .anticon {
                    ${text(arrowColor)}
                }
            }

            &.ant-select-focused:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer) {
                .ant-select-selector {
                    ${border(focusBorderColor)}
                }
            }
        }
    `
}

export type ColorAntdTreeConfig = GetColorConfig<"backgroundColor" | "color" | "switcherColor" | "checkboxColor" | "checkboxBorderColor">

export function colorAntdTree(config: ColorAntdTreeConfig) {
    const { backgroundColor, color, switcherColor, checkboxColor, checkboxBorderColor } = config

    return css`
        .ant-tree {
            ${bg(backgroundColor)}

            .ant-tree-node-content-wrapper {
                ${text(color)}
            }

            .ant-tree-switcher {
                ${text(switcherColor)}
            }

            .ant-tree-checkbox .ant-tree-checkbox-inner {
                ${border(checkboxBorderColor)}

                &::after {
                    ${border(checkboxColor)}
                }
            }
        }
    `
}

export type ColorAntdRangePickerConfig = GetColorConfig<"borderColor" | "backgroundColor" | "color" | "placeholderColor" | "separatorColor" | "calendarColor" | "clearColor" | "clearBackgroundColor" | "activeBarColor">

export function colorAntdRangePicker(config: ColorAntdRangePickerConfig) {
    const { color, backgroundColor, borderColor, placeholderColor, separatorColor, calendarColor, clearBackgroundColor, clearColor, activeBarColor } = config

    return css`
        &.ant-picker-range {
            ${bg(backgroundColor)}
            ${border(borderColor)}

            .ant-picker-input {
                input {
                    ${text(color)}

                    &::placeholder {
                        ${text(placeholderColor)}
                    }
                }
            }

            .ant-picker-range-separator {
                .ant-picker-separator {
                    ${text(separatorColor)}
                }
            }

            .ant-picker-suffix {
                .anticon-calendar {
                    ${text(calendarColor)}
                }
            }
            
            .ant-picker-clear {
                ${text(clearColor)}
                ${bg(clearBackgroundColor)}
            }

            .ant-picker-active-bar {
                ${bg(activeBarColor)}
            }
        }
    `
}
