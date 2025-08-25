import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

console.log(`TESTANDOOOOO: ${process.env.VITE_API_BASE_URL}`)

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
})

export { api }

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api
  app.provide('api', api)
})
