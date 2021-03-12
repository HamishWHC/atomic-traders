import axios from "axios"

export const makeSpaceTradersApi = (token: string) => axios.create({headers: {Authorization: `Bearer ${token}`}, baseURL: "https://api.spacetraders.io/"})
