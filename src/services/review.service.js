import { insertReview, getUserReviews, getAllStoreReviews } from "../repositories/review.repository.js";
import { responseFromReviews, responseFromReviewId } from "../dtos/review.dto.js";

export const addReview = async (data) => {
    const reviewId = await insertReview({
        score: data.score,
        detail: data.detail,
        restaurant_id: data.restaurant_id,
        user_id: data.user_id,
        created_at: data.created_at
    });

    if (reviewId === null) { throw new Error("리뷰 작성에 실패했습니다."); }

    return responseFromReviewId(reviewId); 
};

export const listUserReviews = async (userId, cursor) => {
    const reviews = await getUserReviews(userId, cursor);

    if (reviews === null) { throw new Error("리뷰 조회에 실패했습니다."); }

    return responseFromReviews(reviews); 
};

export const listStoreReviews = async (storeId, cursor) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};