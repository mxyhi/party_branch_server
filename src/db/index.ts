import { PrismaClient } from '@prisma/client';
import * as moment from 'moment';

const prisma = new PrismaClient();

async function main() {
  // Connect the client
  await prisma.$connect();
  // ... you will write your Prisma Client queries here

  // await prisma.user.deleteMany();
  // await prisma.partyBranch.deleteMany();
  const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
  let partyBranch = await prisma.partyBranch.findFirst({
    where: {
      name: '默认党支部',
    },
  });
  if (!partyBranch) {
    partyBranch = await prisma.partyBranch.create({
      data: {
        name: '默认党支部',
        desc: '默认党支部',
        create_time: nowTime,
        updated_time: nowTime,
        people_count: 0,
      },
    });
  }

  const admin = await prisma.user.findUnique({
    where: {
      username: 'admin',
    },
  });

  if (!admin) {
    await prisma.user.create({
      data: {
        username: 'admin',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        desc: 'admin',
        avatar: 'https://vben.vvbin.cn/assets/header.1b5fa5f8.jpg',
        homePath: '/work/list',
        realName: '管理员',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicmVhbE5hbWUiOiLnrqHnkIblkZgiLCJpYXQiOjE2Nzg4NjcxNDMsImV4cCI6MjI4MzY2NzE0M30.ZPfCQ-BfmR5ns-KizgxwjisyrHZpSoKu1tEnGM8U0Xw',
        roles: [{ roleName: '管理员', value: 'admin' }],
        age: 22,
        class: '管理员',
        phone: '15388888888',
        sex: 1,
        type: 0,
        create_time: nowTime,
        updated_time: nowTime,
        partyBranchId: partyBranch.id,
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: 'user',
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        username: 'user',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        desc: '党员',
        avatar: 'https://vben.vvbin.cn/assets/header.1b5fa5f8.jpg',
        homePath: '/work/list',
        realName: '党员',
        token:
          'eyJhbGciOiJIUzI1NiI2InR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicmVhbE5hbWUiOiLnrqHnkIblkZgiLCJpYXQiOjE2Nzg4NjcxNDMsImV4cCI6MjI4MzY2NzE0M30.ZPfCQ-BfmR5ns-KizgxwjisyrHZpSoKu1tEnGM8U0Xw',
        roles: [{ roleName: '党员', value: 'user' }],
        age: 20,
        class: '2021-财务管理-1班',
        phone: '15345678910',
        sex: 1,
        type: 2,
        create_time: nowTime,
        updated_time: nowTime,
        partyBranchId: partyBranch.id,
      },
    });
  }

  const branch = await prisma.user.findUnique({
    where: {
      username: 'admin1',
    },
  });

  if (!branch) {
    await prisma.user.create({
      data: {
        username: 'admin1',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        desc: '党支部',
        avatar: 'https://vben.vvbin.cn/assets/header.1b5fa5f8.jpg',
        homePath: '/work/list',
        realName: '党支部',
        token:
          'eyJhbGciOiJIUz123iIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicmVhbE5hbWUiOiLnrqHnkIblkZgiLCJpYXQiOjE2Nzg4NjcxNDMsImV4cCI6MjI4MzY2NzE0M30.ZPfCQ-BfmR5ns-KizgxwjisyrHZpSoKu1tEnGM8U0Xw',
        roles: [{ roleName: '党支部', value: 'branch' }],
        age: 22,
        class: '党支部',
        phone: '12345678910',
        sex: 1,
        type: 1,
        create_time: nowTime,
        updated_time: nowTime,
        partyBranchId: partyBranch.id,
      },
    });
  }

  await prisma.partyBranch.update({
    where: {
      id: partyBranch.id,
    },
    data: {
      people_count: await prisma.user.count({
        where: {
          partyBranchId: partyBranch.id,
        },
      }),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export default prisma;
