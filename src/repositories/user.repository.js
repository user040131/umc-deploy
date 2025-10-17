import { pool } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail;`,
      data.email
    );

    if (confirm[0].isExistEmail) {
      return null;
    }

    const [result] = await pool.query(
      `INSERT INTO user (email, name, gender, birth, address, detail_address, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.name,
        data.gender,
        data.birth,
        data.address,
        data.detailAddress,
        data.phoneNumber,
      ]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query(`SELECT * FROM user WHERE id = ?;`, userId);

    console.log(user);

    if (user.length == 0) {
      return null;
    }

    return user;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  const conn = await pool.getConnection();

  try {
    await pool.query(
      `INSERT INTO user_favor_category (food_category_id, user_id) VALUES (?, ?);`,
      [foodCategoryId, userId]
    );

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query(
      "SELECT ufc.id, ufc.food_category_id, ufc.user_id, fcl.name " +
        "FROM user_favor_category ufc JOIN food_category fcl on ufc.food_category_id = fcl.id " +
        "WHERE ufc.user_id = ? ORDER BY ufc.food_category_id ASC;",
      userId
    );

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

export const insertReview = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [restaurant_id] = await pool.query(
            `SELECT restaurant_id FROM restaurant r WHERE r.restaurant_id = ?;`,
            data.restaurant_id
        );
        if (restaurant_id.length == 0) {
            throw new Error("존재하지 않는 restaurant입니다.");
        }

        const [review] = await pool.query(
            `INSERT INTO review (score, detail, pic, restaurant_id, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?);`,
            [
                data.score,
                data.detail,
                data.pic || null,
                data.restaurant_id,
                data.user_id,
                data.created_at
            ]
        );
        
        return review;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

export const insertMission = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [restaurant] = await pool.query(
            `SELECT restaurant_id FROM restaurant r WHERE r.restaurant_id = ?;`,
            data.restaurant_id
        );
        if (restaurant.length == 0) { throw new Error("존재하지 않는 restaurant입니다."); }

        const [mission] = await pool.query(
            `INSERT INTO mission (detail, compensation, restaurant_id, created_at) VALUES (?, ?, ?, ?);`,
            [
                data.detail,
                data.compensation,
                data.restaurant_id,
                data.created_at
            ]
        );

        return mission;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

export const insertAttemptMission = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [myMission] = await pool.query(
            `SELECT * FROM my_mission WHERE mission_id = ? AND user_id = ?;`,
            [data.mission_id, data.user_id]
        );
        if (myMission.length > 0) { throw new Error("이미 내 미션에 존재하는 미션입니다."); }

        const [attemptMission] = await pool.query(
            `INSERT INTO my_mission (state, classification_num, created_at, user_id, mission_id) VALUES (?, ?, ?, ?, ?);`,
            [
                data.state,
                data.classification_num,
                data.created_at,
                data.user_id,
                data.mission_id
            ]
        );

        return attemptMission;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};