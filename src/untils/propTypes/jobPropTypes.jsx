import PropTypes from "prop-types";

const jobPropTypes = PropTypes.shape({
  jobId: PropTypes.number,
  company: PropTypes.shape({
    companyId: PropTypes.number,
    companyName: PropTypes.string,
    logoPath: PropTypes.string,
    industry: PropTypes.arrayOf(PropTypes.string),
    website: PropTypes.string,
    description: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
  title: PropTypes.string,
  description: PropTypes.string,
  requirements: PropTypes.string,
  benefits: PropTypes.string,
  salaryMin: PropTypes.number,
  salaryMax: PropTypes.number,
  jobType: PropTypes.string,
  location: PropTypes.string,
  postedAt: PropTypes.string,
  deadline: PropTypes.string,
  isActive: PropTypes.bool,
  skills: PropTypes.arrayOf(PropTypes.string), // nếu là array of string
  categories: PropTypes.arrayOf(PropTypes.object), // hoặc có thể là object nếu backend trả vậy
});

export default jobPropTypes;
