export default class OpenWeatherApi {
    constructor(apiKey = process.env.OPEN_WEATHER_MAP_API_KEY) {
        this.API_KEY = apiKey
    }
    async getCityInfo(city) {
        const resp = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.API_KEY}`)
        const json = await resp.json()
        return json[0]
    }
    async getWeatherAt(lat, lon, units = 'metric') {
        const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.API_KEY}`)
        return await resp.json()
    }
}
