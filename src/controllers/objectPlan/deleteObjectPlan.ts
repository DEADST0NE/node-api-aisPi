import { Request, Response } from 'express'
import prisma from '../../../prisma'

const deleteObjectPlan = (req: Request, res: Response) => { 
  const id = req.query.id as undefined | string;
  
  if(id) { 
    prisma.d_plan_object_section_parametr_status.findMany({
      where: {
        d_plan_object_section_parametr: {
          d_plan_object_section: {
            d_plan_object: {
              id: id
            }
          }
        }
      }
    }).then(() => {
      prisma.d_plan_object_section_parametr_status.deleteMany({
        where: {
          d_plan_object_section_parametr: {
            d_plan_object_section: {
              d_plan_object: {
                id: id
              }
            }
          }
        }
      }).then(() => {
        prisma.d_plan_object_section_parametr.deleteMany({
          where: {
            d_plan_object_section: {
              d_plan_object: {
                id: id
              }
            }
          }
        }).then(() => {
          prisma.d_plan_object_section.deleteMany({
            where: {
              d_plan_object: {
                id: id
              }
            }
          }).then(() => {
            prisma.d_plan_object.delete({
              where: {
                id: id
              }
            }).then((data) => {
              return res.status(200).json({id: data.id}); 
            }).catch((err) => {
              return res.status(500).send({ message: err.message || "Error" });
            })
          }).catch((err) => {
            return res.status(500).send({ message: err.message || "Error" });
          })
        }).catch((err) => {
          return res.status(500).send({ message: err.message || "Error" });
        })
      }).catch((err) => {
        return res.status(500).send({ message: err.message || "Error" });
      })
    }) 
  }
  else res.status(400).send({ message: 'Обязательный параметр незадан' || "Error" });
}

export default deleteObjectPlan