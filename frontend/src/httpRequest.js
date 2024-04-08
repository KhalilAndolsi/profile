import axios from "axios"

const httpRequest = axios.create({
  baseURL: 'http://localhost:1818'
})

export default httpRequest