import { Request, Response } from 'express'
import prisma from '../../../prisma'
import moment from 'moment'

const putChangeStatusObjectPlan = (req: Request, res: Response) => { 
  const stageId = req.body.stageId as undefined | number;
  const objectParametrId = req.body.objectParametrId as undefined | string;
  const comment = req.body.comment as undefined | string;
  
  if(stageId && objectParametrId) {
    prisma.d_plan_object_section_parametr_status.create({
      data: {
        d_plan_object_section_parametr: {
          connect: {
            id: objectParametrId,
          }
        },
        s_status: {
          connect: {
            id: Number(stageId)
          },
        },
        date_add: new Date(),
        commentt: comment
      },
      include: {
        d_plan_object_section_parametr: {
          select: {
            id: true,
            d_plan_object_section: {
              include: {
                d_plan_object: {
                  include: {
                    d_plan: {
                      select: {
                        id: true,
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }).then( async (dataOSPS) => { 
      const requestData = {
        paramStatus: {
          paramId: dataOSPS.d_plan_object_section_parametr.id,
          statusId: dataOSPS.s_status_id,
          comment: dataOSPS.commentt,
          dateAdd: moment(dataOSPS.date_add).format('DD.MM.YYYY')
        }
      };
      return res.status(200).json(requestData);
    }).catch((err) => {
        return res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'Обязательный параметр незадан' || "Error" });
}

export default putChangeStatusObjectPlan