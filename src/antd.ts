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

export interface ColorAntdModalConfig {
    /** 背景颜色 */
    "backgroundColor"?: Color
    /** 关闭按钮颜色 */
    "closeColor"?: Color
    /** 关闭按钮被覆盖时的背景颜色 */
    "closeHoverBackgroundColor"?: Color
}

export function colorAntdModal(config: ColorAntdModalConfig) {
    const { backgroundColor, closeColor, closeHoverBackgroundColor } = config

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
                            ${text(closeColor)}
                        }
                    }
                }
            }
        }
    `
}

export interface ColorAntdInputConfig {
    /** 背景颜色 */
    "backgroundColor"?: Color
    /** 边框颜色 */
    "borderColor"?: Color
    /** 字体颜色 */
    "color"?: Color
    /** 提示词颜色 */
    "placeholderColor"?: Color
    /** 悬浮时边框颜色 */
    "hoverBorderColor"?: Color
    /** 聚焦时边框颜色 */
    "focusBorderColor"?: Color
    /** 清除按钮背景颜色 */
    "clearBackgroundColor"?: Color
    /** 清除按钮颜色 */
    "clearColor"?: Color
}

export function colorAntdInput(config: ColorAntdInputConfig) {
    const { backgroundColor, borderColor, color, placeholderColor, hoverBorderColor, focusBorderColor, clearBackgroundColor, clearColor } = config

    return css`
        &.ant-input {
            ${text(color)}
            ${bg(backgroundColor)}
            ${border(borderColor)}

            &::placeholder {
                ${text(placeholderColor)}
            }

            &:hover {
                ${border(hoverBorderColor)}
            }

            &:focus {
                ${border(focusBorderColor)}
            }
        }

        &.ant-input-affix-wrapper {
            ${bg(backgroundColor)}
            ${border(borderColor)}

            &:hover {
                ${border(hoverBorderColor)}
            }

            &:focus-within {
                ${border(focusBorderColor)}
            }

            > .ant-input {
                ${backgroundColor && backgroundColor.trim() && `background-color: transparent;`}
                ${text(color)}

                &::placeholder {
                    ${text(placeholderColor)}
                }
            }
        }

        .ant-input-suffix {
            .anticon {
                ${bg(clearBackgroundColor)}
                ${text(clearColor)}
            }
        }
    `
}

export interface ColorAntdSelectConfig {
    /** 边框颜色 */
    "borderColor"?: Color
    /** 背景颜色 */
    "backgroundColor"?: Color
    /** 字体颜色 */
    "color"?: Color
    /** 清除按钮背景颜色 */
    "clearBackgroundColor"?: Color
    /** 清除按钮颜色 */
    "clearColor"?: Color
    /** 提示词颜色 */
    "placeholderColor"?: Color
    /** 标签背景颜色 */
    "tagBackgroundColor"?: Color
    /** 去除按钮颜色 */
    "removeColor"?: Color
    /** 选择框被打开时字体颜色 */
    "openColor"?: Color
    /** 箭头颜色 */
    "arrowColor"?: Color
    /** 聚焦时边框颜色 */
    "focusBorderColor"?: Color
}

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

export interface ColorAntdTreeConfig {
    /** 背景颜色 */
    "backgroundColor"?: Color
    /** 字体颜色 */
    "color"?: Color
    /** 展开收起符号颜色 */
    "switcherColor"?: Color
    /** 复选框颜色 */
    "checkboxColor"?: Color
    /** 复选框边框颜色 */
    "checkboxBorderColor"?: Color
    /** 复选框背景颜色 */
    "checkboxBackgroundColor"?: Color
}

export function colorAntdTree(config: ColorAntdTreeConfig) {
    const { backgroundColor, color, switcherColor, checkboxColor, checkboxBorderColor, checkboxBackgroundColor } = config

    return css`
        &.ant-tree {
            ${bg(backgroundColor)}

            .ant-tree-node-content-wrapper {
                ${text(color)}
            }

            .ant-tree-switcher {
                ${text(switcherColor)}
            }

            .ant-tree-checkbox .ant-tree-checkbox-inner {
                ${border(checkboxBorderColor)}
                ${bg(checkboxBackgroundColor)}

                &::after {
                    ${border(checkboxColor)}
                }
            }
        }
    `
}

export interface ColorAntdRangePickerConfig {
    /** 边框颜色 */
    "borderColor"?: Color
    /** 背景颜色 */
    "backgroundColor"?: Color
    /** 字体颜色 */
    "color"?: Color
    /** 提示词颜色 */
    "placeholderColor"?: Color
    /** 中间分割线颜色 */
    "separatorColor"?: Color
    /** 日历图标颜色 */
    "calendarColor"?: Color
    /** 清除按钮颜色 */
    "clearColor"?: Color
    /** 清除按钮背景颜色 */
    "clearBackgroundColor"?: Color
    /** 聚焦时颜色 */
    "activeBarColor"?: Color
}

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

export interface ColorAntdTextAreaConfig {
    /** 背景颜色 */
    "backgroundColor"?: Color
    /** 字体颜色 */
    "color"?: Color
    /** 边框颜色 */
    "borderColor"?: Color
    /** 提示词颜色 */
    "placeholderColor"?: Color
    /** 关闭按钮颜色 */
    "closeColor"?: Color
    /** 关闭按钮背景颜色 */
    "closeBackgroundColor"?: Color
}

export function colorAntdTextArea(config: ColorAntdTextAreaConfig) {
    const { backgroundColor, color, borderColor, placeholderColor, closeColor, closeBackgroundColor } = config

    return css`
        &.ant-input {
            ${text(color)}
            ${bg(backgroundColor)}
            ${border(borderColor)}

            &::placeholder {
                ${text(placeholderColor)}
            }
        }

        &.ant-input-affix-wrapper {
            ${bg(backgroundColor)}
            ${border(borderColor)}

            .ant-input {
                ${text(color)}
                ${backgroundColor && backgroundColor.trim() && bg("transparent")}

            &::placeholder {
                    ${text(placeholderColor)}
                }
            }

            .anticon-close-circle {
                ${text(closeColor)}
                ${bg(closeBackgroundColor)}
            }
        }
    `
}
