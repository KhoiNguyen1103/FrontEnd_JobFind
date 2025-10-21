import Home from "../pages/Home";
import CompanyDetail from "../pages/CompanyDetail";
import CompanyList from "../pages/CompanyList";
import JobDetail from "../pages/JobDetail";
import SearchResult from "../pages/SearchResult";
import TemplateCV from "../pages/TemplateCV";
import LoginAndRegister from "../pages/LoginAndRegister";

const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/company-detail/:id", element: <CompanyDetail /> },
  { path: "/company-list", element: <CompanyList /> },
  { path: "/job-detail/:id", element: <JobDetail /> },
  { path: "/search", element: <SearchResult /> },
  { path: "/template-cv", element: <TemplateCV /> },
  { path: "/login", element: <LoginAndRegister /> },
  { path: "/register", element: <LoginAndRegister /> },
];

export default publicRoutes;
