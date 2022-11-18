import WeatherService from '../lib/WeatherService.mjs'
import OpenWeatherApi from '../lib/OpenWeatherApi.mjs'
import Storage from '../lib/Storage.mjs'
const openWeatherApi=new OpenWeatherApi("46d4b7c5d34fa20f4e66d522546c5d5f")
const storage = new Storage(10)
const weatherService=new WeatherService(openWeatherApi,storage)

describe("WeatherService", function () {
    this.timeout(0)
    it('should get city', async () => {
        const weather = await weatherService.getCityWeather('Budapest')
        console.log(weather)
     })
})
