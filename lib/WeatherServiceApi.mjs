import ErrorCodes from './utils/ErrorCodes.mjs'

export default class WeatherServiceApi {
    constructor(weatherService, requestLog = null, errorLog = null) {
        this.weatherService = weatherService
        this.requestLog = requestLog
        this.errorLog = errorLog
    }
    async getCityWeather(req, res) {
        const ts = Date.now()
        let took
        const { city } = req.query
        try {
            const weather = await this.weatherService.getCityWeather(city)
            took = Date.now() - ts
            this.requestLog?.add({ time: new Date().toLocaleString(), ts, took, city, weather })
            res.status(200).json(weather)
        } catch (e) {
            const code = ErrorCodes[e.message]
            const type = (code === ErrorCodes.NO_CITY || code === ErrorCodes.WRONG_CITY) ? 400 : 500
            this.errorLog?.add({ time: new Date().toLocaleString(), ts, took, city, error: { type, code, stack: e.stack } })
            res.status(type).json({ code })
        }
    }
}
