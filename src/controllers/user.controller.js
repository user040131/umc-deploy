import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { addReview } from "../services/user.service.js";
import { addMission } from "../services/user.service.js";
import { attemptMission } from "../services/user.service.js";
import { bodyToReview } from "../dtos/user.dto.js";
import { bodyToMission } from "../dtos/user.dto.js";
import { bodyToAttemptMission } from "../dtos/user.dto.js";
import { listUserReviews } from "../services/user.service.js";
import { bodyToUserId } from "../dtos/user.dto.js";
import { listUserMissions } from "../services/user.service.js";
import { comMyMission } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {//메서드와 url은 index.js서
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });
};

export const handleAddReview = async (req, res, next) => {
  console.log("리뷰 작성을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const mission = await addReview(bodyToReview(req.body));
  res.status(StatusCodes.OK).json({ result: mission });
};

export const handleAddMission = async (req, res, next) => {
  console.log("미션 작성을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const mission = await addMission(bodyToMission(req.body));
  res.status(StatusCodes.OK).json({ result: mission });
};

export const handleAttemptMission = async (req, res, next) => {
  console.log("미션 수행을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const mission = await attemptMission(bodyToAttemptMission(req.body));
  res.status(StatusCodes.OK).json({ result: mission });
};

export const handleListUserReviews = async (req, res, next) => {
  console.log("리뷰 목록 조회를 요청했습니다!");
  console.log("query:", req.query); // 값이 잘 들어오나 확인하기 위한 테스트용

  const reviews = await listUserReviews(
    bodyToUserId(req),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0 //cursor가 string이면 int로, 이상한거면 0
  ); //커서 페이징은 쿼리로 받음
  res.status(StatusCodes.OK).json(reviews);
};

export const handleListUserMissions = async (req, res, next) => {
  console.log("미션 목록 조회를 요청했습니다!");
  console.log("query:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const missions = await listUserMissions(bodyToUserId(req));
  res.status(StatusCodes.OK).json(missions);
};

export const handleMyMission = async (req, res, next) => {
  console.log("미션에서 내 미션으로 이동을 요청했습니다!");
  console.log("params:", req.params, req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const myMission = await comMyMission(bodyToUserId(req), parseInt(req.params.missionId));
  res.status(StatusCodes.OK).json({ myMission });
};