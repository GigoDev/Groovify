import { logger } from '../../services/logger.service.js'
import { stationService } from './station.service.js'

export async function getStations(req, res) {
	const filterBy = {
		spotifyId: req.query.spotifyId || ''}
	try {
		const stations = await stationService.query(filterBy)
		res.json(stations)
	} catch (err) {
		logger.error('Failed to get stations', err)
		res.status(400).send({ err: 'Failed to get stations' })
	}
}

export async function getStationById(req, res) {
	try {
		const stationId = req.params.id
		const station = await stationService.getById(stationId)
		res.json(station)
	} catch (err) {
		logger.error('Failed to get station', err)
		res.status(400).send({ err: 'Failed to get station' })
	}
}

export async function addStation(req, res) {
	const { loggedinUser, body: station } = req

	try {
		station.owner = loggedinUser
		const addedStation = await stationService.add(station)
		res.json(addedStation)
	} catch (err) {
		logger.error('Failed to add station', err)
		res.status(400).send({ err: 'Failed to add station' })
	}
}

export async function updateStation(req, res) {
	const { loggedinUser, body: station } = req
	const { _id: userId, isAdmin } = loggedinUser

	// if (!isAdmin && station.owner._id !== userId) {
	// 	res.status(403).send('Not your station...')
	// 	return
	// }
	
	try {
		const updatedStation = await stationService.update(station)
		res.json(updatedStation)
	} catch (err) {
		logger.error('Failed to update station', err)
		res.status(400).send({ err: 'Failed to update station' })
	}
}

export async function removeStation(req, res) {
	try {
		const stationId = req.params.id
		const removedId = await stationService.remove(stationId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove station', err)
		res.status(400).send({ err: 'Failed to remove station' })
	}
}

export async function addStationMsg(req, res) {
	const { loggedinUser } = req

	try {
		const stationId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		const savedMsg = await stationService.addStationMsg(stationId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to update station', err)
		res.status(400).send({ err: 'Failed to update station' })
	}
}

export async function removeStationMsg(req, res) {
	try {
		const stationId = req.params.id
		const { msgId } = req.params

		const removedId = await stationService.removeStationMsg(stationId, msgId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove station msg', err)
		res.status(400).send({ err: 'Failed to remove station msg' })
	}
}
