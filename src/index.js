import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddMission } from "./controllers/user.controller.js";
import { handleAddReview } from "./controllers/user.controller.js";
import { handleAttemptMission } from "./controllers/user.controller.js";
import { handleListStoreReviews } from "./controllers/store.controller.js";
import { handleListUserReviews } from "./controllers/user.controller.js";
import { handleListStoreMissions } from "./controllers/store.controller.js";
import { handleListUserMissions } from "./controllers/user.controller.js";
import { handleMyMission } from "./controllers/user.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/review", handleAddReview); 
app.post("/api/v1/mission", handleAddMission); 
app.put("/api/v1/mission", handleAttemptMission); 
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/me/reviews", handleListUserReviews);
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);
app.get("/api/v1/me/missions", handleListUserMissions);
app.patch("/api/v1/me/missions/:missionId", handleMyMission);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});