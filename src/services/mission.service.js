import { insertMission, insertAttemptMission, getUserMissions, comMyMission, getAllStoreMissions } from "../repositories/mission.repository.js";
import { responseFromMissions, responseFromMission, responseFromAttemptMission, responseFromAttemptMissionId } from "../dtos/mission.dto.js";

export const addMission = async (data) => {
    const mission = await insertMission({
        detail: data.detail,
        compensation: data.compensation,
        restaurant_id: data.restaurant_id,
        created_at: data.created_at
    });

    if (mission === null) { throw new Error("미션 작성에 실패했습니다."); }

    return responseFromMission(mission); 
};

export const attemptMission = async (data) => {
    const myMission = await insertAttemptMission({
        state: "진행중",
        classification_num: rand(1000, 999999999),
        created_at: data.created_at,
        user_id: data.user_id,
        mission_id: data.mission_id
    });

    if (myMission === null) { throw new Error("미션에서 내 미션으로 이동에 실패했습니다."); } //내 미션 생성

    return responseFromAttemptMission(myMission);
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const listUserMissions = async (userId) => {
    const missions = await getUserMissions(userId);
    if (missions === null) { throw new Error("미션 조회에 실패했습니다."); }

    return responseFromMissions(missions);
};

export const comMyMissionS = async (userId, missionId) => {
    const myMission = await comMyMission(userId, missionId);
    if (myMission === null) { throw new Error("내 미션 성공에 실패하였습니다."); }

    return responseFromAttemptMissionId(myMission); 
};

export const listStoreMissions = async (storeId) => {
  const missions = await getAllStoreMissions(storeId);
  return responseFromMissions(missions);
}