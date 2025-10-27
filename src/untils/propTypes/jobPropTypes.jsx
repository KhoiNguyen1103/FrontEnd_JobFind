import PropTypes from "prop-types";

const jobPropTypes = PropTypes.shape({
  jobId: PropTypes.number.isRequired,
  company: PropTypes.shape({
    companyId: PropTypes.number.isRequired,
    companyName: PropTypes.string.isRequired,
    logoPath: PropTypes.string.isRequired,
    industry: PropTypes.arrayOf(PropTypes.object),
    website: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
  }),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  requirements: PropTypes.string,
  benefits: PropTypes.string,
  salaryMin: PropTypes.number,
  salaryMax: PropTypes.number,
  jobType: PropTypes.string,
  location: PropTypes.string,
  postedAt: PropTypes.string,
  deadline: PropTypes.string,
  isActive: PropTypes.bool,
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
});

export default jobPropTypes;
