import PropTypes from "prop-types";

const jobPropTypes = PropTypes.shape({
  jobId: PropTypes.number,
  company: PropTypes.shape({
    companyId: PropTypes.number,
    companyName: PropTypes.string,
    logoPath: PropTypes.string,
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
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,  
    })
  ),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
    name: PropTypes.string.isRequired,  
  })),
});

export default jobPropTypes;
