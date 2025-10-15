import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import itemsUserMenu from "../../data/itemsUserMenu";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const DropDownUserMenu = ({ user }) => {
  const dispatch = useDispatch();
  const { username, id, avatar } = user;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="font-norma">
      {/* header */}
      <div className="flex items-center pb-4">
        <div className="pe-4 p-1">
          <img src={avatar} alt="logo" className=" w-12 h-12 rounded-full" />
        </div>
        <div>
          <p className="font-bold text-lg">{username}</p>
          <p>
            {" "}
            <span className="text-slate-500">Mã ứng viên:</span> #{id}
          </p>
        </div>
      </div>
      {/* body */}
      <div>
        {itemsUserMenu.map((item) => (
          <Link
            key={item.title}
            className="flex items-center py-4 px-4 rounded-lg mb-4 bg-slate-100"
            to={item.path}
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="pe-4 text-lg text-primary"
            />
            <p>{item.title}</p>
          </Link>
        ))}

        {/* Đăgn xuất */}
        <div
          className="flex items-center py-4 px-4 rounded-lg mb-4 bg-slate-100"
          onClick={handleLogout}
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="pe-4 text-lg text-primary"
          />
          <p className="text-red-500">Đăng xuất</p>
        </div>
      </div>
    </div>
  );
};
DropDownUserMenu.propTypes = {
  user: PropTypes.object.isRequired,
};

export default DropDownUserMenu;
