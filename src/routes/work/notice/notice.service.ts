import * as moment from 'moment';
import prisma from '../../../db';
import { res } from '../../../utils/result';
import { NoticeInfoType, NoticeQuery } from './model/noticeModel';

export default class NoticeService {
    static async getLimit({ limit, page }: NoticeQuery) {
        const total = await prisma.workNotice.count()
        const skipCount = (page - 1) * limit;
        if (total <= skipCount) return res({
            code: 0,
            result: {
                total,
                data: []
            },
            message: 'success',
        });

        const data = await prisma.workNotice.findMany({
            skip: skipCount,
            take: limit
        })
        return res({
            code: 0,
            result: {
                total,
                data
            },
            message: 'success',
        });
    }

    static async create(data: Omit<NoticeInfoType, 'create_time' | "click_count">) {
        const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
        if (data.id) {
            const workNoticeItem = await prisma.workNotice.update({
                where: {
                    id: data.id,
                },
                data: {
                    ...data,
                    updated_time: nowTime,
                }
            })
            return res({
                code: 0,
                message: 'success',
                result: workNoticeItem
            })
        }
        const workNoticeItem = await prisma.workNotice.create({
            data: {
                ...data,
                updated_time: nowTime,
                create_time: nowTime,
                click_count: 0
            }
        })

        return res({
            code: 0,
            message: 'success',
            result: workNoticeItem
        })
    }

    static async update(data: NoticeInfoType) {
        const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const id = data.id;
        delete data.id
        const workNoticeItem = await prisma.workNotice.update({
            where: {
                id
            },
            data: {
                ...data,
                updated_time: nowTime,
            }
        })
        return res({
            code: 0,
            message: 'success',
            result: workNoticeItem
        })
    }


    static async updateClickCount(id: number) {
        const clickCount = await prisma.workNotice.findUnique({
            where: { id }, select: {
                click_count: true
            }
        })
        if (clickCount) {
            const workNoticeItem = await prisma.workNotice.update({
                where: {
                    id
                },
                data: {
                    click_count: clickCount.click_count + 1
                }
            });

            return res({
                code: 0,
                message: 'success',
                result: workNoticeItem
            })
        }

        return res({
            code: -1,
            message: '参数不正确',
            result: null
        })

    }

    static async deleteItem(id: number) {
        if (id) {
            try {
                const workNoticeItem = await prisma.workNotice.delete({
                    where: {
                        id
                    }
                })
                return res({
                    code: 0,
                    message: 'success',
                    result: workNoticeItem
                })
            } catch (error) {
                return res({
                    code: -1,
                    message: '查询数据库错误',
                    result: error
                })
            }
        }
        return res({
            code: -1,
            message: '参数错误',
            result: null
        })
    }

    // 查找信息
    static async findOne(id: number) {
        const data = await prisma.workNotice.findUnique({
            where: {
                id
            }
        });
        return res({
            code: 0,
            result: data,
            message: 'success',
        });
    }
}