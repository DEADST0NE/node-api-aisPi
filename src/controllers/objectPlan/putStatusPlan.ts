import { Request, Response } from 'express'
import prisma from '../../../prisma'
import moment from 'moment'

const putStatusPlan = (req: Request, res: Response) => {  
  const planId = req.body.planId as undefined | string;
  const statusId = req.body.statusId as undefined | number;
  const comment = req.body.comment as undefined | string;
  if(planId && Number(statusId) >= 0) {
    prisma.d_plan.update({
      where: {
        id: planId,
      },
      data: {
        s_status: {
          connect: {
            id: Number(statusId)
          }
        }
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
      prisma.d_plan_status.create({
        data: {
          commentt: comment,
          d_plan: {
            connect: {
              id: data.id,
            }
          },
          s_status: {
            connect: {
              id: data.s_status_id_current
            }
          },
          date_add: new Date(),
        }
      }).then(() => {
        const requsetData = {
          id: data.id,
          codeOkei: data?.code_okei,
          organizationName: data?.s_organization.organization_name,
          dateCreate: moment(data?.date_create).format('DD.MM.YYYY'), 
          planType: data?.s_plan_type.type_name,
          status: data?.s_status_id_current,
          number: data?.number,
          name: data?.name
        };
        return res.status(200).json(requsetData);
      }).catch((err) => {
        res.status(500).send({ message: err.message || "Error" });
      });
      
    }).catch((err) => {
        res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'id компании обязателен' || "Error" });
}

export default putStatusPlan