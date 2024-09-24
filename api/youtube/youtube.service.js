import axios from "axios"
const YT_KEY = process.env.YT_KEY

export const youtubeService = {
    getId,
}


async function getId(trackName) {
    try {
        const url = _getUrl(trackName)
        const res = await axios.get(url)
        return res.data.items[0].id.videoId
    } catch (error) {
        console.log(error)
    }
}

function _getUrl(trackName) {
    return `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&` +
        `videoEmbeddable=true&` +
        `type=video&` +
        `key=${YT_KEY}&q=${trackName}`
}
