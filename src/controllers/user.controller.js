// controllers/user.controller.js
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";
import { userSignUp, userUpdate } from "../services/user.service.js";
import { bodyToUser } from "../dtos/user.dto.js";

/* 1) 회원가입 */
export const handleUserSignUp = async (req, res, next) => {
  /*
  #swagger.summary = '회원 가입 API';
  #swagger.tags = ['User'];
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: [
            "email",
            "password",
            "name",
            "gender",
            "birth",
            "address",
            "detailAddress",
            "phoneNumber",
            "preferences"
          ],
          properties: {
            email: {
              type: "string",
              description: "이메일(고유 값)",
              example: "user@example.com"
            },
            password: {
              type: "string",
              description: "로그인 비밀번호(서버에서 해시 저장)",
              example: "P@ssw0rd!"
            },
            name: {
              type: "string",
              description: "이름",
              example: "박승주"
            },
            gender: {
              type: "string",
              description: "성별 (예: M/F)",
              example: "M"
            },
            birth: {
              type: "string",
              format: "date",
              description: "생년월일 (YYYY-MM-DD)",
              example: "2004-01-31"
            },
            address: {
              type: "string",
              description: "기본 주소",
              example: "서울특별시 송파구"
            },
            detailAddress: {
              type: "string",
              description: "상세 주소",
              example: "잠실 어딘가 아파트"
            },
            phoneNumber: {
              type: "string",
              description: "휴대폰 번호",
              example: "01012345678"
            },
            nickname: {
              type: "string",
              description: "닉네임(선택)",
              example: "stackers_sj"
            },
            preferences: {
              type: "array",
              description: "선호 음식 카테고리 ID 배열",
              items: { type: "number" },
              example: [1, 2, 3]
            }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: "회원 가입 성공 응답",
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
                email: { type: "string", example: "user@example.com" },
                name: { type: "string", example: "박승주" },
                gender: { type: "string", example: "M" },
                birth: {
                  type: "string",
                  description: "ISO 문자열 형태의 날짜",
                  example: "2004-01-31T00:00:00.000Z"
                },
                address: { type: "string", example: "서울특별시 송파구" },
                detailAddress: { type: "string", example: "잠실 어딘가 아파트" },
                phoneNumber: { type: "string", example: "01012345678" },
                preferences: {
                  type: "array",
                  description: "저장된 선호 카테고리 ID 배열",
                  items: { type: "number" },
                  example: [1, 2, 3]
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "잘못된 요청 (필수 필드 누락 또는 타입 오류)",
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
                  description: "missing_fields | invalid_field_type 등"
                },
                data: {
                  type: "object",
                  example: {
                    missing: ["email","password","name"],
                    invalid: ["preferences"]
                  }
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
    description: "이미 존재하는 이메일로 가입 시도 (email_exists)",
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
                reason: { type: "string", example: "email_exists" },
                data: {
                  type: "object",
                  example: { email: "user@example.com" }
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
    const {
      email, password, name, gender, birth, address, detailAddress, phoneNumber, preferences
    } = req.body;

    // 누락
    const required = ["email","password","name","gender","birth","address","detailAddress","phoneNumber","preferences"];
    const missing = required.filter(k => {
      const v = req.body?.[k];
      return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
    });
    if (missing.length) throw AppError.badRequest("missing_fields", { missing });

    // 타입
    const mustBeString = { email, password, name, gender, birth, address, detailAddress, phoneNumber };
    const invalidStrings = Object.entries(mustBeString).filter(([, v]) => typeof v !== "string").map(([k]) => k);
    const invalid = [...invalidStrings, ...(Array.isArray(preferences) ? [] : ["preferences"])];
    if (invalid.length) {
      console.log("signup type debug:", {
        email: typeof email, password: typeof password, name: typeof name, gender: typeof gender, birth: typeof birth,
        address: typeof address, detailAddress: typeof detailAddress, phoneNumber: typeof phoneNumber,
        preferences: Array.isArray(preferences) ? "array" : typeof preferences
      });
      throw AppError.badRequest("invalid_field_type", { invalid });
    }

    const user = await userSignUp(bodyToUser(req.body));
    return res.status(StatusCodes.OK).success(user);
  } catch (e) { next(e); }
};

export const handleUpdateUser = async (req, res, next) => {
  /*
  #swagger.summary = '회원 정보 수정 API';
  #swagger.tags = ['User'];
 #swagger.parameters['userId'] = {
  in: 'path',
  required: true,
  schema: { type: 'integer' },
  example: 1
};
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          description: "수정하고자 하는 필드만 포함해서 전송",
          properties: {
            email: {
              type: "string",
              description: "변경할 이메일(선택)",
              example: "new@example.com"
            },
            password: {
              type: "string",
              description: "변경할 비밀번호(선택, 서버에서 해시)",
              example: "NewP@ssw0rd!"
            },
            name: {
              type: "string",
              description: "변경할 이름(선택)",
              example: "박승주2"
            },
            gender: {
              type: "string",
              description: "변경할 성별(선택)",
              example: "M"
            },
            birth: {
              type: "string",
              format: "date",
              description: "변경할 생년월일(선택, YYYY-MM-DD)",
              example: "2004-01-31"
            },
            address: {
              type: "string",
              description: "변경할 기본 주소(선택)",
              example: "서울특별시 강남구"
            },
            detailAddress: {
              type: "string",
              description: "변경할 상세 주소(선택)",
              example: "어딘가 오피스텔"
            },
            phoneNumber: {
              type: "string",
              description: "변경할 휴대폰 번호(선택)",
              example: "01099998888"
            },
            nickname: {
              type: "string",
              description: "변경할 닉네임(선택)",
              example: "stackers_sj2"
            },
            preferences: {
              type: "array",
              description: "변경할 선호 음식 카테고리 ID 배열(선택, 있으면 덮어씀)",
              items: { type: "number" },
              example: [2, 4, 5]
            }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: '회원 정보 수정 성공 응답',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              description: "수정된 유저 정보",
              properties: {
                email: { type: "string", example: "new@example.com" },
                name: { type: "string", example: "박승주2" },
                gender: { type: "string", example: "M" },
                birth: {
                  type: "string",
                  description: "ISO 문자열 형태의 날짜",
                  example: "2004-01-31T00:00:00.000Z"
                },
                address: { type: "string", example: "서울특별시 강남구" },
                detailAddress: { type: "string", example: "어딘가 오피스텔" },
                phoneNumber: { type: "string", example: "01099998888" },
                preferences: {
                  type: "array",
                  description: "적용된 선호 음식 카테고리 ID 배열",
                  items: { type: "number" },
                  example: [2, 4, 5]
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: '잘못된 요청 (userId 타입 오류 또는 필드 타입 오류)',
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
                  example: "invalid_field_type"
                },
                data: {
                  type: "object",
                  example: { invalid: ["email","preferences"] }
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
    description: '대상 유저를 찾을 수 없음 (user_not_found)',
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

  try{
    console.log('params:', req.params);
    console.log('query:', req.query);
    const userIdRaw = req.params.userId;
    if (
      userIdRaw === undefined ||
      userIdRaw === null ||
      userIdRaw === "" ||
      Number.isNaN(Number(userIdRaw))
    ) {
      throw AppError.badRequest("invalid_field_type", { invalid: ["userId"] });
    }
    const userId = Number(userIdRaw);

    const body = req.body;

    // 존재하는 필드만 타입 검사
    const stringFields = [
      "email",
      "password",
      "name",
      "gender",
      "birth",
      "address",
      "detailAddress",
      "phoneNumber",
      "nickname",
    ];

    const invalid = [];

    for (const key of stringFields) {
      if (body[key] !== undefined && typeof body[key] !== "string") {
        invalid.push(key);
      }
    }

    if (body.preferences !== undefined && !Array.isArray(body.preferences)) {
      invalid.push("preferences");
    }

    if (invalid.length) {
      throw AppError.badRequest("invalid_field_type", { invalid });
    }

    const user = await userUpdate(userId, bodyToUser(req.body));
    return res.status(StatusCodes.OK).success(user);
  } catch (e) { next(e); }
};