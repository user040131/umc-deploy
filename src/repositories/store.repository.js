import { prisma } from "../db.config.js";

export const getAllStoreReviews = async (storeId, cursor) => {
  const reviews = await prisma.review.findMany({
    select: {
      reviewId: true,
      detail: true,
      restaurantId: true,
      userId: true,
      restaurant: true,
      user: true,
    },
    where: { restaurantId: storeId, reviewId: { gt: cursor } }, //gt: cursor -> cursor 이후의 데이터 가져오기, 커서 페이징
    orderBy: { reviewId: "asc" },
    take: 5, //한 번에 5개씩 가져오기, LIMIT 5 랑 같은 의미
  });

  return reviews;
};

export const getAllStoreMissions = async (storeId) => {
    try{
        const missions = await prisma.mission.findMany({
        where: { restaurantId: storeId },
        orderBy: { missionId: "asc" },
    });
    if (missions === null) {
        throw new Error("미션 조회에 실패했습니다.");
    }
    return missions;
    } catch (err) {
        throw new Error(
        `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};