import React, { useEffect, useState } from 'react';
import companyApi from '../../api/companyApi';
import userApi from '../../api/userApi';
import { FiCamera, FiX } from 'react-icons/fi';
import industryApi from '../../api/industryApi';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const RecruiterCompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [newAvatar, setNewAvatar] = useState(null);
  const [industryList, setIndustryList] = useState([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);

  const openEditModal = () => {
    setEditData(company);
    setNewAvatar(null);
    setSelectedIndustryId(company.industry[0]?.industryId || null);
    const fetchIndustries = async () => {
      try {
        const resI = await industryApi.getAll();
        setIndustryList(resI);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách ngành nghề:', error);
      }
    };

    fetchIndustries();
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      console.warn("Không tìm thấy user trong localStorage");
      setLoading(false);
      return;
    }

    const userObject = JSON.parse(user);
    const id = userObject?.id;

    const avatarChanged = newAvatar && newAvatar instanceof File;

    const changedFields = Object.entries(editData).reduce((acc, [key, value]) => {
      if (company[key] !== value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const hasChanges = Object.keys(changedFields).length > 0 || avatarChanged || selectedIndustryId !== company.industry[0]?.industryId;

    if (!hasChanges) {
      setIsModalOpen(false);
      return;
    }

    const formData = new FormData();

    ['companyName', 'phoneNumber', 'website', 'description'].forEach((field) => {
      formData.append(field, editData[field] ?? company[field] ?? '');
    });

    formData.append('userId', id);

    if (avatarChanged) {
      formData.append('logoPath', newAvatar);
    }

    if (selectedIndustryId) {
      formData.append('industryIds', selectedIndustryId);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      await userApi.updateProfile(formData);
      toast.success("Cập nhật thành công!")
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi cập nhật');
    }
  };

  useEffect(() => {
    const fetchCompany = async () => {
      const user = localStorage.getItem('user');
      if (!user) {
        console.warn('Không tìm thấy user trong localStorage');
        setLoading(false);
        return;
      }

      const userObject = JSON.parse(user);
      const companyId = userObject?.userId;

      try {
        const res = await companyApi.getById(companyId);
        setCompany(res);
        setSelectedIndustryId(res.industry[0].industryId)
      } catch (error) {
        console.error('Lỗi khi lấy thông tin công ty:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!company)
    return (
      <div className="text-center mt-10 text-red-500">
        Không tìm thấy công ty.
      </div>
    );

  return (
    <div className="rounded-md p-6 bg-white max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 flex flex-col items-center text-center md:text-left md:items-start">
          <img
            src={company.logoPath}
            alt={`${company.companyName} logo`}
            className="w-24 h-24 object-contain rounded-full border-2 border-gray-200 mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">{company.companyName}</h1>
          <p className="text-gray-600 mt-2 text-base">{company.description}</p>
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Thông tin công ty</h2>
            <p className="text-gray-600 text-base mb-1">
              <span className="font-medium">Website: </span>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </p>
            <p className="text-gray-600 text-base mb-1">
              <span className="font-medium">Email: </span>
              {company.email}
            </p>
            <p className="text-gray-600 text-base">
              <span className="font-medium">Phone: </span>
              {company.phoneNumber}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Ngành nghề</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {company.industry.map((ind, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {ind.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={openEditModal}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Cập nhật thông tin
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-3xl relative overflow-auto max-h-[90vh]">
            {/* Avatar + camera icon */}
            <div className="flex justify-center mb-4 relative">
              <img
                src={newAvatar ? URL.createObjectURL(newAvatar) : company.logoPath}
                alt="Logo công ty"
                className="w-24 h-24 object-contain rounded-full border-2 border-gray-300"
              />
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-[calc(45%-12px)] bg-gray-100 p-2 rounded-full shadow cursor-pointer"
              >
                <FiCamera className="text-gray-600" />
              </label>
              {newAvatar && (
                <button
                  onClick={() => setNewAvatar(null)}
                  className="absolute top-0 right-[calc(50%-12px)] bg-white border rounded-full p-1 shadow text-gray-500 hover:text-red-600"
                >
                  <FiX />
                </button>
              )}
              <input
                type="file"
                id="avatar"
                className="hidden"
                onChange={(e) => setNewAvatar(e.target.files[0])}
              />
            </div>

            {/* Các field */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty</label>
              <input
                type="text"
                value={editData.companyName || ''}
                onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-2"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={company.email || ''}
                disabled
                className="w-full border rounded px-3 py-2 mb-2 bg-gray-100"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={editData.phoneNumber || ''}
                onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-2"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngành nghề</label>
              <select
                value={selectedIndustryId || ''}
                onChange={(e) => setSelectedIndustryId(Number(e.target.value) || null)}
                className="w-full border rounded px-3 py-2 mb-2"
              >
                <option value="" disabled>Chọn ngành nghề</option>
                {industryList.map((industry) => (
                  <option key={industry.industryId} value={industry.industryId}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="text"
                value={editData.website || ''}
                onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-2"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-2"
                rows="4"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default RecruiterCompanyProfile;
