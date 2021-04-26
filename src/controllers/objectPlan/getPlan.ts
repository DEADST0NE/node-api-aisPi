import { Request, Response } from 'express'
import prisma from '../../../prisma'
import moment from 'moment'

const getPlan = (req: Request, res: Response) => {  
  const planId = req.query.planId as undefined | string;
  if(planId) {
    prisma.d_plan.findUnique({
      where: {
        id: planId,
      },
      include: {
       d_plan_status: {
        orderBy: {
          date_add: "desc"
        },
       },
       s_plan_type: {
         select: {
           type_name: true
         }
       },
       s_organization: {
         select: {
           organization_name: true,
         }
       }
      }
    }).then((data) => {
      const requsetData = {
        id: data?.id,
        codeOkei: data?.code_okei,
        organizationName: data?.s_organization.organization_name,
        dateCreate: moment(data?.date_create).format('DD.MM.YYYY'), 
        planType: data?.s_plan_type.type_name,
        status: {
          id: data?.d_plan_status[0].s_status_id,
          comment: data?.d_plan_status[0].commentt
        },
        number: data?.number,
        name: data?.name
      };
      return res.status(200).json(requsetData);
    }).catch((err) => {
        res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'id компании обязателен' || "Error" });
}

export default getPlan