import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // User 테이블에 더미 데이터 삽입 예시
//   await prisma.user.create({
//     data: {
//       email: 'test12345@domain.com',        // ← 고정값 예시 (바꿔도 되고 그대로 둬도 OK)
//       name: '테스트유저',               // ← 고정값 예시
//       // 여기에 필요한 User 테이블의 컬럼 추가
//         gender: '남성',
//         birth: new Date('1990-01-01'),
//         address: '서울특별시 강남구',
//         detailAddress: '테스트아파트 101동 1001호',
//         phoneNumber: '010-1234-5678',
//         nickname: 'testnick',
//         createdAt: new Date(),
//         updatedAt: null
//     }
//   });

  await prisma.restaurant.create({
    data: {
        address: '서울특별시 강남구 테헤란로 123', // ← 고정값 예시
        name: '맛있는 식당',                     // ← 고정값 예시
        operatingHours: '09:00 - 21:00',          // ← 고정값 예시
        pic: null,
        foodType: '일식',
        createdAt: new Date(),
        updatedAt: null
    }
  });

  await prisma.mission.create({
    data: {
        detail: '리뷰 작성 미션입니다.',
        compensation: 1000,
        restaurantId: 1,
        createdAt: new Date()
    }
  })

  await prisma.my_mission.create({
    data:{
        myMissionId: 1,
        state: '진행중',
        classificationNum: 1,
        userId: 1,
        missionId: 1,
        createdAt: new Date()
    }
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });