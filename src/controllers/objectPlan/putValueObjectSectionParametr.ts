import { Request, Response } from 'express'
import prisma from '../../../prisma'

const putValueObjectSectionParametr = (req: Request, res: Response) => { 
  const id = req.body.id as undefined | string;
  const value = req.body.value as undefined | string;
  
  if(id && value) {
    prisma.d_plan_object_section_parametr.update({
      where: {
        id: id,
      },
      data: {
        value: value,
      },
      select: {
        id: true,
        value: true,
        d_plan_object_section: {
          select: {
            id: true,
          }
        }
      }
    }).then( async (data) => {
      const requestData = {
        id: data.id,
        selectionId: data.d_plan_object_section.id, 
        value: data.value
      }
      return res.status(200).json(requestData); 
    }).catch((err) => {
        return res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'Обязательный параметр незадан' || "Error" });
}

export default putValueObjectSectionParametr