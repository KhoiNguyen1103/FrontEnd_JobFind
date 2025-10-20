import axiosClient from './axiosClient';

const jobSeekerApi = {
    getProfileByUserId: (userId) => {
        const url = `/jobseeker/getProfileByUserId?userId=${userId}`;
        return axiosClient.get(url);
    },

    addWorkExperience: (userId, workExpRequest) => {
        const url = `/jobseeker/addWorkExperience?userId=${userId}`;
        return axiosClient.post(url, workExpRequest);
    },

    updateWorkExperience: (userId, workExpRequest) => {
        const url = `/jobseeker/updateWorkExperience?userId=${userId}`;
        return axiosClient.post(url, workExpRequest);
    },

    addSkill: (skillRequest) => {
        const url = `/jobseeker/addSkill`;
        return axiosClient.post(url, skillRequest);
    },

    updateSkill: (skillRequest) => {
        const url = `/jobseeker/updateSkill`;
        return axiosClient.post(url, skillRequest);
    },

    searchJobSeekers: (keyword, jobCategoryId) => {
        const url = `/jobseeker/search-jobseekers?jobCategoryId=${jobCategoryId}${keyword ? `&keyword=${keyword}` : ''}`;
        return axiosClient.get(url);
    },
};

export default jobSeekerApi;
