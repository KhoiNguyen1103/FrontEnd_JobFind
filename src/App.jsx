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
import RoleBasedRedirect from "./components/RoleBaseRedirect";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./redux/slices/categorySlice";
import { fetchSavedJobs } from "./redux/slices/savedJobSlice";
import { fetchJobSeekerProfileByUserId } from "./redux/slices/JSKerProfileSlice";
import {
  fetchJobsPropposeByJSKId,
  fetchAllJobs,
} from "./redux/slices/jobSlice";
import { fetchApplicationByJSK } from "./redux/slices/applySlice";
import ChatBox from "./components/ui/ChatBox";
import { setJobsRaw } from "./redux/slices/filterJobSlice";

function App() {
  const dispatch = useDispatch();
  // Lấy data từ redux
  const chatBoxes = useSelector((state) => state.chatBox.chatBoxes);
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
        // Load job seeker profile
        dispatch(fetchJobSeekerProfileByUserId(user.id));
        // Load application
        dispatch(fetchApplicationByJSK(user.id));
        // Load jobs proposed
        dispatch(fetchJobsPropposeByJSKId(user.id)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            console.log("load filterjob propose");
            dispatch(setJobsRaw({ jobs: res.payload, context: "recommend" })); // Gửi sang filterJobsSlice
          }
        });
      }
    } else {
      // Nếu chưa đăng nhập thì load tất cả jobs lên
      dispatch(fetchAllJobs()).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          dispatch(setJobsRaw({ jobs: res.payload, context: "recommend" })); // Gửi sang filterJobsSlice
        }
      });
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
      <div id="chatbox-root" />
      {chatBoxes.map((chat, index) => (
        <ChatBox
          key={chat.profileId}
          profileId={chat.profileId}
          userId={chat.userId}
          displayName={chat.displayName}
          conversationId={chat.conversationId}
          isMinimized={chat.isMinimized}
          index={index}
        />
      ))}
    </div>
  );
}

export default App;
