import { Request, Response } from 'express'
import prisma from '../../../prisma'
import moment from 'moment'

const getPlan = (req: Request, res: Response) => { 
  prisma.d_plan.findMany().then((data) => {
    const requsetData = {
      count: data.length,
      completed: data.reduce((a, item) => (a= a + item.s_status_id_current === 2 ? 1 : 0), 0),
      denied: data.reduce((a, item) => (a= a + item.s_status_id_current === 3 ? 1 : 0), 0),
    };
    return res.status(200).json(requsetData);
  }).catch((err) => {
      res.status(500).send({ message: err.message || "Error" });
  });
}

export default getPlan