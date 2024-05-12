import { ApiResponse } from "../interfaces";


export class ResponseUtility {
  static sendSuccessResponse(data: Record<string, any> | Array<any> | string, status = 200): ApiResponse {
    return { success: true, code: status, data };
  }

  static sendSuccessMessage(message: Record<string, any> | Array<any> | string, status = 200): ApiResponse {
    return { success: true, code: status, message };
  }

  static sendErrorResponse(error: Record<string, any> | string, status = 500): ApiResponse {
    return { success: false, code: status, error };
  }

  static sendNoContentResponse(status = 204): ApiResponse {
    return { success: true, code: status };
  }

  static sendWithMetaResponse(data: Record<string, any>, status = 200): ApiResponse {
    return { success: true, code: status, data };
  }
}
