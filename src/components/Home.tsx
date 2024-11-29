//Home

import "./Home.scss";
import { auth } from "../auth";
import { useSelector } from "react-redux";
import WordListBox from "./small/WordListBox";

//icons
import { MdFavorite } from "react-icons/md";

type GoogleLoginButtonProps = {
  onClick: () => void;
};

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => (
  <button className="google-login-btn " onClick={onClick}>
    <img
      src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
      alt="Google logo"
      className="google-logo"
    />
    <span>Login with Google</span>
  </button>
);

const Home = () => {
  const state = useSelector((state: any) => state);
  const lists = useSelector((state: any) => state.data.lists);
  const isLoading = useSelector((state: any) => state.mode.isLoading);

  return (
    <div className="container_home">
      {!state.mode.isSign && (
        <GoogleLoginButton
          onClick={() => {
            auth.joinGoogleOauthUrl();
          }}
        />
      )}
      {!isLoading && state.mode.isSign && (
        <div className="contents-home">
          <div className="title-box">
            <MdFavorite
              className="bounce-top"
              style={{ fontSize: "40px", color: "#FF6347" }}
            />
            <h6 className="title-favorite">My Favorite Notes</h6>
          </div>

          <div className="lists">
            {lists && lists.length > 0 ? (
              lists
                .filter((list: any) => list.is_bookmark && !list.is_deleted) // is_bookmark가 true이고, is_deleted가 false인 항목만 필터링
                .map((list: any) => (
                  <WordListBox
                    key={list._id} // 각 컴포넌트에 고유한 key 값 추가
                    name={list.name}
                    creation_date={list.creation_date}
                    language={list.language}
                    linked_incorrect_word_lists={
                      list.linked_incorrect_word_lists
                    }
                    is_bookmark={list.is_bookmark}
                  />
                ))
            ) : (
              <p>No bookmarked word lists</p>
            )}
          </div>

          <div className="title-box p-2">
            <img
              className="lang-img bounce-top"
              src="https://raw.githubusercontent.com/lipis/flag-icons/e119b66129af6dd849754ccf25dfbf81d4a306d5/flags/1x1/us.svg"
              alt="US Flag"
            />
            <h6 className="title-lang">English</h6>
          </div>

          <div className="lists">
            {/* 영어 리스트 */}
            {lists && lists.length > 0 ? (
              lists
                .filter(
                  (list: any) => list.language === "en" && !list.is_deleted
                ) // 영어만 필터링
                .map((list: any) => (
                  <WordListBox
                    key={list._id}
                    name={list.name}
                    creation_date={list.creation_date}
                    language={list.language}
                    linked_incorrect_word_lists={
                      list.linked_incorrect_word_lists
                    }
                    is_bookmark={list.is_bookmark}
                  />
                ))
            ) : (
              <p>No English word lists.</p>
            )}
          </div>
          <div className="title-box">
            <img
              className="lang-img bounce-top"
              src="https://raw.githubusercontent.com/lipis/flag-icons/e119b66129af6dd849754ccf25dfbf81d4a306d5/flags/1x1/jp.svg"
              alt="JP Flag"
            />
            <h6 className="title-lang">Japanese</h6>
          </div>

          <div className="lists">
            {/* 일본어 리스트 */}
            {lists && lists.length > 0 ? (
              lists
                .filter(
                  (list: any) => list.language === "jp" && !list.is_deleted
                ) // 일본어만 필터링
                .map((list: any) => (
                  <WordListBox
                    key={list._id}
                    name={list.name}
                    creation_date={list.creation_date}
                    language={list.language}
                    linked_incorrect_word_lists={
                      list.linked_incorrect_word_lists
                    }
                    is_bookmark={list.is_bookmark}
                  />
                ))
            ) : (
              <p>No Japanese word lists</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
