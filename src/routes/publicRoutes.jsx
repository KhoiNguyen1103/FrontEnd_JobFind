import Home from "../pages/Home";
import CompanyDetail from "../pages/CompanyDetail/CompanyDetail";
import JobDetail from "../pages/JobDetail";
import SearchResult from "../pages/SearchResult";
import TemplateCV from "../pages/TemplateCV";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import RecruiterOverview from "../pagesRecruiter/RecruiterOverview";
import Company from "../pages/Company/Company";

const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/company/:id", element: <CompanyDetail /> },
  { path: "/job-detail/:id", element: <JobDetail /> },
  { path: "/search", element: <SearchResult /> },
  { path: "/template-cv", element: <TemplateCV /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/overview", element: <RecruiterOverview /> },
  { path: "/company", element: <Company /> },
];

export default publicRoutes;
