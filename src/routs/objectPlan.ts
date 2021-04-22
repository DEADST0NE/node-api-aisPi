import express from 'express'
import geListObjectsPlan from '../controllers/objectPlan/getListObjectsPlan'
import getDitailObjectPlan from '../controllers/objectPlan/getDitailObjectPlan'
import putChangeStatusObjectPlan from '../controllers/objectPlan/putChangeStatusObjectPlan'
import postObjectPlan from '../controllers/objectPlan/postObjectPlan'
import getPlan from '../controllers/objectPlan/getPlan'
import putValueObjectSectionParametr from '../controllers/objectPlan/putValueObjectSectionParametr'
import putObjectPlan from '../controllers/objectPlan/putObjectPlan'
import deleteObjectPlan from '../controllers/objectPlan/deleteObjectPlan';
import putStatusPlan from '../controllers/objectPlan/putStatusPlan';

const router = express.Router()

router.get('/listObjectsPlan', geListObjectsPlan) //api/objectsPlan/listObjectsPlan
router.get('/ditailObjectPlan', getDitailObjectPlan) //api/objectsPlan/ditailObjectPlan
router.put('/status', putChangeStatusObjectPlan) //api/objectsPlan/status
router.post('', postObjectPlan) //api/objectsPlan
router.put('', putObjectPlan) //api/objectPlan
router.delete('', deleteObjectPlan) //api/objectPlan
router.get('/plan', getPlan) //api/objectsPlan/plan
router.put('/plan/status', putStatusPlan) //api/objectsPlan/plan/status
router.put('/param', putValueObjectSectionParametr) //api/objectsPlan/param

export default router;