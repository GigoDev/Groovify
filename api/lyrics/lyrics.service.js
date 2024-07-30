import Genius from 'genius-lyrics'


export const lyricsService = {
	getLyrics
}
// getLyrics()
async function getLyrics(term = '', artist = '') {
	const geniusApiKey = process.env.GENIUS_API_KEY
	const Client = new Genius.Client(geniusApiKey)
	try {
		const searches = await Client.songs.search(term)
		// console.log('Search', searches)
		
		var songs = searches.filter(song => song.artist.name === artist)
		console.log('songs', songs)
		songs = songs.filter(song => song.title === term)
		// console.log('songs', songs)
		const lyrics = await songs[0].lyrics()
		return lyrics
	} catch (error) {
		console.error(error)
	}
}