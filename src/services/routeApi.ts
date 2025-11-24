import { Route } from "../types";
import { post } from "./apiClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface RouteSuccessResponse {
  route_id: string;
  origin: string;
  destination: string;
  routes: object[];
}

export interface RouteValidationError {
  detail: {
    loc: (string | number)[];
    msg: string;
    type: string;
  }[];
}

/**
 * 경로 검색 API 호출
 *
 * @param origin - 출발지
 * @param destination - 도착지
 * @param disability_type - 교통약자 유형 (e.g., "PHY", "VIS", "AUD", "ELD")
 * @returns 검색된 경로 결과
 */
export async function searchRoutes(
  origin: string,
  destination: string,
  disability_type: string
): Promise<RouteSuccessResponse> {
  try {
    // apiClient의 post 헬퍼 사용 (자동으로 JWT 토큰 추가 및 401 에러 처리)
    const data = await post<RouteSuccessResponse>(
      `${BASE_URL}/api/v1/navigation/calculate`,
      {
        origin,
        destination,
        disability_type,
      }
    );

    return data;
  } catch (error) {
    console.error("Error searching routes:", error);
    throw error;
  }
}
