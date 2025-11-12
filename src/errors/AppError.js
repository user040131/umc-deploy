// src/errors/AppError.js
export class AppError extends Error {
  constructor({ statusCode = 500, errorCode = "unknown", reason = null, data = null }) {
    super(reason || errorCode);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.reason = reason;
    this.data = data;
  }
  static badRequest(r="bad_request", d){ return new AppError({ statusCode:400, errorCode:"bad_request", reason:r, data:d }); }
  static notFound(r="not_found", d){ return new AppError({ statusCode:404, errorCode:"not_found", reason:r, data:d }); }
  static conflict(r="conflict", d){ return new AppError({ statusCode:409, errorCode:"conflict", reason:r, data:d }); }
}
export default AppError; // 기본/이름 둘 다 지원
