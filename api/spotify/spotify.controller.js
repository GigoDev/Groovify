import { logger } from '../../services/logger.service.js'
import { spotifyService } from "./spotify.service.js"

export async function getToken(req, res) {
	
	try {
		const token = await spotifyService.getToken()
		res.json(token)
	} catch (err) {
		logger.error('Cannot get token from spotify API', err)
		res.status(400).json({ error: 'Failed to get token from spotify API' })
	}
}