import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  insertReview,
  insertMission, 
  insertAttemptMission,
  getUserMissions,
  getUserReviews,
  comMyMission
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    nickname: data.nickname
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  let userPreferences = [];

  if (Array.isArray(data.preferences)) {
    userPreferences = data.preferences;
  } else if (data.preferences) {
    userPreferences = Object.values(data.preferences).map(Number);
  }
  // undefined면 [] 그대로 사용

for (const preference of userPreferences) {
  await setPreference(joinUserId, preference);
}

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

export const addReview = async (data) => {
    const reviewId = await insertReview({
        score: data.score,
        detail: data.detail,
        restaurant_id: data.restaurant_id,
        user_id: data.user_id,
        created_at: data.created_at
    });

    if (reviewId === null) { throw new Error("리뷰 작성에 실패했습니다."); }

    return reviewId; //이것도 dto로 감싸기
};

export const addMission = async (data) => {
    const missionId = await insertMission({
        detail: data.detail,
        compensation: data.compensation,
        restaurant_id: data.restaurant_id,
        created_at: data.created_at
    });

    if (missionId === null) { throw new Error("미션 작성에 실패했습니다."); }

    return missionId; //이것도 dto로 감싸기
};

export const attemptMission = async (data) => {
    const attemptMMId = await insertAttemptMission({
        state: "진행중",
        classification_num: rand(1000, 999999999),
        created_at: data.created_at,
        user_id: data.user_id,
        mission_id: data.mission_id
    });

    if (attemptMMId === null) { throw new Error("미션에서 내 미션으로 이동에 실패했습니다."); }

    return attemptMMId; //이것도 dto로 감싸기
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const listUserReviews = async (userId, cursor) => {
    const reviews = await getUserReviews(userId, cursor);

    if (reviews === null) { throw new Error("리뷰 조회에 실패했습니다."); }

    return reviews; //이것도 dto로 감싸기
};

export const listUserMissions = async (userId) => {
    const missions = await getUserMissions(userId);
    if (missions === null) { throw new Error("미션 조회에 실패했습니다."); }

    return missions; //이것도 dto로 감싸기
};

export const comMyMissionS = async (userId, missionId) => {
    const myMission = await comMyMission(userId, missionId);
    if (myMission === null) { throw new Error("미션에서 내 미션으로 이동에 실패했습니다."); }

    return myMission; //이것도 dto로 감싸기
};