import { Request, Response } from 'express'
import prisma from '../../../prisma'

import { getToken } from '../../utils/token'
import { hash } from '../../utils/bcrypt'

const changePassword = async(req: Request, res: Response) => {
  if (!req.body.accountId) return res.status(400).json({ accountId: 'Акаунт не зарегистрирован' }); 
  if (!req.body.passwordNew) return res.status(400).json({ passwordNew: 'Новый пароль не задан' }); 
  if (!req.body.passwordOld) return res.status(400).json({ passwordOld: 'Пароль не подходит' });
  const passwordHash = await hash(req.body.passwordNew);  

  try { 
    prisma.s_accounts.update({
      where: {
        id: req.body.accountId,
      },
      data: {
        password : passwordHash, 
      },
      select: {
        id: true,
        login: true,
        password: true,
        s_employee: {
          select: {
            id: true,
            employee_name: true,
            phone_number: true, 
            s_organization: {
              select: {
                id: true,
                organization_name: true, 
              }
            }
          }
        }
      }
    }).then(async (condidate) => {
      if(condidate) {
        const userData = {
          id: condidate.id,
          login: condidate.login,
          employee: {
            id: condidate.s_employee.id,
            name: condidate.s_employee.employee_name,
            phone: condidate.s_employee.phone_number, 
          },
          orientation: {
            id: condidate.s_employee.s_organization.id,
            name: condidate.s_employee.s_organization.organization_name,
          }
        };

        return res.status(200).json({ ...getToken({
          ...userData,
        }) });
      }
      else
        return res.status(400).json({ email: 'Текущий email не зарегистрирован' });
    })
  }
  catch (err){ 
    return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
  }  
}

export default changePassword;