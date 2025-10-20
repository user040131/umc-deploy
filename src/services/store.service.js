import { getAllStoreReviews } from "../repositories/store.repository.js";
import { responseFromReviews } from "../dtos/review.dto.js";
import { getAllStoreMissions } from "../repositories/store.repository.js";
import { responseFromMissoins } from "../dtos/review.dto.js";

export const listStoreReviews = async (storeId, cursor) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

export const listStoreMissions = async (storeId) => {
  const missions = await getAllStoreMissions(storeId);
  return responseFromMissoins(missions);
}