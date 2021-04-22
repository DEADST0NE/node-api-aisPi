import { Request, Response } from 'express'
import prisma from '../../../prisma'
import moment from 'moment'

const deletePlan = (req: Request, res: Response) => { 
  const id = req.query.id as undefined | string;

  if(id) {
    prisma.d_plan.update({
      where: {
        id: id,
      },
      data: {
        is_remove: true,
      }
      ,
      include: {
       d_plan_status: {
        orderBy: {
          date_add: "desc"
        },
       },
      }
    }).then((data) => {
      const requsetData = {
        id: data.id,
        yearStart: data.year_start,
        yearStop: data.year_stop,
        dateCreate: moment(data.date_create).format('DD.MM.YYYY'),
        dateSent: moment(data.date_sent).format('DD.MM.YYYY'),
        dateRegister: moment(data.date_register).format('DD.MM.YYYY'),
        comment: data.commentt,
        planTypeId: data.s_plan_type_id,
        statusId: data.d_plan_status[0].s_status_id,
        number: data.number,
        name: data.name,
        codeOKEI: data.code_okei,
      };
      return res.status(200).json(requsetData);
    }).catch((err) => {
      console.log(err);
        res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'id компании обязателен' || "Error" });
}

export default deletePlan