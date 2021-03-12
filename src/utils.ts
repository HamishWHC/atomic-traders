import type {Location} from "./spacetraders/types"

export type Point = {x: number, y: number}

export type LocationWithOrbits = Location & {orbits: Point[]};

export const diameterFromOriginAndPoint = (origin: Point, point: Point) => 2 * Math.sqrt((origin.y - point.y) ** 2 + (origin.x - point.x) ** 2)

export const GRID_SIZE = 5;

export const sortByKey = (key: string | symbol | number) => {
    return (a: any, b: any) => {
        if (key in a && key in b) {
            if (a[key] < b[key]) {
                return -1
            } else if (a[key] > b[key]) {
                return 1
            } else {
                return 0
            }
        } else {
            throw Error(`Key "${String(key)}" not in objects being sorted.`)
        }
    }
}