import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-daisyui";
import { fetchJobs } from "../api/jobs-api";
import { UserContext } from "../contexts/user.context";
import { Job } from "../models/job.model";
import { AuthForm } from "./AuthForm";

export const JobList: React.FC = () => {
  const navigate = useNavigate();
  const { is_authorized, user } = useContext(UserContext);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [params, setParams] = useState<{
    page: number;
    location: string;
    description: string;
    full_time: boolean | null;
  }>({
    page: 1,
    location: "",
    description: "",
    full_time: null,
  });

  useEffect(() => {
    if (is_authorized && user && user.token) {
      findJobs(user.token);
    }
  }, [is_authorized]);

  async function findJobs(token: string) {
    try {
      const res = await fetchJobs({ ...params }, token);

      const {
        data: { data },
      } = res;
      const { items } = data;

      if (items instanceof Array) {
        setJobs(items);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  if (!is_authorized) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="w-1/2 h-full mx-auto flex flex-col items-center">
      <div className="w-full mt-6 py-3 px-4 flex items-center bg-slate-700">
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-2 text-white text-base">
            Deskripsi
          </label>
          <input
            name="description"
            placeholder="Deskripsi..."
            className="mr-3 p-3 py-2 rounded-sm text-base text-slate-900"
            value={params.description}
            onChange={(e) => {
              setParams({ ...params, description: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-2 text-white text-base">
            Lokasi
          </label>
          <input
            name="location"
            placeholder="Lokasi..."
            className="mr-3 p-3 py-2 rounded-sm text-base text-slate-900"
            value={params.location}
            onChange={(e) => {
              setParams({ ...params, location: e.target.value });
            }}
          />
        </div>
      </div>
      <div className="w-full mt-6 py-3 px-4 flex flex-col items-center bg-slate-700">
        {jobs.map(({ id, title, type }) => (
          <div
            key={id}
            className="w-full px-4 py-3 mb-3 bg-slate-800 cursor-pointer"
            onClick={() => navigate(`/jobs/${id}`)}
          >
            <div className="flex items-center justify-between text-white">
              <h5 className="text-base">{title}</h5>
            </div>
            <h5 className="text-base text-white font-bold">{type}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};
