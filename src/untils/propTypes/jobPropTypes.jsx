import PropTypes from "prop-types";

const jobPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  company_id: PropTypes.number.isRequired,
  company: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  salary_min: PropTypes.number.isRequired,
  salary_max: PropTypes.number.isRequired,
  experience: PropTypes.number.isRequired,
  position_id: PropTypes.number.isRequired,
  position: PropTypes.string.isRequired,
  workType: PropTypes.number.isRequired,
  category_id: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  deadline: PropTypes.string.isRequired,
});

export default jobPropTypes;
