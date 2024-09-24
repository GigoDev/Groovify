import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getTrackId } from './youtube.controller.js'



const router = express.Router()

router.get('/:trackName',requireAuth, getTrackId)

export const youtubeRoutes = router