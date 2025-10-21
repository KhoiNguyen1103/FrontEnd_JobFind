import Home from "../pages/Home";
import CompanyDetail from "../pages/CompanyDetail";
import CompanyList from "../pages/CompanyList";
import JobDetail from "../pages/JobDetail";
import SearchResult from "../pages/SearchResult";
import TemplateCV from "../pages/TemplateCV";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import RecruiterOverview from "../pagesRecruiter/RecruiterOverview";

const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/company-detail/:id", element: <CompanyDetail /> },
  { path: "/company-list", element: <CompanyList /> },
  { path: "/job-detail/:id", element: <JobDetail /> },
  { path: "/search", element: <SearchResult /> },
  { path: "/template-cv", element: <TemplateCV /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/overview", element: <RecruiterOverview /> },
];

export default publicRoutes;
