import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import
import passport from "passport";

dotenv.config();
const secret = process.env.JWT_SECRET; // .env의 비밀 키

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "1h",
  });
}; // 1시간 유효한 액세스 토큰 생성

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, secret, { expiresIn: "14d" });
}; // 14일 유효한 리프레시 토큰 생성

// GoogleVerify
const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }

  console.log("프로필 콘솔!!!!!!!!!!:", profile);

  const created = await prisma.user.create({
    data: {
      email,
      name: profile.displayName,
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
      providerUserId: profile.id.toString(),
    },
  }); // 구글에서 넘겨주는 정보를 바탕으로 신규 유저 생성 (profile에 뭐 들어있음? 콘솔로 찍어보기)

  return { id: created.id, email: created.email, name: created.name };
};

// GoogleStrategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/google", //구글에서 이 url로 정보와 함께 리다이렉트를 줌
    scope: ["email", "profile"],
  },

  async (accessToken, refreshToken, profile, cb) => {
    try {
      console.log("프로필 콘솔!!!!!!!!!!:", profile);
      const user = await googleVerify(profile);

      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const jwtOptions = {
  // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //env 파일에 정의된 secretKey를 사용해 signature 검증
  secretOrKey: process.env.JWT_SECRET,
}; //해당 로직 내에서 JWT Signature 검증 및 Payload 추출

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { id: payload.id } });
      //검증이 완료된 JWT에 대해서 유저 정보 확인
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }
);

passport.use("jwt", jwtStrategy);