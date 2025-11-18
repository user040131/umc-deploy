export const responseFromMissions = (missions) => {
  return {
    data: missions,
    pagination: {
      cursor: missions.length ? missions[missions.length - 1].id : null,
    },
  };
};

export const bodyToMission = (body) => {
        return {
        detail: body.detail,
        compensation: body.compensation,
        restaurant_id: body.restaurantId,
        created_at: new Date()
    } //id는 자동생성, createdAt은 현재시각으로
};

export const bodyToAttemptMission = (body) => {
    return {
        created_at: new Date(),
        user_id: body.userId,
        mission_id: body.missionId
    }
};

export const responseFromMission = (mission) => {
  return {
    missionId: mission.missionId,
    detail: mission.detail,
    compensation: mission.compensation,
    restaurantId: mission.restaurantId,
    createdAt: mission.createdAt
  };
}

export const responseFromAttemptMission = (attemptMission) => {
  return {
    attemptMissionId: attemptMission.attemptMissionId,
    state: attemptMission.state,
    classificationNum: attemptMission.classificationNum,
    createdAt: attemptMission.createdAt,
    userId: attemptMission.userId,
    missionId: attemptMission.missionId
  };
}

export const responseFromAttemptMissionId = (attemptMission) => {
    return {
        attemptMissionId: attemptMission.attemptMissionId
    };
}