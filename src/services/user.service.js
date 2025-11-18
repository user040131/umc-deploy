import {
  addUser,
  getUser,
  setPreference,
  getUserPreferencesByUserId,
  updateUser,
} from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";
import bcrypt from "bcryptjs";

export const userSignUp = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const joinUserId = await addUser({
    email: data.email,
    password: passwordHash,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    nickname: data.nickname,
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

export const userUpdate = async (userId, data) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const updatedUser = await updateUser(userId, {
    email: data.email,
    password: passwordHash,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    nickname: data.nickname,
  });

  if (updatedUser === null) {
    throw new Error("사용자 정보 업데이트에 실패했습니다.");
  }

  let userPreferences = [];

  if (Array.isArray(data.preferences)) {
    userPreferences = data.preferences;
  } else if (data.preferences) {
    userPreferences = Object.values(data.preferences).map(Number);
  }
  // undefined면 [] 그대로 사용

  for (const preference of userPreferences) {
    await setPreference(userId, preference);
  }

  const preferences = await getUserPreferencesByUserId(userId);

  return responseFromUser({ user: updatedUser, preferences });
};
