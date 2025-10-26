import axiosClient from './axiosClient';

const awsS3Api = {
    getPresignedUrl: (fileRequest) => {
        const url = `/aws/s3/presigned-url?fileName=${fileRequest.fileName}&contentType=${fileRequest.contentType}`;
        return axiosClient.get(url);  
    },
};

export default awsS3Api;