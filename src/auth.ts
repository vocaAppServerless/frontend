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
  message: string;
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
        `code_challenge_method=S256`;

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

      const { message, userInfo, tokens } = response.data;

      if (userInfo && tokens) {
        alert(message);
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
        localStorage.setItem("email", userInfo.email);
        localStorage.removeItem("code_verifier");
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

// const createCodeVerifier = (): string => {
//   const randomString: string = Math.random().toString(36).substring(2, 15);
//   return randomString;
// };

// const createCodeChallenge = (codeVerifier: string): Promise<string> => {
//   return crypto.subtle
//     .digest("SHA-256", new TextEncoder().encode(codeVerifier))
//     .then((hash: ArrayBuffer) => {
//       // Uint8Array에서 문자열 생성 (전개 연산자 없이 처리)
//       const base64String: string = btoa(
//         Array.from(new Uint8Array(hash))
//           .map((byte: number) => String.fromCharCode(byte))
//           .join("")
//       )
//         .replace(/\+/g, "-")
//         .replace(/\//g, "_")
//         .replace(/=+$/, "");

//       return base64String;
//     });
// };

// const getClientIdAndRedirectUri = async (): Promise<ClientData> => {
//   try {
//     const response = await axios.get<{ clientId: string; redirectUri: string }>(
//       `${api}/user?request=getClientIdAndRedirectUri`
//     );
//     return {
//       clientId: response.data.clientId,
//       redirectUri: response.data.redirectUri,
//     };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// const joinGoogleOauthUrl = async (): Promise<void> => {
//   try {
//     // 1. verifier와 challenge 생성
//     const codeVerifier: string = createCodeVerifier(); // 랜덤 문자열로 verifier 생성
//     localStorage.setItem("code_verifier", codeVerifier); // 로컬스토리지에 저장

//     const codeChallenge: string = await createCodeChallenge(codeVerifier); // codeVerifier를 사용하여 challenge 생성

//     // 2. getClientIdAndRedirectUri 함수 호출하여 clientId와 redirectUri를 받음
//     const { clientId, redirectUri }: ClientData =
//       await getClientIdAndRedirectUri(); // 백엔드에서 clientId, redirectUri를 받아옴

//     // 3. 받은 값들을 사용하여 Google OAuth URL 생성
//     const googleOauthUrl: string =
//       `https://accounts.google.com/o/oauth2/v2/auth?` +
//       `client_id=${encodeURIComponent(clientId)}&` +
//       `redirect_uri=${encodeURIComponent(redirectUri)}&` +
//       `response_type=code&` +
//       `scope=${encodeURIComponent("openid profile email")}&` + // 필요한 스코프 지정
//       `state=state_parameter_passthrough_value&` + // 상태 파라미터 (보안용)
//       `code_challenge=${encodeURIComponent(codeChallenge)}&` + // code_challenge 추가
//       `code_challenge_method=S256`; // PKCE 방식을 사용하기 위해 'S256' 지정

//     // 4. 최종적으로 Google OAuth URL로 리디렉션
//     window.location.href = googleOauthUrl;
//   } catch (error) {
//     console.error("Error during Google OAuth URL creation:", error);
//   }
// };

// //`${api}/user?request=sign`에다가 authToken과 codeVerifier를 헤더에 담아서 axios get요청
// // 응답받으면 access_token, refresh_token, email을 localStorage에 저장.
// //로컬스토리지의 code_verifier삭제
// const sign = async (oauthCode: string): Promise<void> => {
//   const codeVerifier = localStorage.getItem("code_verifier");

//   // codeVerifier가 없다면 에러 처리
//   if (!codeVerifier) {
//     throw new Error("Code verifier not found in localStorage");
//   }

//   try {
//     const response: AxiosResponse<SignResponse> = await axios.get(
//       `${api}/user?request=sign`,
//       {
//         headers: {
//           oauthCode: oauthCode,
//           codeVerifier: codeVerifier, // codeVerifier를 헤더에 포함
//         },
//       }
//     );

//     // 응답 받은 데이터에서 access_token, refresh_token, email 추출
//     const { message, userInfo, tokens } = response.data;

//     // 하나라도 없으면 에러 던짐
//     if (userInfo && tokens) {
//       alert(message); // 성공 메시지 출력
//       localStorage.setItem("access_token", tokens.access_token);
//       localStorage.setItem("refresh_token", tokens.refresh_token);
//       localStorage.setItem("email", userInfo.email);
//       // code_verifier 삭제
//       localStorage.removeItem("code_verifier");
//       // 추가 데이터 바인딩 필요 시 여기서 처리
//     } else {
//       throw new Error("Missing required sign data");
//     }
//   } catch (error) {
//     console.error("Error while fetching tokens:", error);
//     throw error;
//   }
// };
