import { StatusCodes } from "http-status-codes";
import { listStoreReviews } from "../services/store.service.js";
import { listStoreMissions } from "../services/store.service.js";

export const handleListStoreReviews = async (req, res, next) => {
  console.log("리뷰 목록 조회를 요청했습니다!");
  console.log("query:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const reviews = await listStoreReviews(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0 //cursor가 string이면 int로, 이상한거면 0
  );
   res.status(StatusCodes.OK).json(reviews);
};

export const handleListStoreMissions = async (req, res, next) => {
  console.log("리뷰 목록 조회를 요청했습니다!");
  console.log("query:", req.query); // 값이 잘 들어오나 확인하기 위한 테스트용

  const mission = await listStoreMissions(req.params.storeId);
  res.status(StatusCodes.OK).json({ mission });
}
