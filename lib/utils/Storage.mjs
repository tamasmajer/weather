import fs from 'fs'

export default class Storage {
    constructor({ ttlInMinutes = 0, file = null } = {}) {
        this.weatherStore = new Map()
        this.ttl = ttlInMinutes
        this.file = file
        this.load(this.file)
    }
    isTooOld(ts) {
        return Date.now() / 1000 - this.ttlInMinutes * 60 > ts
    }
    getCityWeather(city) {
        const weather = this.weatherStore.get(city)
        if (!weather) return
        if (!this.isTooOld(weather.dt)) return weather
        this.weatherStore.delete(city)
    }
    setCityWeather(city, weather) {
        this.weatherStore.set(city, weather)
        this.save(this.file)
    }
    load(file) {
        if (!file) return
        try {
            const json = fs.readFileSync(file, 'utf8')
            if (!json) return
            const map = JSON.parse(json)
            this.weatherStore = new Map(Object.entries(map))
        } catch (e) {
            // it's ok
        }
    }
    save(file) {
        if (!file) return
        const o = Object.fromEntries(this.weatherStore)
        const json = JSON.stringify(o, null, 4)
        fs.writeFileSync(file, json, 'utf8')
    }
}