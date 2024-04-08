import axios from "axios"

const httpRequest = axios.create({
  baseURL: 'https://profile-ten-kappa.vercel.app'
})

export default httpRequest