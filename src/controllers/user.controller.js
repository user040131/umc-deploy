import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { addReview } from "../services/user.service.js";
import { addMission } from "../services/user.service.js";
import { attemptMission } from "../services/user.service.js";
import { bodyToReview } from "../dtos/user.dto.js";
import { bodyToMission } from "../dtos/user.dto.js";
import { bodyToAttemptMission } from "../dtos/user.dto.js";

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