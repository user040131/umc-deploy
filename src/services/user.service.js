import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  insertReview,
  insertMission, 
  insertAttemptMission
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
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  for (const preference of data.preferences) {
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
}