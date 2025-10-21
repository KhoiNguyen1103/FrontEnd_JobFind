import React from 'react';
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <img src={logo} alt="logo" className="h-full" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/recruiter/login"
                            className="text-green-700 px-4 py-2 rounded-md border-green-600 border font-medium"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/recruiter/register"
                            className="text-white px-4 py-2 rounded-md bg-green-600 font-medium"
                        >
                            Đăng tin ngay
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;