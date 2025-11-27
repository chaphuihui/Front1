/**
 * 전역 API 클라이언트
 *
 * JWT 인증과 자동 토큰 갱신을 포함한 fetch wrapper
 * 모든 API 호출에서 공통으로 사용할 수 있습니다.
 *
 * 기능:
 * - 자동 JWT 토큰 헤더 추가
 * - 401 에러 시 자동 토큰 갱신 및 재시도
 * - 일관된 에러 핸들링
 */

import { tokenManager } from './tokenManager';
import { authApi } from './authApi';

/**
 * JWT 인증이 포함된 fetch wrapper
 *
 * @param url - API URL
 * @param options - fetch options
 * @returns Response 객체
 *
 * @example
 * const response = await fetchWithAuth('/api/v1/routes', {
 *   method: 'GET',
 * });
 * const data = await response.json();
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = tokenManager.getAccessToken();

  // 헤더에 Authorization 추가
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 첫 번째 요청
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 에러 처리: 토큰 갱신 후 재시도
  if (response.status === 401 && tokenManager.hasTokens()) {
    try {
      console.log('[ApiClient] 401 Unauthorized - 토큰 갱신 시도');

      // 토큰 갱신
      const { access_token, refresh_token } = await authApi.refreshToken();
      tokenManager.setTokens(access_token, refresh_token);

      // 새 토큰으로 재시도
      headers['Authorization'] = `Bearer ${access_token}`;
      response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('[ApiClient] 토큰 갱신 성공, 요청 재시도 완료');
    } catch (error) {
      console.error('[ApiClient] 토큰 갱신 실패:', error);

      // 토큰 갱신 실패 시 로그아웃 처리
      tokenManager.clearTokens();

      // 로그인 페이지로 리다이렉트 필요
      // (여기서는 에러만 throw, 실제 리다이렉트는 Context에서 처리)
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
  }

  return response;
}

/**
 * JSON 응답을 자동으로 파싱하는 fetch wrapper
 *
 * @param url - API URL
 * @param options - fetch options
 * @returns 파싱된 JSON 데이터
 *
 * @example
 * const data = await fetchJSON<Route[]>('/api/v1/routes');
 */
export async function fetchJSON<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.detail || errorMessage;
    } catch {
      // JSON 파싱 실패 시 원본 텍스트 사용
      if (errorText) {
        errorMessage = errorText;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * GET 요청 헬퍼
 */
export async function get<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchJSON<T>(url, { ...options, method: 'GET' });
}

/**
 * POST 요청 헬퍼
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options: RequestInit = {}
): Promise<T> {
  return fetchJSON<T>(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT 요청 헬퍼
 */
export async function put<T = any>(
  url: string,
  data?: any,
  options: RequestInit = {}
): Promise<T> {
  return fetchJSON<T>(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 요청 헬퍼
 */
export async function del<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchJSON<T>(url, { ...options, method: 'DELETE' });
}

/**
 * PATCH 요청 헬퍼
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  options: RequestInit = {}
): Promise<T> {
  return fetchJSON<T>(url, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}
