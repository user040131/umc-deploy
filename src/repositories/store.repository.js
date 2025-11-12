import { prisma } from "../db.config.js";
import { AppError } from "../errors/AppError.js";

export const getAllStoreReviews = async (storeId, cursor = 0) => {
  const sid = Number(storeId);
  const cur = Number(cursor) || 0;

  const restaurant = await prisma.restaurant.findFirst({
    where: { restaurantId: sid },
    select: { restaurantId: true },
  });
  if (!restaurant) {
    throw AppError.notFound("restaurant_not_found", { restaurantId: sid });
  }

  return prisma.review.findMany({
    select: {
      reviewId: true,
      detail: true,
      restaurantId: true,
      userId: true,
      restaurant: true,
      user: true,
    },
    where: { restaurantId: sid, reviewId: { gt: cur } },
    orderBy: { reviewId: "asc" },
    take: 5,
  });
};

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
