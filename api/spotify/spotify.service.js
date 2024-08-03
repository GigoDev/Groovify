import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config();

export const spotifyService = {
    getToken,
}

async function getToken() {
    const url = 'https://accounts.spotify.com/api/token';
    const headers = {
      headers: {Accept: "application/json","Content-Type": "application/x-www-form-urlencoded"},
      auth: {username: process.env.CLIENT_ID, password: process.env.CLIENT_SECRET}
    }
    const data = {grant_type: "client_credentials"}
  
    try {
      const response = await axios.post(url, data, headers)
      return response.data.access_token 
    } catch (error) {
      console.error('Error fetching token:', error)
      res.status(500).json({ error: 'Error fetching token' })
    }
}
