import { Request, Response } from 'express'
import prisma from '../../../prisma'

const geListObjectsPlan = (req: Request, res: Response) => { 
  const planId = req.query.planId as undefined | string;
  const searchValue = req.query.searchValue as undefined | string;
  const filterType = req.query.filterType as undefined | number;

  if(planId) {
    prisma.d_plan_object.findMany({
      where: {
        d_plan_id: planId,
        OR: searchValue ? [{
          object_name: { 
            contains: String(searchValue),
            mode: "insensitive"
          }
        }, {
          kbk: { 
            contains: String(searchValue),
            mode: "insensitive",
          }
        }] : undefined,
        object_type_id: filterType ? {
          in: Number(filterType)
        } : undefined,
      },
      orderBy: [
        {
          object_type_id: 'asc',
        },{
          object_number: 'asc',
        },
      ],
      include: {
        s_parametr_type: true,
      }
    }).then((data) => { 
      console.log(data);
      const requestData = data.map(item => ({
        id: item.id,
        objectName: item.object_name,
        number: item.object_number,
        type: {
          id: item.s_parametr_type?.id,
          name: item.s_parametr_type?.parametr_name,
        },
        planYearBudget: item.plan_year_budget,
        planYearBudget1: item.plan_year_budget1,
        planYearBudget2: item.plan_year_budget2,
        indicatorName: item.indicator_name,
        unitName: item.unit_name,
        basesValue: item.bases_value,
        financialYearBudget: item.financial_year_budget,
        financialYearPlan: item.financial_year_plan,
        financialYearPlan1: item.financial_year_plan1,
        financialYearPlan2: item.financial_year_plan2,
        kbk: item.kbk,
        objectValue: item.object_value,
      }));
      return res.status(200).json(requestData);
    }).catch((err) => {
        res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'id компании обязателен' || "Error" });
}

export default geListObjectsPlan