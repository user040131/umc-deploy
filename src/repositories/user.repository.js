import { prisma } from "../db.config.js";
import { AppError } from "../errors/AppError.js";

export const addUser = async (data) => {
  const exists = await prisma.user.findFirst({ where: { email: data.email }, select: { id: true } });
  if (exists) throw AppError.conflict("email_exists", { email: data.email });

  try {
    const created = await prisma.user.create({ data });
    return created.id;
  } catch (e) {
    
    if (e?.code === "P2002") throw AppError.conflict("email_exists", { email: data.email });
    throw e;
  }
};

export const getUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) throw AppError.notFound("user_not_found", { userId: Number(userId) });
  return user;
};

export const setPreference = async (userId, foodCategoryId) => {
  return prisma.user_favor_category.create({
    data: {
      user: { connect: { id: Number(userId) } },
      food_category: { connect: { id: Number(foodCategoryId) } },
    },
  });
};

export const getUserPreferencesByUserId = async (userId) => {
  const prefs = await prisma.user_favor_category.findMany({
    select: { foodCategoryId: true },
    where: { userId: Number(userId) },
    orderBy: { foodCategoryId: "asc" },
  });
  return prefs.map((p) => p.foodCategoryId);
};

export const insertReview = async (data) => {
  const restaurant = await prisma.restaurant.findFirst({ where: { restaurantId: data.restaurant_id }, select: { restaurantId: true } });
  if (!restaurant) throw AppError.notFound("restaurant_not_found", { restaurantId: data.restaurant_id });

  const user = await prisma.user.findFirst({ where: { id: data.user_id }, select: { id: true } });
  if (!user) throw AppError.notFound("user_not_found", { userId: data.user_id });

  return prisma.review.create({ data });
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

export const getUserReviews = async (userId, cursor) => {
  const user = await prisma.user.findFirst({ where: { id: Number(userId) }, select: { id: true } });
  if (!user) throw AppError.notFound("user_not_found", { userId: Number(userId) });

  return prisma.review.findMany({
    where: { userId: Number(userId), reviewId: { gt: Number(cursor) } },
    orderBy: { reviewId: "asc" },
    take: 5,
  });
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
