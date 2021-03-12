export interface Location {
    x: number
    type: LocationType
    y: number
    symbol: string
    name: string
}

export enum LocationType {
    PLANET = "PLANET",
    ASTEROID = "ASTEROID",
    MOON = "MOON"
}

export interface User {
    ships: Ship[]
    username: string
    credits: number
    loans: Loan[]
}

export interface Ship {
    id: string
    location?: string
    cargo: Cargo[]
    spaceAvailable: number
    maxCargo: number
    type: string
    class: string
    manufacturer: string
    plating: number
    weapons: number
    speed: number
}

export interface PurchasableShip extends Omit<Ship, "location" | "cargo" | "spaceAvailable" | "id"> {
    purchaseLocations: {
        location: string,
        price: number
    }
}

export interface Cargo {
    good: string
    quantity: number
}

export interface Loan {
    id: string
    due: string
    repaymentAmount: number
    status: string
    type: string
}