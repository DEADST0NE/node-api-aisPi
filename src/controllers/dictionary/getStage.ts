import { Request, Response } from 'express'
import prisma from '../../../prisma'

const getStage = (req: Request, res: Response) => {
  prisma.s_status.findMany().then((data) => {
    const requsetData = data.map(item => ({
      value: item.id,
      label: item.status_name
    }));
    return res.status(200).json(requsetData);
  }).catch((err) => {
      res.status(500).send({ message: err.message || "Error" });
  });
}

export default getStage