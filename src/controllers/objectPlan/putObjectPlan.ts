import { Request, Response } from 'express'
import prisma from '../../../prisma'

const putObjectPlan = (req: Request, res: Response) => { 
  const objectId = req.body.objectId as undefined | string;
  const objectName = req.body.objectName as undefined | string;
  const objectType = req.body.objectType as undefined | string;
  const kbk = req.body.kbk as undefined | string;
  const objectValue = req.body.kbk as undefined | string;
  const planYearBudget = req.body.planYearBudget as undefined | number;
  const planYearBudget1 = req.body.planYearBudget1 as undefined | number;
  const planYearBudget2 = req.body.planYearBudget2 as undefined | number;
  const indicatorName = req.body.indicatorName as undefined | string;
  const unitName = req.body.unitName as undefined | string;
  const basesValue = req.body.basesValue as undefined | string;
  const financialYearPlan = req.body.financialYearPlan as undefined | number;
  const financialYearPlan1 = req.body.financialYearPlan1 as undefined | number;
  const financialYearPlan2 = req.body.financialYearPlan2 as undefined | number;

  if(objectId && objectName && kbk && Number(planYearBudget) >= 0 && Number(planYearBudget1) >= 0 && Number(planYearBudget2) >= 0) {
    console.log(basesValue);
    prisma.d_plan_object.update({
      where: {
        id: objectId,
      },
      data: { 
        object_name: objectName,
        object_value: objectValue,
        indicator_name: indicatorName,
        unit_name: unitName,
        bases_value: basesValue,
        financial_year_plan: financialYearPlan,
        financial_year_plan1: financialYearPlan1,
        financial_year_plan2: financialYearPlan2, 
        s_parametr_type: {
          connect: {
            id: Number(objectType),
          }
        },
        kbk: kbk,
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
    }).then( async (data) => {

      const requestData = {
        id: data.id,
        objectName: data.object_name,
        number: data.object_number,
        type: {
          id: data.s_parametr_type?.id,
          name: data.s_parametr_type?.parametr_name,
        },
        planYearBudget: data.plan_year_budget,
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
        return res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'Обязательный параметр незадан' || "Error" });
}

export default putObjectPlan