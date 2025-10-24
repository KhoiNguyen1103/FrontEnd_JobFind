import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faAngleDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import filtersData from '../../data/filters';

const JobFilters = ({ filters, setFilters }) => {
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const locationRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleLocationChange = (location) => {
        if (location === "Tất cả") {
            setFilters({ ...filters, location: [] });
        } else {
            const newLocations = filters.location.includes(location)
                ? filters.location.filter((loc) => loc !== location)
                : [...filters.location, location];
            setFilters({ ...filters, location: newLocations });
        }
    };

    const clearFilters = () => {
        setFilters({
            fromDate: "",
            toDate: "",
            location: [],
            isActive: "",
            jobType: "",
        });
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setIsLocationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-gradient-to-r from-white to-gray-50 shadow-md rounded-lg p-4 mb-8">
            <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faFilter} className="text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Bộ Lọc</h2>
            </div>
            <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="fromDate" className="text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                        <input
                            type="date"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleChange}
                            className="border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="toDate" className="text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                        <input
                            type="date"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleChange}
                            className="border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                        <div className="relative" ref={locationRef}>
                            <div
                                onClick={() => setIsLocationOpen(!isLocationOpen)}
                                className="flex items-center justify-between border p-3 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faLocationDot} className="text-green-600" />
                                    <span className="ml-2 text-gray-600">
                                        {filters.location.length === 0
                                            ? "Địa điểm"
                                            : filters.location.length === 1
                                                ? filters.location[0]
                                                : `${filters.location[0]} (+${filters.location.length - 1})`}
                                    </span>
                                </div>
                                <FontAwesomeIcon icon={faAngleDown} className="text-gray-600" />
                            </div>
                            {isLocationOpen && (
                                <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-10 p-3 max-h-60 overflow-y-auto transition-all duration-200">
                                    {filtersData.find(f => f.key === "Địa điểm")?.list.map((loc, index) => (
                                        <label key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                                            <input
                                                type="checkbox"
                                                checked={loc === "Tất cả" ? filters.location.length === 0 : filters.location.includes(loc)}
                                                onChange={() => handleLocationChange(loc)}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
                                            />
                                            <span className="text-gray-700">{loc}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            name="isActive"
                            value={filters.isActive}
                            onChange={handleChange}
                            className="border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="true">Đã đăng</option>
                            <option value="false">Ẩn</option>
                            <option value="pending">Chờ duyệt</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="jobType" className="text-sm font-medium text-gray-700 mb-1">Loại công việc</label>
                        <select
                            name="jobType"
                            value={filters.jobType}
                            onChange={handleChange}
                            className="border p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        >
                            <option value="">Tất cả loại công việc</option>
                            {filtersData
                                .find(f => f.key === "Hình thức làm việc")
                                ?.list.filter(item => item.name !== "Tất cả")
                                .map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={clearFilters}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transform hover:scale-105 transition"
                    >
                        Xóa Bộ Lọc
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobFilters;