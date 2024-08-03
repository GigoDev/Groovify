import express from 'express'
import { getToken } from "./spotify.controller.js";
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/get-token',requireAuth, getToken)

export const spotifyRoutes = router