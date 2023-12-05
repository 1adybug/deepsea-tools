import Equal from "is-equal"
import Cookies from "js-cookie"
import { DependencyList, useEffect, useRef } from "react"
import { SetURLSearchParams } from "react-router-dom"
import robustSegmentIntersect from "robust-segment-intersect"
import { chunk, compact, difference, differenceWith, intersection, intersectionWith, sample, union, unionWith, uniq, uniqWith } from "lodash-es"
export * from "./antd"
export * from "./tailwind"
export * from "./coordinate"

/**
 * 休眠指定时间
 * @param {number} time - 休眠的毫秒数
 */
export async function sleep(time: number): Promise<1> {
    return new Promise<1>(resolve => {
        setTimeout(() => {
            resolve(1)
        }, time)
    })
}

/**
 * 取两个整数之间的随机数
 * @param {string} start - 开始的数字，闭区间
 * @param {string} end - 结束的数字，闭区间
 */
export function getRandomBetween(start: number, end: number) {
    if (!Number.isInteger(start)) throw new Error("开始的数字必须是整数")
    if (!Number.isInteger(end)) throw new Error("结束的数字必须是整数")
    if (end < start) throw new Error("结束的数字必须大于或者等于开始的数字")
    return start + Math.floor(Math.random() * (end + 1 - start))
}

/**
 * 取数组中的随机一个元素
 * @param array - 数组
 */
export function getRandomItemFromArray<T>(array: T[]): T {
    return array[getRandomBetween(0, array.length - 1)]
}

/** 0-9集合 */
export const digits: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * 获取随机手机号
 */
export function getRandomPhone() {
    const secondList = [3, 5, 7, 8, 9]

    const thirdList: Record<string, number[]> = {
        3: digits,
        5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        7: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        8: digits,
        9: [1, 5, 8, 9]
    }

    const second = getRandomItemFromArray(secondList)

    const third = getRandomItemFromArray(thirdList[second])

    return `1${second}${third}${Array(8)
        .fill(0)
        .map(() => getRandomItemFromArray(digits))
        .join("")}`
}

/**
 * 可能性
 * @param {number} p - 可能性
 */
export function possibility(p: number) {
    return Math.random() < p
}

/** 车牌号可用的字母 */
export const plateNoAlphabets: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

/**
 * 获取一个随机车牌号
 * @param start - 开始的两位，默认是苏H
 */
export function getRandomPlateNo(start?: string) {
    return `${start ?? "苏H"}${getArray(5, () => getRandomItemFromArray(plateNoAlphabets)).join("")}`
}

/** 获取随机年份 */
export function getRandomYear() {
    return new Date().getFullYear() - getRandomBetween(20, 50)
}

/** 获取一个月的长度，忽略闰年 */
export function getMonthLength(month: number) {
    const a: number[] = [1, 3, 5, 7, 8, 10, 12]
    const b: number[] = [4, 6, 9, 11]
    if (a.includes(month)) return 31
    if (b.includes(month)) return 30
    return 28
}

/** 获取一个随机月份日期 */
export function getRandomDate() {
    const month = getRandomBetween(1, 12)
    const monthStr = `${month < 10 ? 0 : ""}${month}`
    const date = getRandomBetween(1, getMonthLength(month))
    const dateStr = `${date < 10 ? 0 : ""}${date}`
    return `${monthStr}${dateStr}`
}

/**
 * 获取一个随机身份证
 * @param area - 区号
 *
 */
export function getRandomId(area?: number) {
    if (typeof area === "number") {
        if (!Number.isInteger(area)) throw new Error("区号必须是整数")
        if (area < 110000 || area > 820000) throw new Error("区号必须在 110000 和 820000 之间")
    }

    return `${area ?? "380812"}${getRandomYear()}${getRandomDate()}${getRandomBetween(0, 9)}${getRandomBetween(0, 9)}${getRandomBetween(0, 9)}${getRandomBetween(0, 9)}`
}

/** 判断两个数字是否相等 */
export function twoNumberIsEqual(a: number, b: number) {
    if (isNaN(a) && isNaN(b)) return true
    if (a === b) return true
    return Math.abs(a - b) < Number.EPSILON
}

/**
 * 获取两个经纬度坐标之间的距离
 * @param {number[]} coord1 - 经纬度一，[维度, 经度]
 * @param {number[]} coord2 - 经纬度二，[维度, 经度]
 * @returns {number} 距离：米
 */
export function getDistance(coord1: number[], coord2: number[]): number {
    function toRadians(d: number) {
        return (d * Math.PI) / 180
    }
    const [lat1, lng1] = coord1
    if (lat1 < 0) {
        throw new Error("经纬度1的纬度小于0°")
    }
    if (lat1 > 90) {
        throw new Error("经纬度1的纬度大于90°")
    }
    if (lng1 < 0) {
        throw new Error("经纬度1的经度小于0°")
    }
    if (lng1 > 180) {
        throw new Error("经纬度1的经度大于180°")
    }
    const [lat2, lng2] = coord2
    if (lat2 < 0) {
        throw new Error("经纬度2的纬度小于0°")
    }
    if (lat2 > 90) {
        throw new Error("经纬度2的纬度大于90°")
    }
    if (lng2 < 0) {
        throw new Error("经纬度2的经度小于0°")
    }
    if (lng2 > 180) {
        throw new Error("经纬度2的经度大于180°")
    }
    const radLat1 = toRadians(lat1)
    const radLat2 = toRadians(lat2)
    const deltaLat = radLat1 - radLat2
    const deltaLng = toRadians(lng1) - toRadians(lng2)
    const dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)))
    return dis * 6378137
}

/**
 * 获取两个经纬度坐标之间的距离
 * @param {number[]} coord1 - 经纬度一，[维度, 经度]
 * @param {number[]} coord2 - 经纬度二，[维度, 经度]
 * @param {number} d1 - 距离一，单位：米
 * @param {number} d2 - 距离二，单位：米
 * @returns {number[][]} - 可能的两个坐标
 */
export function getCoord(coord1: number[], coord2: number[], d1: number, d2: number): number[][] {
    const [lat1, lng1] = coord1
    const [lat2, lng2] = coord2
    const [m, n] = [lat2 - lat1, lng2 - lng1]
    const s = getDistance(coord1, [lat2, lng1]) / m
    const t = getDistance(coord1, [lat1, lng2]) / n
    const e = m * s
    const f = n * t
    const g = -e / f
    const h = (e ** 2 + f ** 2 + d1 ** 2 - d2 ** 2) / (2 * f)
    const a = g ** 2 + 1
    const b = 2 * g * h
    const c = h ** 2 - d1 ** 2
    const ox1 = (-b + (b ** 2 - 4 * a * c) ** (1 / 2)) / (2 * a)
    const oy1 = g * ox1 + h
    const ox2 = (-b - (b ** 2 - 4 * a * c) ** (1 / 2)) / (2 * a)
    const oy2 = g * ox2 + h
    return [
        [ox1 / s + lat1, oy1 / t + lng1],
        [ox2 / s + lat1, oy2 / t + lng1]
    ]
}

/**
 * 获取对象的某些属性
 * @param {object} obj - 对象
 * @param {string[]} keyList - 需要取出的 key 集合
 */
export function getProperties<T, K extends keyof T>(obj: T, ...keyList: K[]): Pick<T, K> {
    const result: any = {}
    keyList.forEach(key => {
        result[key] = obj[key]
    })
    return result
}

/**
 * 判断一个变量是否是非 null 的对象
 */
export function isObject(a: any) {
    return typeof a === "object" && a !== null
}

/**
 * 比较两个变量是否相等
 */
export function equal(a: any, b: any): boolean {
    return Equal(a, b)
}

/**
 * 比较两个变量是否相等
 * @param {string[]} ignoreList - 忽略的 key 集合
 */
export function compareWithoutProperties<T extends Object>(a: T, b: T, ...ignoreList: (keyof T)[]): boolean {
    if (ignoreList.length === 0) throw new Error(`ignoreList 为空`)
    return Object.keys(a)
        .filter(key => !ignoreList.includes(key as keyof T))
        .every(key => equal(a[key as keyof T], b[key as keyof T]))
}

/**
 * 比较两个对象的某些属性
 * @param {string[]} keyList - 比较的 key 集合
 */
export function compareProperties<T extends Object>(a: T, b: T, ...keyList: (keyof T)[]): boolean {
    if (keyList.length === 0) throw new Error(`keyList 为空`)
    return keyList.every(key => {
        return equal(a[key], b[key])
    })
}

/** 身份证正则 */
export const idReg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/

/**
 * 判断是否是合法身份证号
 * @param {string} id - 身份证号
 */
export function isLegalId(id: string): boolean {
    return idReg.test(id)
}

/**
 * 将字符串或者字符串的数组变成字符串数组
 * @param {string | (string[])} id - 字符串或者字符串数组
 */
export function stringToArray(id: string | string[]) {
    return typeof id === "string" ? [id] : id
}

/**
 * 将身份证打码
 * @param {string} id - 身份证号
 */
export function coverIdWithMosaics(id: string) {
    if (isLegalId(id)) {
        throw new Error("非法身份证号")
    }
    return id.replace(/^(.{6})(.{8})(.+)$/, `$1********$3`)
}

/** 格式化选项 */
export interface StringToNumberOption {
    /** 是否转换成小数，默认为 false */
    float?: boolean
    /** 最小值，低于最小值将会输出最小值 */
    min?: number
    /** 最大值，大于最大值将会输出最大值 */
    max?: number
    /** NaN 时输出的值 */
    default: number
}

/**
 * 将字符串转换为数字
 * @param {string} value - 字符串
 * @param {number | StringToNumberOption} option - 转换的选项
 */
export function stringToNumber(value: string, option?: number | StringToNumberOption) {
    const v = typeof option === "object" && option.float ? parseFloat(value) : parseInt(value)

    if (option !== undefined && option !== null) {
        if (typeof option === "number") {
            if (isNaN(v)) {
                return option
            }
            return v
        }
        if (isNaN(v)) {
            return option.default
        }
        if (option.min !== undefined && v < option.min) {
            return option.min
        }
        if (option.max !== undefined && v > option.max) {
            return option.max
        }
    }

    return v
}

/**
 * 从身份证中获取年龄
 * @param {string} id - 身份证号
 */
export function getAgeFromId(id: string) {
    if (!isLegalId(id)) throw new Error("非法身份证号")
    return new Date().getFullYear() - Number(id.slice(6, 10))
}

/**
 * 从身份证中获取性别，0是女性，1是男性
 * @param {string} id - 身份证号
 */
export function getSexFromId(id: string) {
    if (!isLegalId(id)) throw new Error("非法身份证号")
    return Number(id.slice(-2, -1)) % 2
}

/** 获取随机姓名 */
export function getRandomName() {
    const firstList = ["张", "李", "王", "赵", "钱", "孙", "李", "吴", "徐", "周", "庞", "关", "朱"]

    const secondList = ["子", "文", "涛", "权", "明", "亮", "盛", "雨", "宇", "冰", "浩", "腾", "勇", "雪"]

    return `${getRandomItemFromArray(firstList)}${getRandomItemFromArray(secondList)}${possibility(0.66) ? getRandomItemFromArray(secondList) : ""}`
}

/** 一个经度的距离 */
export const ONE_LNG = 92693

/** 一个纬度的距离 */
export const ONE_LAT = 111319

/** 得到一个函数，用于判断两个对象之间某些属性是否改变 */
export function getPropertiesIsModified<T>(a: T, b: T): (...keyList: (keyof T)[]) => boolean {
    return function (...keyList: (keyof T)[]) {
        return keyList.some(key => {
            return !equal(a[key], b[key])
        })
    }
}

/** 获得一个函数循环出来的数组 */
export function getArray<T>(length: number, fun: (index: number) => T): T[] {
    return Array(length)
        .fill(0)
        .map(($, index) => fun(index))
}

/** 获取点到线的最短距离 */
export function getPointToLineMinDistance(point: number[], line: number[][], getDis?: (a: number[], b: number[]) => number) {
    const method = getDis || ((a: number[], b: number[]) => Math.pow(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2), 1 / 2))
    if (point.length !== 2) throw new Error("无效坐标")
    if (line.length < 2) throw new Error("线的坐标至少含有两个坐标")
    const [x0, y0] = point
    return Math.min(
        ...line
            .slice(0, -1)
            .map((item, index) => [item, line[index + 1]])
            .map(item => {
                const [[x1, y1], [x2, y2]] = item
                if (x1 === x2 && y1 === y2) return method(point, [x1, y1])
                if ((x0 === x1 && y0 === y1) || (x0 === x2 && y0 === y2)) return 0
                if (x1 === x2) {
                    if ((y0 - y1) * (y0 - y2) < 0) return method(point, [x1, y0])
                    return Math.min(method(point, [x1, y1]), method(point, [x2, y2]))
                }
                if (y1 === y2) {
                    if ((x0 - x1) * (x0 - x2) < 0) return method(point, [x0, y1])
                    return Math.min(method(point, [x1, y1]), method(point, [x2, y2]))
                }
                const k = (y2 - y1) / (x2 - x1)
                const x = (x0 / k + y0 + k * x1 - y1) / (k + 1 / k)
                const y = (y1 / k + x0 + k * y0 - x1) / (k + 1 / k)
                if ((x - x1) * (x - x2) < 0 && (y - y1) * (y - y2) < 0) return method(point, [x, y])
                return Math.min(method(point, [x1, y1]), method(point, [x2, y2]))
            })
    )
}

/** 是否是正数 */
export function isPositiveNumber(x: number) {
    return typeof x === "number" && x > 0
}

/** 是否是正整数 */
export function isPositiveInteger(x: number) {
    return Number.isInteger(x) && x > 0
}

/** 是整数或者小数 */
export function isNumber(x: any): x is number {
    return typeof x === "number" && /^[\d]*\.?[\d]+$/.test(String(x))
}

export function parseNumber(str: string) {
    const result = Number(str)
    if (isNaN(result)) throw new Error(`${str} 不可以被转换为数字`)
    if (String(result) !== str) console.warn(`${str} 转换为 ${result}`)
    return result
}

export function coordStringToNumber(str: string) {
    if (str.includes(":")) {
        const strs = str.split(":")
        if (strs.length !== 3) throw new Error(`${str} 不可以被转换为数字`)
        const nums = strs.map(parseNumber)
        const [x, y, z] = nums
        return x + y / 60 + z / 3600
    }
    return parseNumber(str)
}

export interface CoordObj1 {
    lat: number
    lng: number
}

export interface CoordObj2 {
    latitude: number
    longitude: number
}

export interface CoordObj3 {
    lat: string
    lng: string
}

export interface CoordObj4 {
    latitude: string
    longitude: string
}

export function coordIsNumberArray(coord: number[] | string[]): coord is number[] {
    if (coord.length !== 2) throw new Error(`${JSON.stringify(coord)} 的长度不为2`)
    if (typeof coord[0] === "number" && typeof coord[1] === "number") return true
    if (typeof coord[0] === "string" && typeof coord[1] === "string") return false
    throw new Error(`${JSON.stringify(coord)} 的类型有误`)
}

/** 检查坐标是否合法，合法则返回正确的坐标 */
export function coordCheck(coord: number[]): number[] {
    if (coord.length !== 2) throw new Error(`${JSON.stringify(coord)} 的长度不为2`)
    if (typeof coord[0] !== "number" || isNaN(coord[0]) || typeof coord[1] !== "number" || isNaN(coord[1])) throw new Error(`${JSON.stringify(coord)} 的类型有误`)
    const [y, x] = coord
    if (Math.abs(y) <= 90 && Math.abs(x) <= 180) {
        return [y, x]
    }
    if (Math.abs(x) <= 90 && Math.abs(y) <= 180) {
        throw new Error(`${JSON.stringify(coord)} 似乎将经纬度互换，请检查是否有误`)
    }
    throw new Error(`${JSON.stringify(coord)} 的经纬度超出范围`)
}

/** 将坐标信息转换为真实坐标，即`[维度, 经度]`的格式 */
export function getRealCoord(coord: number[] | string | string[] | CoordObj1 | CoordObj2 | CoordObj3 | CoordObj4): number[] {
    if (typeof coord === "string") {
        const reg = /^[0-9a-z]+$/
        const nums = coord
            .replace(/\:/g, "colon")
            .replace(/\-/g, "minus")
            .replace(/\./g, "point")
            .split(/\b/)
            .filter(str => reg.test(str))
            .map(str => str.replace(/colon/g, ":").replace(/minus/g, "-").replace(/point/g, "."))
            .map(coordStringToNumber)
        if (nums.length !== 2) throw new Error(`${coord} 的格式有误`)
        return coordCheck(nums)
    }
    if (Array.isArray(coord)) {
        if (coordIsNumberArray(coord)) {
            return coordCheck(coord)
        }
        return coordCheck(coord.map(coordStringToNumber))
    }
    if ("lat" in coord && "lng" in coord) {
        return getRealCoord([coord.lat, coord.lng] as string[] | number[])
    }
    if ("latitude" in coord && "longitude" in coord) {
        return getRealCoord([coord.latitude, coord.longitude] as string[] | number[])
    }
    throw new Error(`${coord} 的格式有误`)
}

export type StringCoord = `${number},${number}`

/** 将任意格式的坐标转换为51坐标 */
export function get51Coord(coord: number[] | string | string[] | CoordObj1 | CoordObj2 | CoordObj3 | CoordObj4): StringCoord {
    const [y, x] = getRealCoord(coord)
    return `${x},${y}`
}

/** 将浏览器中直接复制的 headers 转换为对象 */
export function getHeaders(headers: string): Record<string, string> {
    const result: Record<string, string> = {}
    headers
        .split("\n")
        .map(str => str.trim())
        .filter(str => str && !str.startsWith(":"))
        .forEach(str => {
            const index = str.indexOf(":")
            if (index < 1) {
                throw new Error(`无效的字段${str}`)
            }
            const key = str.slice(0, index).trim()
            const value = str.slice(index + 1).trim()
            result[key] = value
        })
    return result
}

/**
 * 判断两个线段是否相交
 * @param {number[][]} line1 - 线段一
 * @param {number[][]} line2 - 线段二
 */
export function ifTwoSegmentsIntersect(line1: number[][], line2: number[][]) {
    const [a, b] = line1
    const [c, d] = line2
    return robustSegmentIntersect(a, b, c, d)
}

/**
 * 判断多个点能否围成多边形
 * @param {number[][]} coords - 多边形的顶点
 */
export function canCoordsBePolygon(coords: number[][]) {
    const { length } = coords
    if (length < 3) return false
    const lines = coords.map((coord, index) => [coord, coords[(index + 1) % length]])
    for (let i = 0; i < length; i++) {
        for (let j = i + 2; j < length; j++) {
            if (i === 0 && j === length - 1) {
                continue
            }
            if (ifTwoSegmentsIntersect(lines[i], lines[j])) {
                return false
            }
        }
    }
    return true
}

/**
 * 比较两个数据是否相等
 */
function is(a: any, b: any): boolean {
    return (a === 0 && b === 0) || Object.is(a, b)
}

/** 为数组添加方法 */
export function extendArrayPrototype() {
    if (!Array.prototype.hasOwnProperty("with")) {
        class A {
            static with<T>(this: T[], index: number, value: T): T[] {
                if (!Number.isInteger(index) || index >= this.length || index < this.length * -1) {
                    throw new RangeError(`Invalid index : ${index}`)
                }
                const $ = [...this]
                $[index >= 0 ? index : this.length + index] = value
                return $
            }
        }
        Array.prototype.with = A.with
    }
    if (!Array.prototype.hasOwnProperty("toReversed")) {
        function toReversed<T>(this: T[]): T[] {
            const $ = [...this]
            $.reverse()
            return $
        }
        Array.prototype.toReversed = toReversed
    }
    if (!Array.prototype.hasOwnProperty("toShifted")) {
        function toShifted<T>(this: T[]): T[] {
            const $ = [...this]
            $.shift()
            return $
        }
        Array.prototype.toShifted = toShifted
    }
    if (!Array.prototype.hasOwnProperty("toPopped")) {
        function toPopped<T>(this: T[]): T[] {
            const $ = [...this]
            $.pop()
            return $
        }
        Array.prototype.toPopped = toPopped
    }
    if (!Array.prototype.hasOwnProperty("toSorted")) {
        function toSorted<T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
            const $ = [...this]
            $.sort(compareFn)
            return $
        }
        Array.prototype.toSorted = toSorted
    }
    if (!Array.prototype.hasOwnProperty("toDeduplicated")) {
        function toDeduplicated<T>(this: T[], compareFn?: (a: T, b: T) => boolean): T[] {
            return compareFn ? uniqWith(this, compareFn) : uniq(this)
        }
        Array.prototype.toDeduplicated = toDeduplicated
    }
    if (!Array.prototype.hasOwnProperty("toSpliced")) {
        function toSpliced<T>(this: T[], start: number, deleteCount?: number, ...items: T[]): T[] {
            const $ = [...this]
            if (deleteCount === undefined) {
                $.splice(start)
            } else {
                $.splice(start, deleteCount, ...items)
            }
            return $
        }
        Array.prototype.toSpliced = toSpliced
    }
    if (!Array.prototype.hasOwnProperty("toPushed")) {
        function toPushed<T>(this: T[], ...items: T[]): T[] {
            const $ = [...this]
            $.push(...items)
            return $
        }
        Array.prototype.toPushed = toPushed
    }
    if (!Array.prototype.hasOwnProperty("toUnshifted")) {
        function toUnshifted<T>(this: T[], ...items: T[]): T[] {
            const $ = [...this]
            $.unshift(...items)
            return $
        }
        Array.prototype.toUnshifted = toUnshifted
    }
    if (!Array.prototype.hasOwnProperty("toExchange")) {
        function toExchange<T>(this: T[], a: number, b: number): T[] {
            return this.with(a, this[b]).with(b, this[a])
        }
        Array.prototype.toExchange = toExchange
    }
    if (!Array.prototype.hasOwnProperty("at")) {
        function at<T>(this: T[], index: number): T | undefined {
            if (!Number.isInteger(index)) {
                throw new RangeError(`Invalid index : ${index}`)
            }
            return this[index >= 0 ? index : this.length + index]
        }
        Array.prototype.at = at
    }
    Array.prototype.chunk = function <T>(this: T[], size: number) {
        return chunk(this, size)
    }
    Array.prototype.nonNullable = function <T>(this: T[]) {
        return this.filter(item => item !== undefined && item !== null)
    }
    Array.prototype.asNonNullable = function <T>(this: T[]) {
        return this
    }
    Array.prototype.difference = function <T>(this: T[], values: T[], compareFn?: (a: T, b: T) => boolean) {
        return compareFn ? differenceWith(this, values, compareFn) : difference(this, values)
    }
    Array.prototype.intersection = function <T>(this: Array<T>, values: Array<T>, compareFn?: (a: T, b: T) => boolean) {
        return compareFn ? intersectionWith(this, values, compareFn) : intersection(this, values)
    }
    Array.prototype.union = function <T>(this: Array<T>, values: Array<T>, compareFn?: (a: T, b: T) => boolean) {
        return compareFn ? unionWith(this, values, compareFn) : union(this, values)
    }
    Array.prototype.random = function <T>(this: Array<T>) {
        return sample(this)
    }
    Array.prototype.groupBy = function <T>(this: Array<T>, compareFn: (a: T, b: T) => boolean = is): Array<Array<T>> {
        return this.reduce((prev: Array<Array<T>>, item: T) => {
            const arr = prev.find(it => compareFn(it[0], item))
            if (arr) {
                arr.push(item)
            } else {
                prev.push([item])
            }
            return prev
        }, [])
    }
}

/**
 * base64 转 blob
 * @param {string} base64 需要转换的 base64
 * @returns {Blob}
 */
export function base64ToBlob(base64: string): Blob {
    const bytes = atob(base64.split(",")[1])
    const array = new Uint8Array(bytes.length)
    const mime = base64.match(/^data:(.*?);/)![1]
    for (let i = 0; i < bytes.length; i++) {
        array[i] = bytes.charCodeAt(i)
    }
    const blob = new Blob([array], { type: mime })
    return blob
}

/**
 * blob 生成文件并下载
 * @param {Blob} blob 文件的 blob
 * @param {string} fileName 文件名
 */
export function downloadBlob(blob: Blob, fileName: string) {
    const link = document.createElement("a")
    link.download = fileName
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
}

/**
 * 帧数定时器
 * @param {Function} callback 回调函数
 * @param {number} frames 帧数，必须是 0 或者正整数
 */
export function setFrameTimeout(callback: () => void, frames: number): () => void {
    if (!Number.isInteger(frames) || frames < 0) throw new RangeError("帧数只支持 0 或者正整数")
    let current = 0
    let signal = 0
    function clearFrameTimeout() {
        cancelAnimationFrame(signal)
    }
    function run() {
        signal = requestAnimationFrame(() => {
            run()
            if (current++ >= frames) {
                callback()
                return
            }
        })
    }
    run()
    return clearFrameTimeout
}

/**
 * 帧数定时器
 * @param {Function} callback 回调函数
 * @param {number} frames 帧数，必须是正整数
 */
export function setFrameInterval(callback: () => void, frames: number): () => void {
    if (!Number.isInteger(frames) || frames <= 0) throw new RangeError("帧数只支持正整数")
    let current = 0
    let signal = 0
    function clearFrameInterval() {
        cancelAnimationFrame(signal)
    }
    function run() {
        signal = requestAnimationFrame(() => {
            run()
            if (current++ % frames === 0) {
                callback()
            }
        })
    }
    run()
    return clearFrameInterval
}

/**
 * 在 react 中比较数组是否发生变化
 */
export function useArraySignal<T>(data: T[], compareFn?: (a: T, b: T) => boolean) {
    const dataRef = useRef(data)
    const signal = useRef(Date.now())
    if (dataRef.current.length !== data.length || dataRef.current.some((it, idx) => (compareFn ? !compareFn(it, data[idx]) : it !== data[idx]))) {
        signal.current = Date.now()
        dataRef.current = data
    }
    return signal.current
}

/**
 * 取余函数
 * @param a 被除数
 * @param b 除数
 */
export function remain(a: number, b: number) {
    const r = a % b
    return a >= 0 ? r : r + Math.abs(b)
}

export interface DrawArcOptions {
    /** 到达绘制起点的方式，true 为连线，false 为移动，默认 false */
    line?: boolean
    /** 起点到终点的方式，true 为逆时针，false 为顺时针，默认 false */
    anticlockwise?: boolean
}

/**
 * 用 canvas 的方法画 path 的圆
 * @param x 圆弧中心（圆心）的 x 轴坐标
 * @param y 圆弧中心（圆心）的 y 轴坐标
 * @param radius 圆弧的半径
 * @param startAngle 圆弧的起始点，x 轴方向开始计算，单位以弧度表示
 * @param endAngle 圆弧的终点，单位以弧度表示
 * @param {DrawArcOptions} options 其他绘制选项
 */
export function drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, options: DrawArcOptions = {}) {
    startAngle = remain(startAngle, Math.PI * 2)
    endAngle = remain(endAngle, Math.PI * 2)
    const { line = false, anticlockwise = false } = options

    return `${line ? "L" : "M"} ${x + radius * Math.cos(startAngle)} ${y + radius * Math.sin(startAngle)} A ${radius} ${radius} 0 ${anticlockwise ? (startAngle > endAngle ? "0 0" : "1 0") : startAngle > endAngle ? "1 1" : "0 1"} ${x + radius * Math.cos(endAngle)} ${y + radius * Math.sin(endAngle)}`
}

export function useAsync(effect: () => Promise<void>, callback: () => void, deps?: DependencyList): void
export function useAsync(effect: () => Promise<void>, deps?: DependencyList): void
export function useAsync(effect: () => Promise<void>, callbackOrDeps?: (() => void) | DependencyList, deps?: DependencyList) {
    if (callbackOrDeps === undefined) {
        useEffect(() => {
            effect()
        })
        return
    }
    if (typeof callbackOrDeps === "function") {
        useEffect(() => {
            effect()
            return callbackOrDeps
        }, deps)
        return
    }
    useEffect(() => {
        effect()
    }, callbackOrDeps)
}

export type GetTipString<T extends string> = T | (string & {})

export type QueryFnToData<T extends Record<string, (param: string | null) => any>> = {
    [K in keyof T]: ReturnType<T[K]>
}

export type DataToDataFn<T extends Record<string, any>> = {
    [K in keyof T]: (data: T[K]) => string | null
}

/**
 * 将搜索字符串映射为数据
 */
export function getDataFromQuery<T extends Record<string, (param: string | null) => any>>(params: URLSearchParams, fns: T): QueryFnToData<T> {
    return Object.keys(fns).reduce((prev: any, key) => {
        prev[key] = fns[key](params.get(key))
        return prev
    }, {})
}

/**
 * 将数据映射为搜索字符串
 */
export function setQueryFromData<T extends Record<string, any>>(data: T, fns: DataToDataFn<T>, setParams: SetURLSearchParams): void {
    setParams(
        Object.keys(data).reduce((prev: any, key) => {
            const str = fns[key](data[key])
            if (str !== null) prev[key] = str
            return prev
        }, {})
    )
}

/** 创建 cookie 的存储 */
export function createCookieStorage(): Storage {
    const cookieStorage: Storage = {
        get length() {
            return Object.keys(Cookies.get() || {}).length
        },
        clear() {
            Object.keys(Cookies.get() || {})?.forEach(key => Cookies.remove(key))
        },
        getItem(key) {
            return Cookies.get(key) || null
        },
        setItem(key, value) {
            Cookies.set(key, value)
        },
        key(index) {
            return Object.keys(Cookies.get())[index]
        },
        removeItem(key) {
            Cookies.remove(key)
        }
    }
    return cookieStorage
}

export function getKeys<T extends Object>(object: T): (keyof T)[] {
    return Object.keys(object) as (keyof T)[]
}
