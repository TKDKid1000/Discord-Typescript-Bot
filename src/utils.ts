import {promisify} from "util"

const sleep = async (ms: number) => promisify(setInterval)

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)

export {sleep, randomInt}