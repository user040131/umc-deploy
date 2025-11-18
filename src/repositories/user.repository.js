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

export const updateUser = async (userId, data) => {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) throw AppError.notFound("user_not_found", { userId: Number(userId) });

  return prisma.user.update({
    where: { id: Number(userId) },
    data,
  });
}