import React from "react";

interface TestZoneProps {
  endpoint?: string;
}

const TestZone: React.FC<TestZoneProps> = ({ endpoint }) => {
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
        alert("API Gateway endpoint environment variable is not set.");
      }
    },
    test_connect_to_lambda: () => {
      if (endpoint) {
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
      }
    },
    test_connect_to_db: () => {
      if (endpoint) {
        fetch(`${endpoint}/test?request=connectDb`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            alert(data.collections);
          })
          .catch((error) => {
            alert("Error connecting to db: " + JSON.stringify(error));
          });
      }
    },
  };

  return (
    <div className="test_zone_container border shadow">
      <h2 className="text-center mb-4">Infra Test Zone</h2>

      <div className="test_zone_div">
        {/* Test Button for REACT_APP_DOG */}
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

        {/* Test Button for API Gateway Endpoint */}
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
              'available to read endpoint'가 출력되면 성공!
            </p>
          </div>
        </div>

        {/* Test Button for Lambda Connection */}
        <div className="row border shadow">
          <button
            className="test_btn btn btn-primary"
            onClick={test_funcs.test_connect_to_lambda}
          >
            TEST
          </button>
          <div className="test_description">
            <h6 className="test_ds_title">Lambda 통신 test</h6>
            <p className="test_ds_detail">
              Test 람다랑 통신 테스트 / "Hello test from test lambda"가 뜨면
              성공!
            </p>
          </div>
        </div>

        {/* Test Button for DB Connection */}
        <div className="row border shadow">
          <button
            className="test_btn btn btn-primary"
            onClick={test_funcs.test_connect_to_db}
          >
            TEST
          </button>
          <div className="test_description">
            <h6 className="test_ds_title">DB 통신 test</h6>
            <p className="test_ds_detail">
              Test DB 통신 테스트 / 컬렉션 리스트가 보이면 성공!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestZone;
