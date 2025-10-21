// ProfileHeader Component
import PropTypes from "prop-types";

const ProfileHeader = ({ profileJSK }) => {
  return (
    <div className="flex gap-4 bg-white px-4 py-3 justify-between">
      <div className="flex items-start gap-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px]"
          style={{
            backgroundImage: `url('https://cdn.usegalileo.ai/sdxl10/8eb31c25-4d21-4bd0-941f-cd480a3318e8.png')`,
          }}
        ></div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-[#111811] text-base font-medium leading-normal">
            {profileJSK?.firstName} {profileJSK?.lastName}
          </p>
          <p className="text-[#638863] text-sm font-normal leading-normal">
            Marketing
          </p>
          <p className="text-[#638863] text-sm font-normal leading-normal">
            Acme Inc
          </p>
        </div>
      </div>
      <div className="shrink-0">
        <div className="text-[#111811] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
ProfileHeader.propTypes = {
  profileJSK: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

export default ProfileHeader;
