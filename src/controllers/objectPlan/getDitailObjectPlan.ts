import { Request, Response } from 'express'
import prisma from '../../../prisma'
import moment from 'moment'

const getDitailObjectPlan = (req: Request, res: Response) => { 
  const objectPlanId = req.query.objectPlanId as undefined | string;

  if(objectPlanId) {

    prisma.d_plan_object_section.findMany({
      where: {
        d_plan_object: {
          id: objectPlanId
        }
      },
      select: {
        id: true,
        s_section: {
          select: {
            section_name: true,
          }
        },
        d_plan_object: {
          select: {
            indicator_name: true,
            unit_name: true,
            bases_value: true,
            financial_year_budget: true,
            financial_year_plan1: true,
            financial_year_plan2: true,
            plan_year_budget: true,
            plan_year_budget1: true,
            plan_year_budget2: true,
            object_value: true,
            d_plan: {
              select: {
                date_register: true
              }
            }
          }
        },
        d_plan_object_section_parametr: {
          orderBy: {
            s_section_parametr_id: 'asc'
          },
          select: {
            id: true, 
            date_add: true,
            value: true,
            d_plan_object_section_parametr_status: {
              orderBy: {
                date_add: "desc"
              },
              select: {
                s_status_id: true,
                commentt: true,
                date_add: true,
              }
            },
            s_section_parametr: {
              select: {
                parametr_name: true
              }
            }
          }
        }
      }
    }).then(data => {
      const requestData = {
        planYearBudget: data[0]?.d_plan_object.plan_year_budget,
        planYearBudget1: data[0]?.d_plan_object.plan_year_budget1,
        planYearBudget2: data[0]?.d_plan_object.plan_year_budget2,
        objectValue: data[0]?.d_plan_object.object_value,
        indicatorName: data[0].d_plan_object.indicator_name,
        unitName: data[0].d_plan_object.unit_name,
        basesValue: data[0].d_plan_object.bases_value,
        financialYearBudget: data[0].d_plan_object.financial_year_budget,
        financialYearPlan1: data[0].d_plan_object.financial_year_plan1,
        financialYearPlan2: data[0].d_plan_object.financial_year_plan2,
        date: moment(data[0]?.d_plan_object.d_plan.date_register).format('DD.MM.YYYY'),
        section: data?.map(item => ({
          id: item.id,
          name: item.s_section.section_name,
          params: item.d_plan_object_section_parametr.map(itemP => ({
            id: itemP.id,
            dateAdd: moment(itemP.date_add).format('DD.MM.YYYY'),
            name: itemP.s_section_parametr.parametr_name,
            value: itemP.value,
            status: {
              statusId: itemP.d_plan_object_section_parametr_status[0]?.s_status_id,
              comment: itemP.d_plan_object_section_parametr_status[0]?.commentt,
              dateAdd: itemP.d_plan_object_section_parametr_status[0]?.date_add,
            }
          }))
        })),
      };

      return res.status(200).json(requestData);
    }).catch(err => {
      res.status(500).send({ message: err.message || "Error" });
    });

  }
  else res.status(400).send({ message: 'id компании обязателен' || "Error" });
}

export default getDitailObjectPlan