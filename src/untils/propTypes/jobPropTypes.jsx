import PropTypes from "prop-types";

const jobPropTypes = PropTypes.shape({
  jobId: PropTypes.number.isRequired,
  company: PropTypes.shape({
    companyId: PropTypes.number.isRequired,
    companyName: PropTypes.string.isRequired,
    logoPath: PropTypes.string.isRequired,
    industry: PropTypes.arrayOf(PropTypes.string),
    website: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  requirements: PropTypes.string.isRequired,
  benefits: PropTypes.string.isRequired,
  salaryMin: PropTypes.number.isRequired,
  salaryMax: PropTypes.number.isRequired,
  jobType: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  postedAt: PropTypes.string.isRequired,
  deadline: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string), // nếu là array of string
  categories: PropTypes.arrayOf(PropTypes.string), // hoặc có thể là object nếu backend trả vậy
});

export default jobPropTypes;
