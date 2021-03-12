import type {AxiosInstance} from "axios"
import type {Writable} from "svelte/store"

export const key = {}

export type ContextType = Writable<{username: string, instance: AxiosInstance}>