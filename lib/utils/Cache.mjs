export default class Cache {
    constructor() {
        this.cityCache = new Map()
    }

    getCityInfo(city) {
        return this.cityCache.get(city)
    }

    setCityInfo(city, cityInfo) {
        this.cityCache.set(city, cityInfo)
    }
}