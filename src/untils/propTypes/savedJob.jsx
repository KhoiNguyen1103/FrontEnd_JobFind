import PropTypes from "prop-types";

const savedJobPropTypes = PropTypes.shape({
  saved_job_id: PropTypes.number.isRequired,
  saved_at: PropTypes.string.isRequired, // Dữ liệu ngày dạng "YYYY-MM-DD"
  job_id: PropTypes.number.isRequired,
  user_id: PropTypes.number.isRequired,
});

export default savedJobPropTypes;
