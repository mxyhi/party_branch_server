import prisma from '../../../db';
import { res } from '../../../utils/result';
import { EventInfoType, EventQuery } from './model/serviceModel';
import * as moment from 'moment';

export default class ServiceService {
  static async create(data: EventInfoType) {
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (data.id) {
      const id = data.id;
      delete data.id;
      const dbData = await prisma.service.update({
        where: { id },
        data: {
          ...data,
          updated_time: nowTime,
        },
      });
      return res({
        code: 0,
        result: dbData,
        message: 'success',
      });
    }
    const dbData = await prisma.service.create({
      data: {
        ...data,
        updated_time: nowTime,
        create_time: nowTime,
      },
    });
    return res({
      code: 0,
      result: dbData,
      message: 'success',
    });
  }

  static async getLimit({ page, limit, id }: EventQuery) {
    const total = await prisma.service.count();
    const skipCount = (page - 1) * limit;
    if (total <= skipCount)
      return res({
        code: 0,
        result: {
          total,
          data: [],
        },
        message: 'success',
      });
    const data = await prisma.service.findMany({
      skip: skipCount,
      take: limit,
    });
    const participateIn = await prisma.serviceRegistration.findMany({
      where: {
        service_id: {
          in: data.map(item => item.id),
        },
        user_id: id,
      },
    });
    if (participateIn.length) {
      (data as any).forEach((item: any) => {
        const registrationInformation = participateIn.find(
          i => i.service_id === item.id
        );
        if (registrationInformation) {
          item.isParticipateIn = true;
          item.registrationInformation = registrationInformation;
        }
      });
    }
    return res({
      code: 0,
      result: {
        total,
        data,
      },
      message: 'success',
    });
  }

  static async findOne({
    eventId,
    participateInId,
  }: {
    eventId: number;
    participateInId?: number;
  }) {
    const data = await prisma.service.findUnique({
      where: {
        id: eventId,
      },
    });
    if (participateInId) {
      const result = await prisma.serviceRegistration.findUnique({
        where: {
          id: participateInId,
        },
      });
      if (result) {
        (data as any).registrationInformation = result;
        (data as any).isParticipateIn = true;
      }
    }
    return res({
      code: 0,
      result: data,
      message: 'success',
    });
  }

  static async delete(id: number) {
    const data = await prisma.service.delete({
      where: {
        id,
      },
    });
    return res({
      code: 0,
      result: data,
      message: 'success',
    });
  }

  /**
   * @description 加入活动
   */
  static async join({ id, userId }: { id: number; userId: number }) {
    const isHas = await prisma.serviceRegistration.findFirst({
      where: {
        user_id: userId,
        service_id: id,
      },
    });
    if (!isHas) {
      const result = await prisma.serviceRegistration.create({
        data: {
          user_id: userId,
          service_id: id,
        },
      });
      return res({
        code: 0,
        result,
        message: 'success',
      });
    }
    return res({
      code: -1,
      result: null,
      message: 'error',
    });
  }

  /**
   * @description 退出活动
   */
  static async cancel(id: number) {
    const result = await prisma.serviceRegistration.delete({
      where: {
        id,
      },
    });
    return res({
      code: 0,
      result,
      message: 'success',
    });
  }
}
