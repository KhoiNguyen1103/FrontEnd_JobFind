import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// public routes
import publicRoutes from "./routes/publicRoutes";

// private routes: Những route phải đăng nhập mới vào đc
import jobSeekerRoutes from "./routes/jobSeekerRoutes";

// Nhà tuyển dụng
import RecruiterLogin from "./pagesRecruiter/RecruiterLogin/RecruiterLogin";
import RecruiterRegister from "./pagesRecruiter/RecruiterRegister/RecruiterRegister";
import { recruiterRoutes } from "./routes/recruiterRoutes";

// private routes
import PrivateRoute from "./components/PrivateRoute";

// layouts
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import SearchBar from "./layouts/SearchBar";
import { ToastContainer } from "react-toastify";
import RoleBasedRedirect from "./components/RoleBaseRedirect";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "./redux/slices/categorySlice";
import { fetchSavedJobs } from "./redux/slices/savedJobSlice";
import { fetchJobSeekerProfileByUserId } from "./redux/slices/JSKerProfileSlice";
function App() {
  const dispatch = useDispatch();
  // Lấy user từ redux
  const user = useSelector((state) => state.auth.user);

  // ====================== Load các dữ liệu cần thiết vào redux
  useEffect(() => {
    // Load jobCategory
    dispatch(fetchCategories());

    if (user) {
      // Load profile cho job seeker
      if (user.role === "JOBSEEKER") {
        // Load savedJobs
        dispatch(fetchSavedJobs(user.userId));
        // console.log("user.userId", user.userId);
        dispatch(fetchJobSeekerProfileByUserId(user.id));
      }
    }
  }, [dispatch, user]);

  const location = useLocation();
  const hideHeaderFooter = [
    "/login",
    "/signup",
    "/recruiter/login",
    "/recruiter/register",
    "/overview",
  ].includes(location.pathname);

  const hiddenFooter = [
    "/login",
    "/signup",
    "/profile",
    "/overview",
    "/recruiter/register",
    "/recruiter/login",
  ].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header và Search bar */}
      {!hideHeaderFooter && (
        <>
          <Header />
          <SearchBar />
        </>
      )}

      {/* Content */}
      <div
        className="flex-grow"
        // style={{ backgroundColor: "#e7eee7" }}
      >
        <Routes>
          {/* Role-based redirect route */}
          <Route path="/redirect" element={<RoleBasedRedirect />} />

          {/* Các route dùng chung cho mọi user */}
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Các routes dành cho job seeker */}
          {jobSeekerRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute allowedRoles={["ADMIN", "JOBSEEKER"]}>
                  {route.element}
                </PrivateRoute>
              }
            />
          ))}

          {/* Các route dành cho Nhà Tuyển Dụng */}
          <Route path="/recruiter/login" element={<RecruiterLogin />} />
          <Route path="/recruiter/register" element={<RecruiterRegister />} />
          {recruiterRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute allowedRoles={["ADMIN", "COMPANY"]}>
                  {route.component}
                </PrivateRoute>
              }
            />
          ))}

          {/* 404 thì quay về Home */}
          <Route path="*" element={<Navigate to="/" replace />}></Route>
        </Routes>
      </div>

      {/* Footer */}
      {!hiddenFooter && <Footer className="justify-end" />}
      <ToastContainer />
    </div>
  );
}

export default App;
