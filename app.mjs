import * as dotenv from 'dotenv'
dotenv.config()

import cities from './cities.json' assert {type: 'json'}
import translations from './translations.json' assert {type: 'json'}

import WeatherServiceApi from './lib/WeatherServiceApi.mjs'
import WeatherService from './lib/WeatherService.mjs'
import OpenWeatherApi from './lib/OpenWeatherApi.mjs'
import Storage from './lib/utils/Storage.mjs'
import Cache from './lib/utils/Cache.mjs'
import Logger from './lib/utils/Logger.mjs'

const { OPEN_WEATHER_MAP_API_KEY, DB_FILE, REQUEST_LOG, ERROR_LOG } = process.env
const openWeatherApi = new OpenWeatherApi(OPEN_WEATHER_MAP_API_KEY)
const storage = new Storage({ ttlInMinutes: 10, file: DB_FILE })
const cache = new Cache()
const weatherService = new WeatherService(openWeatherApi, cities, storage, cache)
const requestLog = new Logger(REQUEST_LOG)
const errorLog = new Logger(ERROR_LOG)
const weatherServiceApi = new WeatherServiceApi(weatherService, requestLog, errorLog)

import express from 'express'
import { engine } from 'express-handlebars'
const PORT = process.env.PORT || 8080
const app = express()
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.get('/', (req, res) => {
    const { lang = "EN" } = req.query
    res.render('index', {
        layout: false,
        cities,
        lang,
        languages: Object.keys(translations),
        locale: translations[lang],
    })
})
app.get('/api', (req, res) => weatherServiceApi.getCityWeather(req, res))
app.listen(PORT)
