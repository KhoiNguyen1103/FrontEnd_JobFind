import RecruiterApplication from "../pagesRecruiter/RecruiterApplication/RecruiterApplication";
import RecruiterCompanyProfile from "../pagesRecruiter/RecruiterCompanyProfile/RecruiterCompanyProfile";
import RecruiterJobCreate from "../pagesRecruiter/RecruiterJobCreate/RecruiterJobCreate";
import RecruiterJobEdit from "../pagesRecruiter/RecruiterJobEdit/RecruiterJobEdit";
import RecruiterJobList from "../pagesRecruiter/RecruiterJobList/RecruiterJobList";
import RecruiterLogin from "../pagesRecruiter/RecruiterLogin/RecruiterLogin";
import RecruiterRegister from "../pagesRecruiter/RecruiterRegister/RecruiterRegister";
import RecruiterHome from "../pagesRecruiter/RecruiterHome/RecruiterHome";

export const recruiterRoutes = [
  {
    path: "/recruiter/login",
    component: <RecruiterLogin />,
  },
  {
    path: "/recruiter/register",
    component: <RecruiterRegister />,
  },
  {
    path: "/recruiter/home",
    component: <RecruiterHome />,
  },
  {
    path: "/recruiter/job-list",
    component: <RecruiterJobList />,
  },
  {
    path: "/recruiter/job-create",
    component: <RecruiterJobCreate />,
  },
  {
    path: "/recruiter/job-edit",
    component: <RecruiterJobEdit />,
  },
  {
    path: "/recruiter/company-profile",
    component: <RecruiterCompanyProfile />,
  },
  {
    path: "/recruiter/application",
    component: <RecruiterApplication />,
  },
];
