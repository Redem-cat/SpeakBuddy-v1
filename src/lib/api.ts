// src/lib/api.ts

export interface BackendResponse<T = any> {
  status: 'ok' | 'error';
  command: string;
  data: T; 
}

// 原始后端响应结构
interface RawBackendResponse {
  status: 'ok' | 'error';
  command: string;
  data: string; // 后端返回的也是字符串
}

const API_BASE_URL = "http://127.0.0.1:8000/api/process";

export const sendCommand = async <T = any>(
  command: string, 
  payload: Record<string, any> = {}
): Promise<BackendResponse<T>> => {
  try {
    // 【关键修复】确保 payload 不为 null/undefined
    const safePayload = payload || {};

    // 【关键修复】后端要求 data 必须是 "JSON字符串"，而不是 JSON 对象
    // 错误做法: data: safePayload  -> 导致 422 错误
    // 正确做法: data: JSON.stringify(safePayload)
    const requestBody = {
      command: command,
      data: JSON.stringify(safePayload) 
    };

    console.log(`[API Request]`, requestBody); // 调试：查看发送的数据结构

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // 捕获 422 错误并打印详细信息（FastAPI 会告诉你是哪个字段错了）
    if (response.status === 422) {
      const errorDetail = await response.json();
      console.error("[API 422 Error] 参数校验失败:", errorDetail);
      throw new Error("参数格式错误 (422): 请检查控制台日志中的 detail");
    }

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const rawResult: RawBackendResponse = await response.json();

    // 解析后端返回的 data 字符串
    let parsedData: T;
    try {
      parsedData = typeof rawResult.data === 'string' 
        ? JSON.parse(rawResult.data) 
        : rawResult.data;
    } catch (e) {
      parsedData = rawResult.data as unknown as T;
    }

    if (rawResult.status === 'error') {
       const errorMsg = (parsedData as any)?.message || "Unknown Backend Error";
       throw new Error(errorMsg);
    }

    return {
      status: rawResult.status,
      command: rawResult.command,
      data: parsedData
    };

  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
};