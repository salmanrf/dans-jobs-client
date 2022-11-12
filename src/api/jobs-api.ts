import axios from "axios";
import { Job } from "../models/job.model";
import { API_URL } from "./url";

export interface FindJobsDto {
  location?: string;

  description?: string;

  full_time?: boolean | null;

  page: number;
}

export interface FindJobsResponse {
  data: {
    items: Job[];
    page: number;
  };
}

export interface FindJobByIdResponse {
  data: Job;
}

export async function fetchJobs(params: FindJobsDto, token: string) {
  try {
    const res = await axios.get<FindJobsResponse>(`${API_URL}/jobs/`, {
      params,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
}

export async function fetchJob(job_id: string, token: string) {
  try {
    const res = await axios.get<FindJobByIdResponse>(`${API_URL}/jobs/${job_id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
}
