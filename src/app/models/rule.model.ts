export interface Rule {
    id: number
    ruleName: string
    farmId: string
    greenhouseId: string
    zoneId: string
    loop: number
    type: string
    start: string
    stop: string
    listModbus: Modbus[]
    listLed: Led[]
    listRelay: Relay[]
    listSensor: Sensor[]
}

export interface Modbus {
    id: string
    mac: string
    name: string
    param: string
    active: number
}

export interface Led {
    id: string
    mac: string
    name: string
    active: number
    CCT: number
    DIM: number
}

export interface Relay {
    pin: string
    name: string
    status: number
}

export interface Sensor {
    id: string
    mac: string
    name: string
    min: number
    max: number
    type: string
}
