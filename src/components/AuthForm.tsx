import React, { FormEvent, useContext, useEffect, useState } from "react";
import { fetchLogin, fetchSignup } from "../api/auth-api";
import { UserContext } from "../contexts/user.context";

export const AuthForm: React.FC = () => {
  const { set_token } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState("login");
  const [username, setUsername] = useState("");
  const [fullName, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setUsername("");
    setFullname("");
    setPassword("");
  }, [menu]);

  async function submitAuth(e: FormEvent) {
    e.preventDefault();

    if (menu === "signup") {
      return submitSignup();
    }
    if (menu === "login") {
      return submitLogin();
    }
  }

  async function submitSignup() {
    try {
      setLoading(true);

      const res = await fetchSignup({
        username,
        password,
        full_name: fullName,
      });

      setMenu("login");
    } catch (error) {
      const response = (error as any).response;

      if (response && response.data) {
        const { message = [] } = response.data;

        if (message instanceof Array) {
          setErrorMessage(message.join(", "));
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function submitLogin() {
    try {
      setLoading(true);

      const res = await fetchLogin({
        username,
        password,
      });

      const {
        data: { data },
      } = res;

      const { access_token } = data ?? {};

      if (access_token) {
        set_token(access_token);
      }
    } catch (error) {
      const response = (error as any).response;

      if (response && response.data) {
        const { message = [] } = response.data;

        if (message instanceof Array) {
          setErrorMessage(message.join(", "));
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-1/2 p-8 flex flex-col items-center justify-center bg-slate-700">
      <form action="" className="w-full h-full text-white" onSubmit={submitAuth}>
        {menu == "login" && <h2 className="font-bold text-center text-xl">Login</h2>}
        {menu == "signup" && <h2 className="font-bold text-center text-xl">Signup</h2>}
        {menu == "login" && (
          <div className="my-6 flex flex-col">
            <input
              name="username"
              placeholder="Username"
              className="mb-3 p-3 py-2 rounded-sm text-base text-slate-900"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              name="password"
              placeholder="Password"
              className="p-3 py-2 rounded-sm text-base text-slate-900"
              type={"password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        )}
        {menu == "signup" && (
          <div className="my-6 mb-3 flex flex-col">
            <input
              name="full_name"
              placeholder="Full Name"
              className="mb-3 p-3 py-2 rounded-sm text-base text-slate-900"
              value={fullName}
              onChange={(e) => {
                setFullname(e.target.value);
              }}
            />
            <input
              name="username"
              placeholder="Username"
              className="mb-3 p-3 py-2 rounded-sm text-base text-slate-900"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              name="password"
              placeholder="Password"
              className="p-3 py-2 rounded-sm text-base text-slate-900"
              type={"password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        )}

        <div className="w-full mb-6 flex flex-col justify-center items-center">
          <button className="py-3 px-4 text-white font-bold bg-slate-800 text-base" type="submit">
            {loading ? "Loading..." : "Submit"}
          </button>
          {errorMessage && (
            <div className="mt-3">
              <p className="text-red-300 text-xs">{errorMessage}</p>
            </div>
          )}
        </div>

        {menu === "login" && (
          <h4
            className="text-center font-bold text-xs cursor-pointer"
            onClick={() => setMenu("signup")}
          >
            Click Here To Signup
          </h4>
        )}
        {menu === "signup" && (
          <h4
            className="text-center font-bold text-xs cursor-pointer"
            onClick={() => setMenu("login")}
          >
            Click Here To Login
          </h4>
        )}
      </form>
    </div>
  );
};
