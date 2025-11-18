export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
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

export const responseFromReviewId = (reviewId) => {
    return {
        reviewId: reviewId
    };
}