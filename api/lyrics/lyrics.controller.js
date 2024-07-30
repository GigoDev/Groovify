import { logger } from '../../services/logger.service.js'
import { lyricsService } from './lyrics.service.js'
// getLyrics()
export async function getLyrics(req, res) {
	const term = req.query.term
	const artist = req.query.artist
	// console.log('artist from controller', artist)
	// console.log('term from controller', term)
	try {
		const lyrics = await lyricsService.getLyrics(term, artist)
		res.json(lyrics)
	} catch (err) {
		logger.error('Cannot get data from Genius lyrics API', err)
		res.status(400).json({ error: 'Failed to get lyrics from Genius API' });
	}
}