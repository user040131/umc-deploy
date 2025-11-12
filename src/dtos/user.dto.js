export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email,
    name: body.name,
    gender: body.gender,
    birth: new Date(body.birth),
    address: body.address,
    detailAddress: body.detailAddress,
    phoneNumber: body.phoneNumber,
    nickname: body.nickname,
    preferences: body.preferences
  };
};

export const responseFromUser = ({ user, preferences }) => {
    return {
        email: user.email,
        name: user.name,
        gender: user.gender,
        birth: user.birth,
        address: user.address,
        detailAddress: user.detailAddress,
        phoneNumber: user.phone_number,
        preferences: preferences
    }
};

export const bodyToReview = (body) => {
    return {
        score: body.score,
        detail: body.detail,
        restaurant_id: body.restaurantId,
        user_id: body.userId,
        created_at: new Date()
    } 
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

export const bodyToUserId = (body) => {
    return {
        user_id: body.userId
    }
};