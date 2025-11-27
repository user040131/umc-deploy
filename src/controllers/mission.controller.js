// controllers/store.controller.js
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";
import { addMission, listStoreMissions } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { responseFromMissions } from "../dtos/mission.dto.js";

export const handleListStoreMissions = async (req, res, next) => {
  /* 
  #swagger.summary = '가게별 미션 목록 조회';
  #swagger.tags = ['Mission'];
  #swagger.parameters['storeId'] = {
    in: 'path',
    description: '가게(restaurant) ID',
    required: true,
    schema: { type: 'integer', example: 1 }
  };
  #swagger.responses[200] = {
    description: '가게별 미션 목록 조회 성공',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    description: "mission 레코드 한 건"
                    // TODO: mission 필드 정의 필요 시 properties 추가
                  }
                },
                pagination: {
                  type: "object",
                  properties: {
                    cursor: {
                      type: "integer",
                      nullable: true,
                      example: 10,
                      description: "다음 페이지 조회용 커서 (없으면 null)"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: '잘못된 요청 (storeId 타입 오류 등)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "bad_request" },
                reason: { type: "string", example: "invalid_field_type" },
                data: { type: "object", example: { invalid: ["storeId"] } }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: '가게를 찾을 수 없음 (restaurant_not_found)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "not_found" },
                reason: { type: "string", example: "restaurant_not_found" },
                data: { type: "object", example: { restaurantId: 1 } }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
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

export const handleAddMission = async (req, res, next) => {
/*
  #swagger.summary = '미션 작성';
  #swagger.tags = ['Mission'];
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["compensation", "restaurantId"],
          properties: {
            detail: {
              type: "string",
              nullable: true,
              description: "미션 상세 설명 (선택)",
              example: "리뷰 작성 시 5000원 할인"
            },
            compensation: {
              type: "number",
              description: "보상 금액 (0 이상)",
              example: 5000
            },
            restaurantId: {
              type: "number",
              description: "가게(restaurant) ID",
              example: 1
            }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: '미션 작성 성공',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  description: "생성된 미션 ID",
                  example: 123
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: '잘못된 요청 (필드 누락/타입 오류/범위 오류)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { 
                  type: "string", 
                  example: "bad_request"
                },
                reason: { 
                  type: "string", 
                  example: "missing_fields",
                  description: "missing_fields | invalid_field_type | compensation_out_of_range 등"
                },
                data: { 
                  type: "object", 
                  example: { missing: ["compensation","restaurantId"] }
                }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: '가게를 찾을 수 없음 (restaurant_not_found)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "not_found" },
                reason: { type: "string", example: "restaurant_not_found" },
                data: { type: "object", example: { restaurantId: 1 } }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
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


export const handleAttemptMission = async (req, res, next) => {
/*
  #swagger.summary = '미션 수행(내 미션 추가)';
  #swagger.tags = ['Mission'];
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["userId", "missionId"],
          properties: {
            userId: {
              type: "number",
              description: "유저 ID",
              example: 1
            },
            missionId: {
              type: "number",
              description: "미션 ID",
              example: 123
            }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: '내 미션 추가 성공',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  description: "생성된 my_mission ID",
                  example: 1001
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: '잘못된 요청 (필드 누락/타입 오류)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "bad_request" },
                reason: { 
                  type: "string", 
                  example: "missing_fields",
                  description: "missing_fields | invalid_field_type"
                },
                data: { 
                  type: "object", 
                  example: { missing: ["userId","missionId"] }
                }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: '유저 또는 미션을 찾을 수 없음 (user_not_found 등)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "not_found" },
                reason: { type: "string", example: "user_not_found" },
                data: { type: "object", example: { userId: 1 } }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[409] = {
    description: '이미 참여한 미션 (already_joined)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "conflict" },
                reason: { type: "string", example: "already_joined" },
                data: { 
                  type: "object", 
                  example: { missionId: 123, userId: 1 }
                }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try {
    req.userId = req.user.id; // JWT 인증된 유저 ID로 덮어쓰기
    const { userId, missionId } = req.body;

    // 누락
    const missing = ["missionId"].filter(k => req.body?.[k] === undefined || req.body?.[k] === null || req.body?.[k] === "");
    if (missing.length) throw AppError.badRequest("missing_fields", { missing });

    // 타입
    if (Number.isNaN(Number(userId)) || Number.isNaN(Number(missionId))) {
      throw AppError.badRequest("invalid_field_type");
    }

    const my = await attemptMission(bodyToAttemptMission(req.body));
    return res.status(StatusCodes.OK).success({ id: my.id });
  } catch (e) { next(e); }
};

export const handleListUserMissions = async (req, res, next) => {
/*
  #swagger.summary = '특정 유저의 미션 목록 조회';
  #swagger.tags = ['Mission'];
  #swagger.parameters['userId'] = {
    in: 'query',
    description: '유저 ID (query로 전달, body에서도 읽지만 문서상 query 사용 권장)',
    required: true,
    schema: { type: 'integer', example: 1 }
  };
  #swagger.responses[200] = {
    description: '특정 유저의 미션 목록 조회 성공 (커서 기반 페이지네이션 DTO)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              description: "my_mission 레코드 배열",
              items: {
                type: "object",
                description: "my_mission 한 건 (스키마에 따라 필드 구성)",
                // 필요하면 my_mission 필드 properties로 상세 정의
              }
            },
            pagination: {
              type: "object",
              properties: {
                cursor: {
                  type: "integer",
                  nullable: true,
                  example: 10,
                  description: "다음 페이지 조회용 커서 (없으면 null)"
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: '잘못된 요청 (userId 누락/타입 오류)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "bad_request" },
                reason: {
                  type: "string",
                  example: "missing_fields",
                  description: "missing_fields | invalid_field_type"
                },
                data: {
                  type: "object",
                  example: { missing: ["userId"] }
                }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: '유저를 찾을 수 없음 (user_not_found)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "not_found" },
                reason: { type: "string", example: "user_not_found" },
                data: { type: "object", example: { userId: 1 } }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/

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

export const handleMyMission = async (req, res, next) => {
/*
  #swagger.summary = '내 미션 성공 처리';
  #swagger.tags = ['Mission'];
  #swagger.parameters['missionId'] = {
    in: 'path',
    description: '미션 ID',
    required: true,
    schema: { type: 'integer', example: 123 }
  };
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: {
              type: "number",
              description: "유저 ID",
              example: 1
            }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: '내 미션 성공 처리 완료 (ID DTO 반환)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            myMission: {
              type: "object",
              description: "성공 처리된 내 미션의 식별자 DTO",
              properties: {
                attemptMissionId: {
                  type: "integer",
                  description: "my_mission PK (attemptMissionId)",
                  example: 1001
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: '잘못된 요청 (userId/missionId 누락 또는 타입 오류)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "bad_request" },
                reason: {
                  type: "string",
                  example: "missing_fields",
                  description: "missing_fields | invalid_field_type"
                },
                data: {
                  type: "object",
                  example: { missing: ["userId","missionId"] }
                }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: '내 미션을 찾을 수 없음 (my_mission_not_found)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "not_found" },
                reason: { type: "string", example: "my_mission_not_found" },
                data: {
                  type: "object",
                  example: { userId: 1, missionId: 123 }
                }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[409] = {
    description: '이미 완료된 미션에 대해 성공 처리를 시도(already_completed)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "conflict" },
                reason: { type: "string", example: "already_completed" },
                data: {
                  type: "object",
                  example: { missionId: 123 }
                }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/

  try {
    const userId = req.user.id; // JWT 인증된 유저 ID로 덮어쓰기
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
