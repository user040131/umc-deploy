import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";
import { addReview, listStoreReviews, listUserReviews } from "../services/review.service.js";
import { bodyToReview } from "../dtos/review.dto.js";
import { bodyToUserId } from "../dtos/user.dto.js";

/* 2) 리뷰 작성 */
export const handleAddReview = async (req, res, next) => {
  /* 
  #swagger.summary = '리뷰 작성';
  #swagger.tags = ['Review'];
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["score", "restaurantId", "userId"],
          properties: {
            score: {
              type: "number",
              description: "리뷰 점수 (1~5)",
              example: 5
            },
            detail: {
              type: "string",
              nullable: true,
              description: "리뷰 상세 내용 (선택)",
              example: "음식이 정말 맛있었습니다."
            },
            restaurantId: {
              type: "number",
              description: "가게(restaurant) ID",
              example: 1
            },
            userId: {
              type: "number",
              description: "유저 ID",
              example: 10
            }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: '리뷰 작성 성공',
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
                  description: "생성된 review ID",
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
                  example: "bad_request",
                  description: "항상 bad_request"
                },
                reason: { 
                  type: "string", 
                  example: "missing_fields",
                  description: "missing_fields | invalid_field_type | score_out_of_range 등"
                },
                data: { 
                  type: "object", 
                  example: { missing: ["score","restaurantId","userId"] }
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
    description: '가게 또는 유저를 찾을 수 없음 (restaurant_not_found, user_not_found)',
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
                data: { 
                  type: "object", 
                  example: { restaurantId: 1, userId: 10 }
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

export const handleListStoreReviews = async (req, res, next) => {
  /* 
  #swagger.summary = '가게별 리뷰 목록 조회';
  #swagger.tags = ['Review'];
  #swagger.parameters['storeId'] = {
    in: 'path',
    description: '가게(restaurant) ID',
    required: true,
    schema: { type: 'integer'},
    example: 1
  };
  #swagger.parameters['cursor'] = {
    in: 'query',
    description: '다음 페이지 조회를 위한 커서(마지막 reviewId)',
    required: false,
    schema: { type: 'integer', example: 10 }
  };
  #swagger.responses[200] = {
    description: '가게별 리뷰 목록 조회 성공 (커서 기반 페이지네이션)',
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
                    description: "review 레코드 한 건",
                    properties: {
                      reviewId: { type: "integer", example: 11 },
                      score: { type: "number", example: 5 },
                      detail: { type: "string", example: "맛있어요" },
                      restaurantId: { type: "integer", example: 1 },
                      userId: { type: "integer", example: 10 }
                      // 필요하면 restaurant, user 객체 필드도 추가
                    }
                  }
                },
                pagination: {
                  type: "object",
                  properties: {
                    cursor: {
                      type: "integer",
                      nullable: true,
                      example: 15,
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
    return res.status(StatusCodes.OK).success(reviews);
  } catch (e) {
    next(e);
  }
};

/* 5) 특정 유저 리뷰 목록 조회 — DTO는 bodyToUserId(body) 기준 */
export const handleListUserReviews = async (req, res, next) => {
/*
  #swagger.summary = '특정 유저의 리뷰 목록 조회';
  #swagger.tags = ['Review'];
#swagger.parameters['userId'] = {
  in: 'query',
  required: true,
  schema: { type: 'integer' },
  example: 1
};
  #swagger.parameters['cursor'] = {
    in: 'query',
    description: '다음 페이지 조회를 위한 커서(마지막 reviewId)',
    required: false,
    schema: { type: 'integer', example: 20 }
  };
  #swagger.responses[200] = {
    description: '특정 유저의 리뷰 목록 조회 성공 (커서 기반 페이지네이션 DTO)',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              description: "review 레코드 배열",
              items: {
                type: "object",
                description: "review 레코드 한 건",
                properties: {
                  reviewId: { type: "integer", example: 21 },
                  score: { type: "number", example: 4 },
                  detail: { type: "string", example: "친절했어요" },
                  restaurantId: { type: "integer", example: 3 },
                  userId: { type: "integer", example: 10 }
                  // 필요 시 createdAt 등 추가
                }
              }
            },
            pagination: {
              type: "object",
              properties: {
                cursor: {
                  type: "integer",
                  nullable: true,
                  example: 25,
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
                data: { type: "object", example: { userId: 10 } }
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

    // 누락·타입
    if (userId === undefined || userId === null || userId === "") {
      throw AppError.badRequest("missing_fields", { missing: ["userId"] });
    }
    if (Number.isNaN(Number(userId))) throw AppError.badRequest("invalid_field_type");

    const cursor = typeof req.query?.cursor === "string" && !Number.isNaN(Number(req.query.cursor))
      ? Number(req.query.cursor)
      : 0;

    const reviews = await listUserReviews(userId, cursor);
    return res.status(StatusCodes.OK).json(reviews);
  } catch (e) { next(e); }
};