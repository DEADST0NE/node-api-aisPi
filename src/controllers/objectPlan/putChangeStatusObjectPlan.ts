import { Request, Response } from 'express'
import prisma from '../../../prisma'
import moment from 'moment'

const putChangeStatusObjectPlan = (req: Request, res: Response) => { 
  const stageId = req.body.stageId as undefined | number;
  const objectParametrId = req.body.objectParametrId as undefined | string;
  const comment = req.body.comment as undefined | string;
  
  // Переменные
  let planStatus: {statusId: number, dateAdd: string, comment: string | null} | undefined = undefined;
  // ----------
  
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
      const planId = dataOSPS.d_plan_object_section_parametr.d_plan_object_section.d_plan_object.d_plan.id;
    
    // Если статус параметра "Отклонено" то устонавливаем статус плана "Отклонен"
      if(Number(stageId) === 3) {
        await prisma.d_plan_status.findMany({
          where: {
            d_plan: {
              id: planId
            }
          },
          orderBy: {
            date_add: 'desc'
          },
        }).then((dataPS) => {
        // Пороверяем последний стутус плнана 
          if(dataPS[0].s_status_id != 3) {
            prisma.d_plan_status.create({
              data: {
                d_plan: {
                  connect: {
                    id: planId
                  },
                },
                commentt: 'Статус параметра плана был изменен на "Отклонен"',
                date_add: new Date(),
                s_status: {
                  connect: {
                    id: 3
                  }
                }
              }
            }).then((dataOP) => {
              prisma.d_plan.update({
                where: {
                  id: planId,
                },
                data: {
                  s_status: {
                    connect: {
                      id: 3,
                    }
                  },
                }
              }).then(() => {
                const requestData = {
                  paramStatus: {
                    paramId: dataOSPS.d_plan_object_section_parametr.id,
                    statusId: dataOSPS.s_status_id,
                    comment: dataOSPS.commentt,
                    dateAdd: moment(dataOSPS.date_add).format('DD.MM.YYYY')
                  },
                  planStatus: {
                    planId: planId,
                    statusId: dataOP.s_status_id,
                    comment: dataOP.commentt,
                    dateAdd: moment(dataOP.date_add).format('DD.MM.YYYY'),
                  }
                };
                return res.status(200).json(requestData);
              }).catch((err) => {
                console.log(1, err);
                return res.status(500).send({ message: err.message || "Error" });
              });
            }).catch((err) => {
              return res.status(500).send({ message: err.message || "Error" });
            });
          } 
          else {
            const requestData = {
              paramStatus: {
                paramId: dataOSPS.d_plan_object_section_parametr.id,
                statusId: dataOSPS.s_status_id,
                comment: dataOSPS.commentt,
                dateAdd: moment(dataOSPS.date_add).format('DD.MM.YYYY')
              }
            };
            return res.status(200).json(requestData);
          }
        }).catch((err) => {
          return res.status(500).send({ message: err.message || "Error" });
        }); 
      }
    //--------------

    //Если статус исполнено то проверяем все статусы чтобы устоновить статус плана Исполнено
      else if(Number(stageId) === 2) {
        prisma.d_plan.findMany({
          where: {
            id: planId,
          },
          include: {
            d_plan_object: {
              select: {
                d_plan_object_section: {
                  select: {
                    d_plan_object_section_parametr: {
                      select: {
                        d_plan_object_section_parametr_status: {
                          orderBy: {
                            date_add: 'desc'
                          },
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }).then((dataPB) => {
          let status = true; 
          dataPB.forEach(itemPB => {
            itemPB.d_plan_object.forEach(itemPO => {
              itemPO.d_plan_object_section.forEach(itemPOS => {
                itemPOS.d_plan_object_section_parametr.forEach(itemPOSP => {
                  if(itemPOSP?.d_plan_object_section_parametr_status[0]?.s_status_id != 2) {
                    status = false;
                  }
                })
              })
            })
          });
          if(status) { 
            prisma.d_plan_status.create({
              data: {
                d_plan: {
                  connect: {
                    id: planId
                  },
                },
                commentt: 'Все статусы параметров были изменены на "Исполнено"',
                date_add: new Date(),
                s_status: {
                  connect: {
                    id: 2
                  }
                }
              }
            }).then((dataOP) => {
              prisma.d_plan.update({
                where: {
                  id: planId,
                },
                data: {
                  s_status: {
                    connect: {
                      id: 2,
                    }
                  },
                }
              }).then(() => {
                const requestData = {
                  paramStatus: {
                    paramId: dataOSPS.d_plan_object_section_parametr.id,
                    statusId: dataOSPS.s_status_id,
                    comment: dataOSPS.commentt,
                    dateAdd: moment(dataOSPS.date_add).format('DD.MM.YYYY')
                  },
                  planStatus: {
                    planId: planId,
                    statusId: dataOP.s_status_id,
                    comment: dataOP.commentt,
                    dateAdd: moment(dataOP.date_add).format('DD.MM.YYYY'),
                  }
                };
                return res.status(200).json(requestData);
              }).catch((err) => {
                console.log(err);
                return res.status(500).send({ message: err.message || "Error" });
              });
            }).catch((err) => {
              console.log(err)
              return res.status(500).send({ message: err.message || "Error" });
            });
          }else {
            const requestData = {
              paramStatus: {
                paramId: dataOSPS.d_plan_object_section_parametr.id,
                statusId: dataOSPS.s_status_id,
                comment: dataOSPS.commentt,
                dateAdd: moment(dataOSPS.date_add).format('DD.MM.YYYY')
              }
            };
            return res.status(200).json(requestData);
          }
        }).catch((err) => {
          console.log(err);
          return res.status(500).send({ message: err.message || "Error" });
        });
      }
      //-----------

      //Если не одини из условий небыли выполнены
        else {
          const requestData = {
            paramStatus: {
              paramId: dataOSPS.d_plan_object_section_parametr.id,
              statusId: dataOSPS.s_status_id,
              comment: dataOSPS.commentt,
              dateAdd: moment(dataOSPS.date_add).format('DD.MM.YYYY')
            }
          };
          return res.status(200).json(requestData);
        }
      // ------------- 
    }).catch((err) => {
        return res.status(500).send({ message: err.message || "Error" });
    });
  }
  else res.status(400).send({ message: 'Обязательный параметр незадан' || "Error" });
}

export default putChangeStatusObjectPlan