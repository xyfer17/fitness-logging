export interface ApiResponse {
    success: boolean;
    code: number;
    data?: Record<string, any> | Array<any> | string;
    message?: Record<string, any> | Array<any> | string;
    error?: Record<string, any> | string;
  }
  