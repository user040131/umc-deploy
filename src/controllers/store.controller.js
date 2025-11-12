// controllers/store.controller.js
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";
import { listStoreReviews, listStoreMissions } from "../services/store.service.js";
import { responseFromReviews, responseFromMissions } from "../dtos/review.dto.js";

export const handleListStoreReviews = async (req, res, next) => {
  try {
    console.log("리뷰 목록 조회 요청:", req.params, req.query);

    const storeIdRaw = req.params?.storeId;
    if (Number.isNaN(Number(storeIdRaw))) {
      throw AppError.badRequest("invalid_field_type", { invalid: ["storeId"] });
    }
    const storeId = Number(storeIdRaw);

    const cursor =
      typeof req.query?.cursor === "string" && !Number.isNaN(Number(req.query.cursor))
        ? Number(req.query.cursor)
        : 0;

    const reviews = await listStoreReviews(storeId, cursor); // 서비스는 존재검사 실패시 restaurant_not_found 던짐
    const payload = responseFromReviews(reviews);
    return res.status(StatusCodes.OK).success(payload);
  } catch (e) {
    next(e);
  }
};

export const handleListStoreMissions = async (req, res, next) => {
  try {
    console.log("미션 목록 조회 요청:", req.params, req.query);

    const storeIdRaw = req.params?.storeId;
    if (Number.isNaN(Number(storeIdRaw))) {
      throw AppError.badRequest("invalid_field_type", { invalid: ["storeId"] });
    }
    const storeId = Number(storeIdRaw);

    const missions = await listStoreMissions(storeId); // 서비스에서 restaurant_not_found 처리
    const payload = responseFromMissions(missions);
    return res.status(StatusCodes.OK).success(payload);
  } catch (e) {
    next(e);
  }
};

