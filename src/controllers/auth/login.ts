import { Request, Response } from 'express'
import prisma from '../../../prisma'

import { getToken } from '../../utils/token'
import { compare } from '../../utils/bcrypt'

const login = (req: Request, res: Response) => {
  if (!req.body.email) return res.status(400).json({ email: 'Логин не указан' }); 
  try { 
    prisma.s_accounts.findUnique({
      where: {
        login: req.body.email,
      },
      select: {
        id: true,
        login: true,
        password: true,
        s_employee: {
          select: {
            id: true,
            s_role: true,
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
        if(await compare(req.body.password, condidate?.password)) { 
          const userData = {
            id: condidate.id,
            email: condidate.login,
            employee: {
              id: condidate.s_employee.id,
              name: condidate.s_employee.employee_name,
              phone: condidate.s_employee.phone_number,
              
            },
            role: {
              id: condidate.s_employee.s_role.id,
              name: condidate.s_employee.s_role.role_name,
            },
            organization: {
              id: condidate.s_employee.s_organization.id,
              name: condidate.s_employee.s_organization.organization_name,
            }
          };

          return res.status(200).json({ 
            ...getToken({
              ...userData, 
            })
          });
        }
        return res.status(400).json({ password: 'Неверный пароль' });
      }
      else
        return res.status(400).json({ login: 'Текущий login не зарегистрирован' });
    })
  }
  catch (err){
    return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
  }  
}

export default login;