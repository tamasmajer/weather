import fs from 'fs'
import os from 'os'

export default class Logger {
    constructor(file) {
        this.file=file
    }
    add(o) {
        if (!this.file) return
        const entry = JSON.stringify(o)
        fs.appendFileSync(this.file, entry+os.EOL, 'utf8')
    }
}
