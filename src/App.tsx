import { useEffect, useState } from "react";
import { Theme } from "react-daisyui";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { fetchSelf } from "./api/auth-api";
import { JobDetail } from "./components/JobDetail";
import { JobList } from "./components/JobList";
import { UserContext } from "./contexts/user.context";
import { User } from "./models/user.model";

function App() {
  const [user, setUser] = useState<User>({});
  const [token, setToken] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getAuthorizedUser(token);
    }
  }, [token]);

  async function getAuthorizedUser(token: string) {
    try {
      const {
        data: { data = {} },
      } = await fetchSelf(token);

      if (data) {
        setUser({ ...data, token });
        setIsAuthorized(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  function updateToken(token: string) {
    localStorage.setItem("access_token", token);
    setToken(token);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        is_authorized: isAuthorized,
        set_token: updateToken,
      }}
    >
      <Theme dataTheme="dark">
        <div className="w-screen h-screen min-h-screen">
          <div className="w-full bg-slate-800 py-4 px-8">
            <a className="text-lg font-bold text-white cursor-pointer" href="/">
              JOBS
            </a>
          </div>
          <div className="w-full h-full">
            <Router>
              <Routes>
                <Route path="/jobs/:job_id" element={<JobDetail />}></Route>
                <Route path="/jobs" element={<JobList />}></Route>
                <Route path="/" element={<JobList />}></Route>
              </Routes>
            </Router>
          </div>
        </div>
      </Theme>
    </UserContext.Provider>
  );
}

export default App;
