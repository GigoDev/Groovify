import { logger } from '../../services/logger.service.js'
import { youtubeService } from "./youtube.service.js"

export async function getTrackId(req, res) {
	try {
		const { trackName } = req.params
		const Id = await youtubeService.getId(trackName)
		res.json(Id)
	} catch (err) {
		logger.error('Cannot get token from youtube API', err)
		res.status(400).json({ error: 'Failed to get token from youtube API' })
	}
}