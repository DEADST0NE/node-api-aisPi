import { Request, Response } from 'express'
import prisma from '../../../prisma'


const valueObjectSelectionParametr = (selectionId:number, paramId: number, object: {
  organizationName: string,
  objectType: string,
  objectName: string
}): string => {
  const objcetTypeName = (id: string): string => { 
    switch(Number(id)){
      case 1:
        return 'Эксплуатация';
      case 2:
        return 'Создание';
      default: 
        return '';
    }
  }
  if(selectionId === 1) {
    switch(paramId) {
      case 1: 
        return object.organizationName;
      case 2:
        return object.objectName;
      case 3:
        return objcetTypeName(object.objectType);
      case 5:
        return objcetTypeName(object.objectType);
      default: 
        return '';
    }
  }else {
    return '';
  }
  
} 


const postObjectPlan = (req: Request, res: Response) => { 
  const planId = req.body.planId as undefined | string;
  const objectName = req.body.objectName as undefined | string;
  const objectType = req.body.objectType as undefined | string;
  const kbk = req.body.kbk as undefined | string;
  const objectValue = req.body.kbk as undefined | string;
  const planYearBudget = req.body.planYearBudget as undefined | number;
  const planYearBudget1 = req.body.planYearBudget1 as undefined | number;
  const planYearBudget2 = req.body.planYearBudget2 as undefined | number;

  if(planId && objectName && objectType && kbk && Number(planYearBudget) >= 0 && Number(planYearBudget1) >= 0 && Number(planYearBudget2) >= 0) {
    prisma.d_plan_object.create({
      data: { 
        object_name: objectName,
        object_value: objectValue,
        s_parametr_type: {
          connect: {
            id: Number(objectType),
          }
        },
        kbk: kbk,
        d_plan: {
          connect: {
            id: planId,
          }
        },
        plan_year_budget:  Number(planYearBudget),
        plan_year_budget1: Number(planYearBudget1),
        plan_year_budget2: Number(planYearBudget2),
        financial_year_budget: 0,
      },
      include: {
        d_plan: {
          select: {
            s_organization: {
              select: {
                organization_name: true,
              }
            }
          }
        },
        s_parametr_type: true,
      }
    }).then((data) => {

      prisma.s_section.findMany({
        select: {
          id: true,
          s_section_parametr: {
            select: {
              id: true,
              parametr_name: true,
            }
          },
        }
      }).then(async (dataS) => { 
        // Создаем разделы объекта
        for await (let itemOS of dataS) {
          new Promise((resolveOS, rejectOS) => {
            prisma.d_plan_object_section.create({
              data: {
                d_plan_object_id: data.id,
                s_section_id: itemOS.id,
              },
              select: {
                id: true,
                s_section_id: true,
              }
            }).then( async (dataOS) => {
              // Создаем параметры обьекта
              for await (let itemSP of itemOS.s_section_parametr) {
                new Promise((resolvePS, rejectPS) => {
                  prisma.d_plan_object_section_parametr.create({
                    data: {
                      d_plan_object_section: {
                        connect: {
                          id: dataOS.id
                        }
                      },
                      date_add: new Date(),
                      value: valueObjectSelectionParametr( 
                        dataOS.s_section_id, 
                        itemSP.id, 
                        {
                          organizationName: data.d_plan.s_organization.organization_name,
                          objectName,
                          objectType
                        } 
                      ),
                      d_plan_object_section_parametr_status: {
                        create: {
                          s_status: {
                            connect: {
                              id: 0
                            }
                          },
                          date_add: new Date(),
                        }
                      },
                      s_section_parametr: {
                        connect: {
                          id: itemSP.id
                        }
                      }
                    }
                  }).then(() => {
                    resolvePS(true);
                  }).catch((errPS) => {
                    rejectPS(errPS);
                  })
                })
              }
              resolveOS(dataOS);
            }).catch((errOS) => {
              rejectOS(errOS);
            })
          });
        }

        const requestData = {
          id: data.id,
          name: data.object_name,
          number: data.object_number,
          type: {
            id: data.s_parametr_type?.id,
            name: data.s_parametr_type?.parametr_name,
          },
          planYearBudget0: data.plan_year_budget,
          planYearBudget1: data.plan_year_budget1,
          planYearBudget2: data.plan_year_budget2,
          indicatorName: data.indicator_name,
          unitName: data.unit_name,
          basesValue: data.bases_value,
          financialYearBudget: data.financial_year_budget,
          financialYearPlan: data.financial_year_plan,
          financialYearPlan1: data.financial_year_plan1,
          financialYearPlan2: data.financial_year_plan2,
          kbk: data.kbk,
          objectValue: data.object_value,
        };
        return res.status(200).json(requestData); 

      }).catch((err) => {
        res.status(500).send({ message: err.message || "Error" });
      });

    }).catch((err) => {
      res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'id компании обязателен' || "Error" });
}

export default postObjectPlan