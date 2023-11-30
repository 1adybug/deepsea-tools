const x_PI = (3.14159265358979324 * 3000.0) / 180.0
const PI = 3.1415926535897932384626
const a = 6378245.0
const ee = 0.00669342162296594323

/**
 * getCoordinateOffset 获取火星坐标系(GCJ-02)坐标与地球坐标系(WGS84)坐标的偏移量
 * @param {number[]} coordinate 火星坐标系(GCJ-02)坐标
 */
function getCoordinateOffset(coordinate: number[]) {
    const [longitude, latitude] = coordinate
    let dLng = 300.0 + longitude + 2.0 * latitude + 0.1 * longitude * longitude + 0.1 * longitude * latitude + 0.1 * Math.sqrt(Math.abs(longitude))
    dLng += ((20.0 * Math.sin(6.0 * longitude * PI) + 20.0 * Math.sin(2.0 * longitude * PI)) * 2.0) / 3.0
    dLng += ((20.0 * Math.sin(longitude * PI) + 40.0 * Math.sin((longitude / 3.0) * PI)) * 2.0) / 3.0
    dLng += ((150.0 * Math.sin((longitude / 12.0) * PI) + 300.0 * Math.sin((longitude / 30.0) * PI)) * 2.0) / 3.0
    let dLat = -100.0 + 2.0 * longitude + 3.0 * latitude + 0.2 * latitude * latitude + 0.1 * longitude * latitude + 0.2 * Math.sqrt(Math.abs(longitude))
    dLat += ((20.0 * Math.sin(6.0 * longitude * PI) + 20.0 * Math.sin(2.0 * longitude * PI)) * 2.0) / 3.0
    dLat += ((20.0 * Math.sin(latitude * PI) + 40.0 * Math.sin((latitude / 3.0) * PI)) * 2.0) / 3.0
    dLat += ((160.0 * Math.sin((latitude / 12.0) * PI) + 320 * Math.sin((latitude * PI) / 30.0)) * 2.0) / 3.0
    return [dLng, dLat]
}

/**
 * 判断坐标是否在中国范围内
 * @param {number[]} coordinate 坐标
 */
export function inChina(coordinate: number[]) {
    /** 大陆 */
    const region: number[][][] = [
        [
            [79.4462, 49.2204],
            [96.33, 42.8899]
        ],
        [
            [109.6872, 54.1415],
            [135.0002, 39.3742]
        ],
        [
            [73.1246, 42.8899],
            [124.143255, 29.5297]
        ],
        [
            [82.9684, 29.5297],
            [97.0352, 26.7186]
        ],
        [
            [97.0253, 29.5297],
            [124.367395, 20.414096]
        ],
        [
            [107.975793, 20.414096],
            [111.744104, 17.871542]
        ]
    ]

    /** 台湾未做偏移 */
    const exclude: number[][][] = [
        [
            [119.921265, 25.398623],
            [122.497559, 21.785006]
        ],
        [
            [101.8652, 22.284],
            [106.665, 20.0988]
        ],
        [
            [106.4525, 21.5422],
            [108.051, 20.4878]
        ],
        [
            [109.0323, 55.8175],
            [119.127, 50.3257]
        ],
        [
            [127.4568, 55.8175],
            [137.0227, 49.5574]
        ],
        [
            [131.2662, 44.8922],
            [137.0227, 42.5692]
        ]
    ]

    return region.some(item => inRectangle(coordinate, item[0], item[1])) && !exclude.some(item => inRectangle(coordinate, item[0], item[1]))
}

/**
 * 判断是否在范围内
 * @param {number[]} coordinate 坐标
 * @param {number[]} start 起点坐标
 * @param {number[]} end 终点坐标
 */
function inRectangle(coordinate: number[], start: number[], end: number[]) {
    const [sLng, sLat] = start
    const [eLng, eLat] = end
    const [longitude, latitude] = coordinate
    const minLng = Math.min(sLng, eLng)
    const maxLng = Math.max(sLng, eLng)
    const minLat = Math.min(sLat, eLat)
    const maxLat = Math.max(sLat, eLat)
    return longitude >= minLng && longitude <= maxLng && latitude >= minLat && latitude <= maxLat
}

/**
 * WGS84ToGCJ02 地球坐标系(WGS84)转火星坐标系(GCJ-02)
 * @param {number[]} WGS84Coordinate WGS84坐标
 */
export function WGS84ToGCJ02(WGS84Coordinate: number[]) {
    const [WGS84Longitude, WGS84Latitude] = WGS84Coordinate
    const x = WGS84Longitude - 105.0
    const y = WGS84Latitude - 35.0
    let [dLng, dLat] = getCoordinateOffset([x, y])
    const radLat = (WGS84Latitude / 180.0) * PI
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI)
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI)
    const GCJLongitude = WGS84Longitude + dLng
    const GCJLatitude = WGS84Latitude + dLat
    return [GCJLongitude, GCJLatitude]
}

/**
 * GCJ02ToWGS84 火星坐标系(GCJ-02)转地球坐标系(WGS84)
 * @param {number[]} GCJCoordinate 火星坐标系(GCJ-02)坐标
 */
export function GCJ02ToWGS84(GCJCoordinate: number[]) {
    const [GCJLongitude, GCJLatitude] = GCJCoordinate
    const x = GCJLongitude - 105.0
    const y = GCJLatitude - 35.0
    let [dLng, dLat] = getCoordinateOffset([x, y])
    const radLat = (GCJLatitude / 180.0) * PI
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI)
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI)
    const WGS84Longitude = GCJLongitude - dLng
    const WGS84Latitude = GCJLatitude - dLat
    return [WGS84Longitude, WGS84Latitude]
}

/**
 * BD09ToGCJ02 百度坐标系(BD-09)转火星坐标系(GCJ-02)
 * @param {number[]} BDCoordinate 百度坐标系(BD-09)坐标
 */
export function BD09ToGCJ02(BDCoordinate: number[]) {
    const [BDLongitude, BDLatitude] = BDCoordinate
    const x = BDLongitude - 0.0065
    const y = BDLatitude - 0.006
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI)
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI)
    const GCJLongitude = z * Math.cos(theta)
    const GCJLatitude = z * Math.sin(theta)
    return [GCJLongitude, GCJLatitude]
}

/**
 * GCJ02ToBD09 火星坐标系(GCJ-02)转百度坐标系(BD-09)
 * @param {number[]} GCJCoordinate 火星坐标系(GCJ-02)坐标
 */
export function GCJ02ToBD09(GCJCoordinate: number[]) {
    const [GCJLongitude, GCJLatitude] = GCJCoordinate
    const z = Math.sqrt(GCJLongitude * GCJLongitude + GCJLatitude * GCJLatitude) + 0.00002 * Math.sin(GCJLatitude * x_PI)
    const theta = Math.atan2(GCJLatitude, GCJLongitude) + 0.000003 * Math.cos(GCJLongitude * x_PI)
    const BDLongitude = z * Math.cos(theta) + 0.0065
    const BDLatitude = z * Math.sin(theta) + 0.006
    return [BDLongitude, BDLatitude]
}

/**
 * BD09ToWGS84 百度坐标系(BD-09)转地球坐标系(WGS84)
 * @param {number[]} BDCoordinate 百度坐标系(BD-09)坐标
 */
export function BD09ToWGS84(BDCoordinate: number[]) {
    return GCJ02ToWGS84(BD09ToGCJ02(BDCoordinate))
}

/**
 * WGS84ToBD09 地球坐标系(WGS84)转百度坐标系(BD-09)
 * @param {number[]} WGS84Coordinate WGS84坐标
 */
export function WGS84ToBD09(WGS84Coordinate: number[]) {
    return GCJ02ToBD09(WGS84ToGCJ02(WGS84Coordinate))
}
