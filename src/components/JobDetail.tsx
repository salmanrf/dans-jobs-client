import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-daisyui";
import { fetchJob, fetchJobs } from "../api/jobs-api";
import { UserContext } from "../contexts/user.context";
import { Job } from "../models/job.model";
import { AuthForm } from "./AuthForm";

export const JobDetail: React.FC = () => {
  const params = useParams();
  const { is_authorized, user } = useContext(UserContext);
  const [job, setJob] = useState<Job | null>();
  const desc_ref = useRef();
  const apply_ref = useRef();

  useEffect(() => {
    if (is_authorized && user && user.token) {
      if (params && params.job_id) {
        findJob(params.job_id, user.token);
      }
    }
  }, [is_authorized]);

  useEffect(() => {
    if (desc_ref.current && job != null) {
      (desc_ref.current as HTMLElement).innerHTML = job?.description;
    }
    if (apply_ref.current && job != null) {
      (apply_ref.current as HTMLElement).innerHTML = job?.description;
    }
  }, [job]);

  async function findJob(job_id: string, token: string) {
    try {
      const res = await fetchJob(job_id, token);

      const {
        data: { data },
      } = res;

      if (data) {
        setJob(data);
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

  if (job != null) {
    return (
      <div className="w-3/4 h-full mx-auto flex flex-col items-center">
        <div className="w-full mt-6 py-3 px-4 flex flex-col items-center bg-slate-700">
          <div className="w-full flex items-center justify-center py-3 px-4">
            <div className="w-32 h-32">
              <img
                src={job.company_logo}
                alt="company-logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
          <div key={job.id} className="w-full px-4 py-3 bg-slate-800 cursor-pointer">
            <div className="flex items-center justify-between text-white">
              <h5 className="text-base">{job.title}</h5>
            </div>
            <div className="w-full flex justify-between items-center">
              <h5 className="text-base text-white font-bold">{job.company}</h5>
              <h5 className="text-base text-white font-bold">{job.type}</h5>
            </div>
          </div>
          <div className="w-full flex-flex-col mt-6 px-4 py-3 text-white bg-slate-800">
            <div className="text-white text-xl font-bold mb-4">Location</div>
            <p>{job.location}</p>
          </div>
          <div className="w-full flex-flex-col mt-6 px-4 py-3 text-white bg-slate-800">
            <div className="text-white text-xl font-bold mb-4">Description</div>
            <p ref={desc_ref as any}></p>
          </div>
          <div className="w-full flex-flex-col mt-6 px-4 py-3 text-white bg-slate-800">
            <div className="text-white text-xl font-bold mb-4">How To Apply</div>
            <p ref={apply_ref as any}></p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
