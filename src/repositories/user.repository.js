import { pool } from "../db.config.js";
import { prisma } from '../db.config.js';

// User 데이터 삽입
// export const addUser = async (data) => {
//   const conn = await pool.getConnection();

//   try {
//     const [confirm] = await pool.query(
//       `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail;`,
//       data.email
//     );

//     if (confirm[0].isExistEmail) {
//       return null;
//     }

//     const [result] = await pool.query(
//       `INSERT INTO user (email, name, gender, birth, address, detail_address, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?);`,
//       [
//         data.email,
//         data.name,
//         data.gender,
//         data.birth,
//         data.address,
//         data.detailAddress,
//         data.phoneNumber,
//       ]
//     );

//     return result.insertId;
//   } catch (err) {
//     throw new Error(
//       `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
//     );
//   } finally {
//     conn.release();
//   }
// };
export const addUser = async (data) => {
  try{
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (user !== null) {
      throw new Error("이미 존재하는 유저입니다.");
    }

    const created = await prisma.user.create({ data: data });
    return created.id;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    await prisma.$disconnect();
  }
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
  return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.user_favor_category.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.user_favor_category.findMany({
    select: {
      id: true,
      userId: true,
      foodCategoryId: true,
      foodCategory: true,
    },
    where: { userId: userId },
    orderBy: { foodCategoryId: "asc" },
  });

  return preferences;
};

export const insertReview = async (data) => {
  try{
    const restaurant = await prisma.restaurant.findFirst({ where: { restaurantId: data.restaurant_id } });
    if (restaurant === null) {
        throw new Error("존재하지 않는 restaurant입니다.");
    }
    const review = await prisma.review.create({ data: data });
    return review;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};


export const insertMission = async (data) => {
  try{
    const restaurant = await prisma.restaurant.findFirst({ 
      where: { restaurantId: data.restaurant_id } 
    });
    if (restaurant === null) {
        throw new Error("존재하지 않는 restaurant입니다.");
    }
    const mission = await prisma.mission.create({ data: data });
    return mission;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const insertAttemptMission = async (data) => {
  try{
    const myMission = await prisma.my_mission.findFirst({ 
      where: { missionId: data.mission_id, user_id: data.user_id } 
    });
    if (myMission !== null) {
        throw new Error("이미 내 미션에 존재하는 미션입니다.");
    }
    const attemptMission = await prisma.my_mission.create({ data: data });
    return attemptMission;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const getUserReviews = async (userId, cursor) => {
  try{
    const reviews = await prisma.review.findMany({
        where: { userId: userId, reviewId: { gt: cursor } }, //gt: cursor -> cursor 이후의 데이터 가져오기, 커서 페이징
        orderBy: { reviewId: "asc" },
        take: 5, //한 번에 5개씩 가져오기, LIMIT 5 랑 같은 의미
    });
    return reviews;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const getUserMissions = async (userId) => {
  try{
    const missions = await prisma.my_mission.findMany({
      where: { userId: userId },
      orderBy: { missionId: "asc" },
    });
    return missions;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

export const completeMyMission = async (userId, missionId) => {
  try{
    const myMission = await prisma.my_mission.update({
      where: { userId: userId 
        , myMissionId: missionId
      },
      data: { state: "진행완료" },
    });
    if (myMission === null) {
        throw new Error("미션에서 내 미션으로 이동에 실패했습니다.");
    }
    return myMission;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};