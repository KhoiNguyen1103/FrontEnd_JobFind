import RecruiterApplication from "../pagesRecruiter/RecruiterApplication/RecruiterApplication";
import RecruiterCompanyProfile from "../pagesRecruiter/RecruiterCompanyProfile/RecruiterCompanyProfile";
import RecruiterJobCreate from "../pagesRecruiter/RecruiterJobCreate/RecruiterJobCreate";
import RecruiterJobEdit from "../pagesRecruiter/RecruiterJobEdit/RecruiterJobEdit";
import RecruiterJobList from "../pagesRecruiter/RecruiterJobList/RecruiterJobList";
import RecruiterHome from "../pagesRecruiter/RecruiterHome/RecruiterHome";
import RecruiterProfileSaved from "../pagesRecruiter/RecruiterProfileSaved/RecruiterProfileSaved";
import JobSeekerProfile from "../pagesRecruiter/JobSeekerProfile/JobSeekerProfile";
import SearchResultCV from "../pagesRecruiter/SearchResultCV/SearchResultCV";
import ApplicationsPage from "../pagesRecruiter/Application/ApplicationPage";
import CardManagement from "../pagesRecruiter/RecruiterCardManagement/CardManagement";
import RecruiterSubcribe from "../pagesRecruiter/RecruiterSubcribe/RecruiterSubcribe";

export const recruiterRoutes = [
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
  {
    path: "/recruiter/profile-saved",
    component: <RecruiterProfileSaved />,
  },
  {
    path: "/job-seeker-profile/:profileId",
    component: <JobSeekerProfile />,
  },
  {
    path: "/recruiter/applications/:jobId",
    component: <ApplicationsPage />,
  },
  {
    path: "/search-cv",
    component: <SearchResultCV />,
  },
  {
    path: "recruiter/card",
    component: <CardManagement />,
  },
  {
    path: "recruiter/subscribe",
    component: <RecruiterSubcribe />,
  },
];
