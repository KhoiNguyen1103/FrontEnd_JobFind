import axiosClient from "./axiosClient";

const savedJob = {
  save: (jobId, jobSeekerProfileId) => {
    const url = `/savedJob/save?jobId=${jobId}&jobSeekerProfileId=${jobSeekerProfileId}`;
    return axiosClient.post(url);
  },

  listSavedJobs: (jobSeekerProfileId) => {
    const url = `/savedJob/listSavedJobs?jobSeekerProfileId=${jobSeekerProfileId}`;
    return axiosClient.get(url);
  },

  unsave: (jobId, jobSeekerProfileId) => {
    const url = `/savedJob/unsave?jobId=${jobId}&jobSeekerProfileId=${jobSeekerProfileId}`;
    return axiosClient.post(url);
  },
};

export default savedJob;
