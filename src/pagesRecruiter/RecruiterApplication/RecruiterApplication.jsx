import React, { useState, useEffect } from 'react';
import jobApi from '../../api/jobApi';
import skillApi from '../../api/skillApi';
import jobCategoryApi from '../../api/jobCategoryApi';
import JobFilters from './JobFilters';
import JobList from './JobList';
import JobModal from './JobModal';
import { useNavigate } from 'react-router-dom';

const RecruiterApplication = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    location: [],
    isActive: "",
    jobType: "",
  });
  const [jobData, setJobData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const user = localStorage.getItem("user");
  const userObject = user ? JSON.parse(user) : null;
  const companyId = userObject?.userId;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobApi.getByCompanyId(companyId, companyId);
        setJobData(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách jobs:", error);
      }
    };

    const fetchSkills = async () => {
      try {
        const res = await skillApi.getAll();
        setSkills(res);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await jobCategoryApi.getAll();
        setCategories(res);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (companyId) fetchJobs();
    fetchSkills();
    fetchCategories();
  }, [companyId]);

  const openCreateModal = () => {
    console.log('Opening create modal');
    setModalMode('create');
    setSelectedJob(null);
  };

  const openViewModal = (job) => {
    console.log('Opening view modal for job:', job.jobId);
    setModalMode('view');
    setSelectedJob(job);
  };

  const openEditModal = (job) => {
    console.log('Opening edit modal for job:', job.jobId);
    setModalMode('edit');
    setSelectedJob(job);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setModalMode(null);
    setSelectedJob(null);
  };

  const openApplicationsPage = (job) => {
    navigate(`/recruiter/applications/${job.jobId}`);
  };

  const refreshJobs = async () => {
    try {
      const data = await jobApi.getByCompanyId(companyId, companyId);
      setJobData(data);
    } catch (error) {
      console.error("Lỗi khi làm mới jobs:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-blue-500 text-transparent bg-clip-text">
          Quản Lý Tin Tuyển Dụng
        </h1>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transform hover:scale-105 transition flex items-center"
        >
          Thêm Công Việc
        </button>
      </div>
      <JobFilters filters={filters} setFilters={setFilters} />
      <JobList jobs={jobData} filters={filters} onJobClick={openViewModal} />
      {(modalMode === 'create' || modalMode === 'view' || modalMode === 'edit') && (
        <JobModal
          mode={modalMode}
          job={selectedJob}
          skills={skills}
          categories={categories}
          companyId={companyId}
          onClose={closeModal}
          setMode={setModalMode}
          onEdit={() => openEditModal(selectedJob)}
          onViewApplications={() => openApplicationsPage(selectedJob)}
          onRefreshJobs={refreshJobs}
        />
      )}
    </div>
  );
};

export default RecruiterApplication;