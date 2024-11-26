import axios, { AxiosResponse } from "axios";
const api: string | undefined = process.env.REACT_APP_API_GATEWAY_ENDPOINT;

//sign flow funcs

interface ClientData {
  clientId: string;
  redirectUri: string;
}

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface UserInfo {
  email: string;
  name: string;
  picture: string;
}

interface SignResponse {
  authResponse: string;
  userInfo: UserInfo;
  tokens: Tokens;
}

// auth 객체
export const auth = {
  // Code verifier 생성
  createCodeVerifier: (): string => {
    const randomString: string = Math.random().toString(36).substring(2, 15);
    return randomString;
  },

  // Code challenge 생성
  createCodeChallenge: (codeVerifier: string): Promise<string> => {
    return crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(codeVerifier))
      .then((hash: ArrayBuffer) => {
        const base64String: string = btoa(
          Array.from(new Uint8Array(hash))
            .map((byte: number) => String.fromCharCode(byte))
            .join("")
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        return base64String;
      });
  },

  // Client ID와 Redirect URI를 백엔드에서 가져오기
  getClientIdAndRedirectUri: async (): Promise<ClientData> => {
    try {
      const response = await axios.get<{
        clientId: string;
        redirectUri: string;
      }>(`${api}/user?request=getClientIdAndRedirectUri`);
      return {
        clientId: response.data.clientId,
        redirectUri: response.data.redirectUri,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  // Google OAuth URL 생성 및 리디렉션
  joinGoogleOauthUrl: async (): Promise<void> => {
    try {
      const codeVerifier: string = auth.createCodeVerifier();
      localStorage.setItem("code_verifier", codeVerifier); // 로컬스토리지에 저장

      const codeChallenge: string = await auth.createCodeChallenge(
        codeVerifier
      );

      const { clientId, redirectUri }: ClientData =
        await auth.getClientIdAndRedirectUri();

      const googleOauthUrl: string =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent("openid profile email")}&` +
        `state=state_parameter_passthrough_value&` +
        `code_challenge=${encodeURIComponent(codeChallenge)}&` +
        `code_challenge_method=S256&` +
        `access_type=offline&` +
        `prompt=consent`;

      window.location.href = googleOauthUrl;
    } catch (error) {
      console.error("Error during Google OAuth URL creation:", error);
      throw error;
    }
  },

  // 인증 후, 토큰 및 사용자 정보 저장
  sign: async (oauthCode: string): Promise<UserInfo | undefined> => {
    const codeVerifier = localStorage.getItem("code_verifier");

    if (!codeVerifier) {
      throw new Error("Code verifier not found in localStorage");
    }

    try {
      const response: AxiosResponse<SignResponse> = await axios.get(
        `${api}/user?request=sign`,
        {
          headers: {
            oauthCode: oauthCode,
            codeVerifier: codeVerifier,
          },
        }
      );

      const { authResponse, userInfo, tokens } = response.data;

      if (userInfo && tokens) {
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
        localStorage.setItem("email", userInfo.email);
        localStorage.removeItem("code_verifier");
        console.log(authResponse);

        return userInfo;
      } else {
        throw new Error("Missing required sign data");
      }
    } catch (error) {
      console.error("Error while fetching tokens:", error);
      throw error;
    }
  },
  api: axios.create({
    baseURL: api,
    timeout: 5000, // 요청 타임아웃
    headers: {
      "Content-Type": "application/json",
    },
  }),
};

//------------------- interceptors ----------------------

// Request 인터셉터: 모든 요청에 access_token을 헤더에 추가
auth.api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Access-Token"] = `Bearer ${accessToken}`;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터
auth.api.interceptors.response.use(
  (response) => {
    // 응답 코드 200번이고 authResponse가 success authorization인 경우
    if (
      // response.status === 200 &&
      response.data.authResponse === "success authorization"
    ) {
      // 로직 처리 (데이터 반환)
      return response;
    } else if (
      // response.status === 201 &&
      response.data.authResponse?.message === "here is new tokens"
    ) {
      const access_token = response.data.authResponse.access_token;
      const refresh_token = response.data.authResponse.refresh_token;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      return response;
    } else {
      console.log(response);
      return response;
    }
  },
  async (error) => {
    const originalRequest = error.config;

    // 응답 코드 419번, authResponse가 expired access token인 경우
    if (
      error.response?.status === 419 &&
      error.response?.data.authResponse === "expired access token"
    ) {
      console.error("access is expired. retry request with refresh token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.error("there is not refresh token in local storage!");
        return Promise.reject(error);
      }

      // refresh token을 헤더에 담아 새로 요청
      try {
        // 기존 요청의 데이터를 유지하며 refresh token만 헤더에 추가
        delete originalRequest.headers["Access-Token"];
        originalRequest.headers["Refresh-Token"] = `Bearer ${refreshToken}`;
        originalRequest.headers["Content-Type"] = "application/json";

        // 기존 요청을 그대로 재시도
        const response = await axios(originalRequest);
        // return response.data;
        return response;
      } catch (refreshError) {
        alert("Error refreshing token:" + JSON.stringify(refreshError));
        // Refresh 실패 시 로컬스토리지 및 상태 초기화
        localStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      if (error.response.status >= 500) {
        // 500번대 오류 처리
        console.error("API error:", error.message);
      } else if (error.response.status >= 400 && error.response.status < 500) {
        // 400번대 오류 처리
        alert(
          "Authorization Error" +
            JSON.stringify(error.response?.data?.authResponse) ||
            "Unknown error"
        );
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }
    }
  }
);
