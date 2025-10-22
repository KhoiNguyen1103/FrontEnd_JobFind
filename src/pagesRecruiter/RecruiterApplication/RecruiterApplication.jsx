const jobData = [
  {
    jobId: 1,
    company: { companyName: "Tech Corp" },
    title: "Frontend Developer",
    description: "Build modern UI with React.",
    requirements: "2+ years with React.",
    benefits: "Health insurance, remote work",
    salaryMin: 1000,
    salaryMax: 2000,
    jobType: "Full-time",
    location: "Ho Chi Minh",
    postedAt: new Date("2025-04-10T10:00:00"),
    deadline: new Date("2025-05-01"),
    isActive: true,
    skills: [{ name: "React" }, { name: "JavaScript" }],
    categories: [{ name: "Software" }]
  },
  {
    jobId: 2,
    company: { companyName: "Green AI" },
    title: "Data Scientist",
    description: "Analyze large datasets.",
    requirements: "Experience in ML and Python.",
    benefits: "Stock options",
    salaryMin: 1500,
    salaryMax: 2500,
    jobType: "Part-time",
    location: "Hanoi",
    postedAt: new Date("2025-03-25T09:00:00"),
    deadline: new Date("2025-04-20"),
    isActive: false,
    skills: [{ name: "Python" }, { name: "Machine Learning" }],
    categories: [{ name: "AI" }]
  }
];

import React, { useState } from 'react';

const RecruiterApplication = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    location: "",
    isActive: "",
    jobType: ""
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredJobs = jobData.filter((job) => {
    const postedDate = new Date(job.postedAt);
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;

    return (
      (!filters.location || job.location.includes(filters.location)) &&
      (!filters.jobType || job.jobType === filters.jobType) &&
      (filters.isActive === "" || job.isActive === (filters.isActive === "true")) &&
      (!from || postedDate >= from) &&
      (!to || postedDate <= to)
    );
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recruiter Applications</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="From Date"
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="To Date"
        />
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Location"
        />
        <select
          name="isActive"
          value={filters.isActive}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select
          name="jobType"
          value={filters.jobType}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.jobId} className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-700">{job.company.companyName}</p>
            <p className="text-gray-500">{job.location} | {job.jobType} | {job.isActive ? "Active" : "Inactive"}</p>
            <p className="text-gray-600 mt-2">{job.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              Posted: {new Date(job.postedAt).toLocaleDateString()} | Salary: ${job.salaryMin} - ${job.salaryMax}
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplication;