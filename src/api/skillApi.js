import axiosClient from './axiosClient';

const skillApi = {
    getAll: () => {
        const url = '/skill/all';
        return axiosClient.get(url);
    },

    add: (skillName) => {
        const url = '/skill/add';
        return axiosClient.post(url, skillName)
    },

    delete: (skillId) => {
        const url = `/skill/delete/${skillId}`;
        return axiosClient.delete(url);
    },

    update: (skillId, skillName) => {
        const url = '/skill/update';
        return axiosClient.put(url, null, {
            params: {
                skillId,
                skillName,
            },
        });
    }
};

export default skillApi;
