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

export const insertReview = async (data) => {
  const restaurant = await prisma.restaurant.findFirst({ where: { restaurantId: data.restaurant_id }, select: { restaurantId: true } });
  if (!restaurant) throw AppError.notFound("restaurant_not_found", { restaurantId: data.restaurant_id });

  const user = await prisma.user.findFirst({ where: { id: data.user_id }, select: { id: true } });
  if (!user) throw AppError.notFound("user_not_found", { userId: data.user_id });

  // return prisma.review.create({ data }); 이따구로 하면 에러 뜸. 연관된 restaurant, user는 채워지지 않기에 그것까지 넣어야지 대뜸 data만 넣으면 그게 될리가 있나
  return prisma.review.create({
    data: {
      score: data.score,
      detail: data.detail,
      restaurant: { connect: { restaurantId: data.restaurant_id } },
      user: { connect: { id: data.user_id } },
    },
  }).then((review) => review.reviewId);
};

export const getUserReviews = async (userId, cursor) => {
  const user = await prisma.user.findFirst({ where: { id: Number(userId) }});
  if (!user) throw AppError.notFound("user_not_found", { userId: Number(userId) });

  return prisma.review.findMany({
    where: { userId: Number(userId), reviewId: { gt: Number(cursor) } },
    orderBy: { reviewId: "asc" },
    take: 5,
  });
};