import express from 'express'

import getStage from '../controllers/dictionary/getStage'
import getTypePlan from '../controllers/dictionary/getTypePlan'
import getParametrType from '../controllers/dictionary/getParametrType'

const router = express.Router()

router.get('/stage', getStage) //api/dictionary/stage
router.get('/typePlan', getTypePlan) //api/dictionary/typePlan
router.get('/parametrType', getParametrType) //api/dictionary/parametrType

export default router;