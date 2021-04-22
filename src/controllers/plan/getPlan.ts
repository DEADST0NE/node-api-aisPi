import { Request, Response } from 'express'
import prisma from '../../../prisma'
import moment from 'moment'

const getPlan = (req: Request, res: Response) => { 
  const organizarionId = req.query.organizarionId as undefined | string;
  const searchValue = req.query.searchValue as undefined | string;
  const filterPlanView = req.query.filterPlanView  as undefined | number;
  const filterStage = req.query.filterStage as undefined | number; 
  if(organizarionId) {
    prisma.d_plan.findMany({
      where: {
        s_organizarion_id: organizarionId === '00000000-0000-0000-0000-000000000000' ? undefined : organizarionId,
        is_remove: false,
        OR: searchValue ? [{
          name: { 
            contains: String(searchValue),
            mode: "insensitive"
          }
        }, {
          number: { 
            in: Number(searchValue),
          }
        }, {
          s_organization: {
            organization_name: {
              contains: String(searchValue),
              mode: "insensitive"
            }
          }
        }] : undefined,
        s_status_id_current: filterStage ? {
          in: Number(filterStage)
        } : undefined,
        s_plan_type_id: filterPlanView ? {
          in: Number(filterPlanView)
        } : undefined,
      },
      include: {  
       d_plan_status: {
        orderBy: {
          date_add: "desc"
        },
       },
      }
    }).then((data) => {
      const requsetData = data.map(item => ({
        id: item.id,
        yearStart: item.year_start,
        yearStop: item.year_stop,
        dateCreate: moment(item.date_create).format('DD.MM.YYYY'),
        dateSent: moment(item.date_sent).format('DD.MM.YYYY'),
        dateRegister: moment(item.date_register).format('DD.MM.YYYY'),
        comment: item.commentt,
        planTypeId: item.s_plan_type_id,
        statusId: item.d_plan_status[0].s_status_id,
        number: item.number,
        name: item.name,
        codeOKEI: item.code_okei,
      }));
      return res.status(200).json(requsetData);
    }).catch((err) => {
        res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'id компании обязателен' || "Error" });
}

export default getPlan