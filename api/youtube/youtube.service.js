import axios from "axios"
const YT_KEY = process.env.YT_KEY

export const youtubeService = {
    getId,
}


async function getId(trackName) {
    try {
        const url = _getUrl(trackName)
        const res = await axios.get(url)
        if (res.data.items && res.data.items.length > 0) {
            return res.data.items[0].id.videoId
        } else {
            throw new Error('No video found')
        }
    } catch (error) {
        console.error('Error fetching YouTube ID:', error.response ? error.response.data : error.message)
        throw error
    }
}

function _getUrl(trackName) {
    return `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&` +
        `videoEmbeddable=true&` +
        `type=video&` +
        `key=${YT_KEY}&q=${trackName}`
}
