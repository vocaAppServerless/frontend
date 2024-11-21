import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState<string>("");

  const endpoint: string | undefined =
    process.env.REACT_APP_API_GATEWAY_ENDPOINT;
  const env: string | undefined = process.env.REACT_APP_ENV;

  interface Dog {
    name: string;
    age: number;
  }
  let obj: Dog = {
    name: "muzzi",
    age: 3,
  };
  console.log(obj);

  const test_funcs = {
    test_front_env: () => {
      const dog: string | undefined = process.env.REACT_APP_DOG;

      if (dog) {
        alert(dog);
      } else {
        alert("Dog environment variable is not set.");
      }
    },
    test_front_env_api_gw_ep: () => {
      if (endpoint) {
        alert("available to read endpoint.");
      } else {
        alert("api gateway endpoint environment variable is not set.");
      }
    },
    test_connect_to_lambda: () => {
      fetch(`${endpoint}/test?request=connectLambda`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          alert("Error connecting to Lambda: " + JSON.stringify(error));
        });
    },
    test_connect_to_db: () => {
      fetch(`${endpoint}/test?request=connectDb`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          alert("Error connecting to Lambda: " + JSON.stringify(error));
        });
    },
  };

  return (
    <div className="App">
      <div className="container_app">
        <h1>hello Remember me project!</h1>
        {message && <div>{message}</div>}
        <p>{env}</p>
      </div>

      {/* ----  test zone  ---- */}
      <div className="test_zone_container border shadow">
        <h2 className="text-center mb-4">Infra Test Zone</h2>

        {/* Buttons */}
        <div className="test_zone_div">
          <div className="row border shadow">
            <button
              className="test_btn btn btn-primary"
              onClick={test_funcs.test_front_env}
            >
              TEST
            </button>
            <div className="test_description">
              <h6 className="test_ds_title">S3 환경변수 읽기 test</h6>
              <p className="test_ds_detail">
                frontend repository의 git action secret에 등록한
                REACT_APP_DOG환경변수 값이 뜨면 성공!
              </p>
            </div>
          </div>

          <div className="row border shadow">
            <button
              className="test_btn btn btn-primary"
              onClick={test_funcs.test_front_env_api_gw_ep}
            >
              TEST
            </button>
            <div className="test_description">
              <h6 className="test_ds_title">S3환경변수 endpoint 읽기 test</h6>
              <p className="test_ds_detail">
                'available to read endpoint'가 출력되면 성공! *꼭 환경변수에
                REACT_APP_접두사를 붙여줘야합니다.
                REACT_APP_API_GATEWAY_ENDPOINT
              </p>
            </div>
          </div>

          <div className="row border shadow">
            <button
              className="test_btn btn btn-primary"
              onClick={test_funcs.test_connect_to_lambda}
            >
              TEST
            </button>
            <div className="test_description">
              <h6 className="test_ds_title">lambda 통신 test</h6>
              <p className="test_ds_detail">
                test 람다랑 통신 테스트 / hello test from test lambda가 뜨면
                성공!
              </p>
            </div>
          </div>

          <div className="row border shadow">
            <button
              className="test_btn btn btn-primary"
              onClick={test_funcs.test_connect_to_db}
            >
              TEST
            </button>
            <div className="test_description">
              <h6 className="test_ds_title">db 통신 test</h6>
              <p className="test_ds_detail">
                test db 통신 테스트 / 컬렉션 리스트가 보이면 성공!
              </p>
            </div>
          </div>

          <div className="row border shadow disabled">
            <button
              className="test_btn btn btn-primary disabled-btn"
              onClick={test_funcs.test_connect_to_lambda}
            >
              TEST
            </button>
            <div className="test_description">
              <h6 className="test_ds_title">미구현 test</h6>
              <p className="test_ds_detail">test</p>
            </div>
          </div>
          {/* <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-success">Success</button>
          <button className="btn btn-danger">Danger</button>
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-info">Info</button>
          <button className="btn btn-light">Light</button>
          <button className="btn btn-dark">Dark</button> */}
        </div>
      </div>
    </div>
  );
}

export default App;
