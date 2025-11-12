// controllers/user.controller.js
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";

import {
  userSignUp,
  addReview,
  addMission,
  attemptMission,
  listUserReviews,
  listUserMissions,
  comMyMissionS,
} from "../services/user.service.js";

import {
  bodyToUser,
  bodyToReview,
  bodyToMission,
  bodyToAttemptMission,
  bodyToUserId,
} from "../dtos/user.dto.js";

/* 1) 회원가입 */
export const handleUserSignUp = async (req, res, next) => {
  try {
    const {
      email, name, gender, birth, address, detailAddress, phoneNumber, preferences
    } = req.body;

    // 누락
    const required = ["email","name","gender","birth","address","detailAddress","phoneNumber","preferences"];
    const missing = required.filter(k => {
      const v = req.body?.[k];
      return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
    });
    if (missing.length) throw AppError.badRequest("missing_fields", { missing });

    // 타입
    const mustBeString = { email, name, gender, birth, address, detailAddress, phoneNumber };
    const invalidStrings = Object.entries(mustBeString).filter(([, v]) => typeof v !== "string").map(([k]) => k);
    const invalid = [...invalidStrings, ...(Array.isArray(preferences) ? [] : ["preferences"])];
    if (invalid.length) {
      console.log("signup type debug:", {
        email: typeof email, name: typeof name, gender: typeof gender, birth: typeof birth,
        address: typeof address, detailAddress: typeof detailAddress, phoneNumber: typeof phoneNumber,
        preferences: Array.isArray(preferences) ? "array" : typeof preferences
      });
      throw AppError.badRequest("invalid_field_type", { invalid });
    }

    const user = await userSignUp(bodyToUser(req.body));
    return res.status(StatusCodes.OK).success(user);
  } catch (e) { next(e); }
};

/* 2) 리뷰 작성 */
export const handleAddReview = async (req, res, next) => {
  try {
    const { score, detail, restaurantId, userId } = req.body;

    // 누락
    const missing = ["score","restaurantId","userId"].filter(k => req.body?.[k] === undefined || req.body?.[k] === null || req.body?.[k] === "");
    if (missing.length) throw AppError.badRequest("missing_fields", { missing });

    // 타입
    const invalid =
      (typeof score !== "number" || !Number.isFinite(score)) ||
      Number.isNaN(Number(restaurantId)) ||
      Number.isNaN(Number(userId)) ||
      (detail !== undefined && detail !== null && typeof detail !== "string");
    if (invalid) throw AppError.badRequest("invalid_field_type");

    // 범위
    if (score < 1 || score > 5) throw AppError.badRequest("score_out_of_range");

    const review = await addReview(bodyToReview(req.body));
    return res.status(StatusCodes.OK).success({ id: review.id });
  } catch (e) { next(e); }
};

/* 3) 미션 작성 */
export const handleAddMission = async (req, res, next) => {
  try {
    const { detail, compensation, restaurantId } = req.body;

    // 누락
    const missing = ["compensation","restaurantId"].filter(k => req.body?.[k] === undefined || req.body?.[k] === null || req.body?.[k] === "");
    if (missing.length) throw AppError.badRequest("missing_fields", { missing });

    // 타입
    const invalid =
      (typeof compensation !== "number" || !Number.isFinite(compensation)) ||
      Number.isNaN(Number(restaurantId)) ||
      (detail !== undefined && detail !== null && typeof detail !== "string");
    if (invalid) throw AppError.badRequest("invalid_field_type");

    // 범위
    if (compensation < 0) throw AppError.badRequest("compensation_out_of_range");

    const mission = await addMission(bodyToMission(req.body));
    return res.status(StatusCodes.OK).success({ id: mission.id });
  } catch (e) { next(e); }
};

/* 4) 미션 수행(내 미션 추가)  — DTO는 body(userId, missionId) 기준 */
export const handleAttemptMission = async (req, res, next) => {
  try {
    const { userId, missionId } = req.body;

    // 누락
    const missing = ["userId","missionId"].filter(k => req.body?.[k] === undefined || req.body?.[k] === null || req.body?.[k] === "");
    if (missing.length) throw AppError.badRequest("missing_fields", { missing });

    // 타입
    if (Number.isNaN(Number(userId)) || Number.isNaN(Number(missionId))) {
      throw AppError.badRequest("invalid_field_type");
    }

    const my = await attemptMission(bodyToAttemptMission(req.body));
    return res.status(StatusCodes.OK).success({ id: my.id });
  } catch (e) { next(e); }
};

/* 5) 특정 유저 리뷰 목록 조회 — DTO는 bodyToUserId(body) 기준 */
export const handleListUserReviews = async (req, res, next) => {
  try {
    const userId = (req.query?.userId ?? req.body?.userId);

    // 누락·타입
    if (userId === undefined || userId === null || userId === "") {
      throw AppError.badRequest("missing_fields", { missing: ["userId"] });
    }
    if (Number.isNaN(Number(userId))) throw AppError.badRequest("invalid_field_type");

    const cursor = typeof req.query?.cursor === "string" && !Number.isNaN(Number(req.query.cursor))
      ? Number(req.query.cursor)
      : 0;

    const reviews = await listUserReviews(bodyToUserId({ userId }), cursor);
    return res.status(StatusCodes.OK).json(reviews);
  } catch (e) { next(e); }
};

/* 6) 특정 유저 미션 목록 조회 — DTO는 bodyToUserId(body) 기준 */
export const handleListUserMissions = async (req, res, next) => {
  try {
    const userId = (req.query?.userId ?? req.body?.userId);

    if (userId === undefined || userId === null || userId === "") {
      throw AppError.badRequest("missing_fields", { missing: ["userId"] });
    }
    if (Number.isNaN(Number(userId))) throw AppError.badRequest("invalid_field_type");

    const missions = await listUserMissions(bodyToUserId({ userId }));
    return res.status(StatusCodes.OK).json(missions);
  } catch (e) { next(e); }
};

/* 7) 미션 성공 — 경로 param의 missionId + body의 userId */
export const handleMyMission = async (req, res, next) => {
  try {
    const userId = req.body?.userId;
    const missionIdParam = req.params?.missionId;

    const missing = [];
    if (userId === undefined || userId === null || userId === "") missing.push("userId");
    if (missionIdParam === undefined || missionIdParam === null || missionIdParam === "") missing.push("missionId");
    if (missing.length) throw AppError.badRequest("missing_fields", { missing });

    if (Number.isNaN(Number(userId)) || Number.isNaN(Number(missionIdParam))) {
      throw AppError.badRequest("invalid_field_type");
    }

    const myMission = await comMyMissionS(
      bodyToUserId({ userId }),
      Number(missionIdParam)
    );
    return res.status(StatusCodes.OK).json({ myMission });
  } catch (e) { next(e); }
};
