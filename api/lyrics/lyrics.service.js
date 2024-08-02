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

		let matchingSongs = searches.filter(song => 
            song.artist.name.toLowerCase().includes(artist.toLowerCase()) ||
            song.title.toLowerCase().includes(term.toLowerCase())
        ).map(song => {
            let score = 0
            // Increase score for exact matches
            if (song.artist.name.toLowerCase() === artist.toLowerCase()) score += 3
            else if (song.artist.name.toLowerCase().includes(artist.toLowerCase())) score += 2
            
            if (song.title.toLowerCase() === term.toLowerCase()) score += 3
            else if (song.title.toLowerCase().includes(term.toLowerCase())) score += 2
            
            return { song, score }
        })

        
        matchingSongs.sort((a, b) => b.score - a.score)
		// console.log('songs', songs)

		const bestMatch = matchingSongs[0].song
		const lyrics = await bestMatch.lyrics()
		return lyrics
	} catch (error) {
		console.error(error)
	}
}