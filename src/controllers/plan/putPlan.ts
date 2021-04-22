import { Request, Response } from 'express'
import prisma from '../../../prisma'
import moment from 'moment'

const putPlan = (req: Request, res: Response) => { 
  const id = req.body.id as undefined | string;
  const namePlan = req.body.namePlan as undefined | string;
  const yearStart = req.body.yearStart as undefined | number;
  const yearStop = req.body.yearStop as undefined | number;
  const codeOKEI = req.body.codeOKEI as undefined | number;
  const planType = req.body.planType as undefined | number;

  if(id && yearStart && yearStop && codeOKEI && planType && namePlan) {
    prisma.d_plan.update({
      where: {
        id: id,
      },
      data: {
        name: namePlan,
        year_start: new Date(Number(yearStart)).getFullYear(),
        year_stop: new Date(Number(yearStop)).getFullYear(),
        code_okei: Number(codeOKEI),
        s_plan_type: {
          connect: {
            id: Number(planType)
          }
        },
        s_status: {
          connect: {
            id: 0,
          }
        },
        date_create: new Date(),
        date_sent: new Date(),
        date_register: new Date(),
        commentt: '',
        d_plan_status: {
          create: {
            date_add: new Date(),
            commentt: 'План создан',
            s_status: {
              connect: {
                id: 0
              }
            }
          }
        }
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

export default putPlan