import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'


const PAGE_SIZE = 3

export const stationService = {
	remove,
	query,
	getById,
	add,
	update,
	addStationMsg,
	removeStationMsg,
}

async function query(filterBy = { txt: '' }) {
	try {
		const criteria = _buildCriteria()
		// const sort = _buildSort(filterBy)

		const collection = await dbService.getCollection('station')
		var stationCursor = await collection.find(criteria)

		const stations = stationCursor.toArray()
		console.log(stations)
		return stations
	} catch (err) {
		logger.error('cannot find stations', err)
		throw err
	}
}

async function getById(stationId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(stationId) }

		const collection = await dbService.getCollection('station')
		const station = await collection.findOne(criteria)
		station.createdAt = station._id.getTimestamp()
		return station
	} catch (err) {
		logger.error(`while finding station ${stationId}`, err)
		throw err
	}
}

async function remove(stationId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: ownerId, isAdmin } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(stationId),
		}
		if (!isAdmin) criteria['owner._id'] = ownerId

		const collection = await dbService.getCollection('station')
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your station')
		return stationId
	} catch (err) {
		logger.error(`cannot remove station ${stationId}`, err)
		throw err
	}
}

async function add(station) {
	try {
		const collection = await dbService.getCollection('station')
		await collection.insertOne(station)

		return station
	} catch (err) {
		logger.error('cannot insert station', err)
		throw err
	}
}

async function update(station) {
	const stationToSave = { name: station.name, description: station.description, imgs: station.imgs, tracks: station.tracks }

	try {
		const criteria = { _id: ObjectId.createFromHexString(station._id) }

		const collection = await dbService.getCollection('station')
		await collection.updateOne(criteria, { $set: stationToSave })

		return station
	} catch (err) {
		logger.error(`cannot update station ${station._id}`, err)
		throw err
	}
}

async function addStationMsg(stationId, msg) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(stationId) }
		msg.id = makeId()

		const collection = await dbService.getCollection('station')
		await collection.updateOne(criteria, { $push: { msgs: msg } })

		return msg
	} catch (err) {
		logger.error(`cannot add station msg ${stationId}`, err)
		throw err
	}
}

async function removeStationMsg(stationId, msgId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(stationId) }

		const collection = await dbService.getCollection('station')
		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId } } })

		return msgId
	} catch (err) {
		logger.error(`cannot add station msg ${stationId}`, err)
		throw err
	}
}

function _buildCriteria() {
	const { loggedinUser } = asyncLocalStorage.getStore()

	const criteria = {
		$or: [
			{ "owner._id": loggedinUser._id },  // Match documents where owner._id matches logged-in user's ID
			{ owner: null }       // Match documents where the owner field is explicitly set to null
		]

	}

	return criteria
}

function _buildSort(filterBy) {
	if (!filterBy.sortField) return {}
	return { [filterBy.sortField]: filterBy.sortDir }
}