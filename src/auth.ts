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
        `access_type=offline&` + // 리프레시 토큰 요청
        `prompt=consent`; // 강제 동의 화면 표시

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
};
