import JobSaved from "../pages/JobSaved/JobSaved";
import UserInfo from "../pages/UserInfo";
import MyCV from "../pages/MyCV";
import JobApplied from "../pages/JobApplied/JobApplied";
import ChangePassword from "../pages/ChangePassword";

const privateRoutes = [
  { path: "/job-saved", element: <JobSaved /> },
  { path: "/profile", element: <UserInfo /> },
  { path: "/my-cv/:id", element: <MyCV /> },
  { path: "/job-applied", element: <JobApplied /> },
  { path: "/tai-khoan/mat-khau", element: <ChangePassword /> },
];

export default privateRoutes;
