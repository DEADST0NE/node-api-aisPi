import express from 'express' 
import passport from 'passport'
import multer from 'multer'

import authRoutes from './routs/auth'
import planRoutes from './routs/plan'
import dictionaryRoutes from './routs/dictionary'
import statisticRoutes from './routs/statistic'
import objectPlanRoutes from './routs/objectPlan'

import middlewarePassportJs from './middleware/passport'

const app = express()

// Вспомогательные модули
  app.use(require("morgan")("dev"))
  app.use(passport.initialize())
  middlewarePassportJs(passport)
  app.use(require('cors')())
  app.use(express.json({
    limit: '50mb'
  }))
  app.use(express.urlencoded({
    limit: '50mb',
    extended: true
  }))
  app.use(multer().any())
  app.use(express.static('public'))
// ======================

// Роуты
  app.use('/api/auth', authRoutes)
  app.use('/api/plan', planRoutes)
  app.use('/api/statistic', statisticRoutes)
  app.use('/api/dictionary', dictionaryRoutes)
  app.use('/api/objectPlan', objectPlanRoutes)
// ===== 

export default app