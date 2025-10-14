import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home/index";
import CompanyDetail from "./pages/CompanyDetail/index";
import CompanyList from "./pages/CompanyList/index";
import JobDetail from "./pages/JobDetail/index";
import Login from "./pages/Login/index";
import Signup from "./pages/Signup/index";
import SearchResult from "./pages/SearchResult/index";
import TemplateCV from "./pages/TemplateCV/index";

import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import SearchBar from "./layouts/SearchBar";

function App() {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {/* Header */}
      {!hideHeaderFooter && <Header />}

      {/* Search bar */}
      {!hideHeaderFooter && <SearchBar />}

      {/* Content */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/company-detail/:id" element={<CompanyDetail />}></Route>
        <Route path="/company-list" element={<CompanyList />}></Route>
        <Route path="/job-detail/:id" element={<JobDetail />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/search-result" element={<SearchResult />}></Route>
        <Route path="/template-cv" element={<TemplateCV />}></Route>

        {/* 404 thì quay về Home */}
        <Route path="*" element={<Navigate to="/" replace />}></Route>
      </Routes>

      {/* Footer */}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
