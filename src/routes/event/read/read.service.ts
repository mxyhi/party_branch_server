import prisma from '../../../db';
import { res } from '../../../utils/result';
import { EventInfoType, EventQuery } from './model/readModel';
import * as moment from 'moment';

export default class ReadService {
  static async create(data: EventInfoType) {
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (data.id) {
      const id = data.id;
      delete data.id;
      const dbData = await prisma.read.update({
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

    const dbData = await prisma.read.create({
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
    const total = await prisma.read.count();
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
    const data = await prisma.read.findMany({
      skip: skipCount,
      take: limit,
    });
    const participateIn = await prisma.readRegistration.findMany({
      where: {
        read_id: {
          in: data.map(item => item.id),
        },
        user_id: id,
      },
    });
    if (participateIn.length) {
      (data as any).forEach((item: any) => {
        const registrationInformation = participateIn.find(
          i => i.read_id === item.id
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
    const data = await prisma.read.findUnique({
      where: {
        id: eventId,
      },
    });
    if (participateInId) {
      const result = await prisma.readRegistration.findUnique({
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
    const data = await prisma.read.delete({
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
    const isHas = await prisma.readRegistration.findFirst({
      where: {
        user_id: userId,
        read_id: id,
      },
    });
    if (!isHas) {
      const result = await prisma.readRegistration.create({
        data: {
          user_id: userId,
          read_id: id,
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
   * @description 取消加入活动
   */
  static async cancel(id: number) {
    const result = await prisma.readRegistration.delete({
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
