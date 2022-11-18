import ErrorCodes from "./utils/ErrorCodes.mjs"

export default class WeatherService {
    constructor(openWeatherApi, cities, storage = null, cache = null) {
        this.openWeatherApi = openWeatherApi
        this.cities = cities
        this.storage = storage
        this.cache = cache
    }
    async getCityInfo(city) {
        let cityInfo = this.cache?.getCityInfo(city)
        if (!cityInfo) {
            try {
                cityInfo = await this.openWeatherApi.getCityInfo(city)
            } catch (e) {
                throw new Error(ErrorCodes.CITY_REQ)
            }
            if (cityInfo) this.cache?.setCityInfo(city, cityInfo)
        }
        if (!cityInfo) throw new Error(ErrorCodes.CITY_INFO)
        return cityInfo
    }
    async getCityWeather(city) {
        if (!city) throw new Error(ErrorCodes.NO_CITY)
        if (!this.cities.includes(city)) throw new Error(ErrorCodes.WRONG_CITY)
        let weather = this.storage?.getCityWeather(city)
        if (!weather) {
            const cityInfo = await this.getCityInfo(city)
            const { lat, lon } = cityInfo
            try {
                weather = await this.openWeatherApi.getWeatherAt(lat, lon)
            } catch (e) {
                throw new Error(ErrorCodes.WEATHER_REQ)
            }
            if (weather) this.storage?.setCityWeather(city, weather)
        }
        try {
            const { dt, coord: { lat, lon }, main: { temp, pressure, humidity }, wind: { speed, deg }, rain, clouds } = weather
            return {
                dt, city, lat, lon, temp, pressure, humidity, wind: { speed, deg }, rain, clouds
            }
        } catch (e) {
            throw new Error(ErrorCodes.WEATHER_INFO)
        }
    }
}