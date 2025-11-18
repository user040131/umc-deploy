import { prisma } from "../db.config.js";
import { AppError } from "../errors/AppError.js";

export const getAllStoreMissions = async (storeId) => {
  const sid = Number(storeId);

  const restaurant = await prisma.restaurant.findUnique({
    where: { restaurantId: sid },
    select: { restaurantId: true },
  });
  if (!restaurant) {
    throw AppError.notFound("restaurant_not_found", { restaurantId: sid });
  }

  return prisma.mission.findMany({
    where: { restaurantId: sid },
    orderBy: { missionId: "asc" },
  });
};

export const insertMission = async (data) => {
  const restaurant = await prisma.restaurant.findFirst({ where: { restaurantId: data.restaurant_id }, select: { restaurantId: true } });
  if (!restaurant) throw AppError.notFound("restaurant_not_found", { restaurantId: data.restaurant_id });

  return prisma.mission.create({ data });
};

export const insertAttemptMission = async (data) => {
  const user = await prisma.user.findFirst({ where: { id: data.user_id }, select: { id: true } });
  if (!user) throw AppError.notFound("user_not_found", { userId: data.user_id });

  const exists = await prisma.my_mission.findFirst({
    where: { missionId: data.mission_id, user_id: data.user_id },
    select: { myMissionId: true },
  });
  if (exists) throw AppError.conflict("already_joined", { missionId: data.mission_id, userId: data.user_id });

  return prisma.my_mission.create({ data });
};

export const getUserMissions = async (userId) => {
  const user = await prisma.user.findFirst({ where: { id: Number(userId) }, select: { id: true } });
  if (!user) throw AppError.notFound("user_not_found", { userId: Number(userId) });

  return prisma.my_mission.findMany({
    where: { userId: Number(userId) },
    orderBy: { missionId: "asc" },
  });
};

export const comMyMission = async (userId, missionId) => {
  const my = await prisma.my_mission.findFirst({
    where: { userId: Number(userId), missionId: Number(missionId) },
    select: { userId: true, missionId: true, state: true },
  });
  if (!my) throw AppError.notFound("my_mission_not_found", { userId: Number(userId), missionId: Number(missionId) });
  if (my.state === "진행완료") throw AppError.conflict("already_completed", { missionId: Number(missionId) });

  return prisma.my_mission.update({
    where: { userId_missionId: { userId: Number(userId), missionId: Number(missionId) } },
    data: { state: "진행완료" },
  });
};
