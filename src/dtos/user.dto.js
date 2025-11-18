export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email,
    password: body.password,
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

export const bodyToUserId = (body) => {
    return {
        user_id: body.userId
    }
};