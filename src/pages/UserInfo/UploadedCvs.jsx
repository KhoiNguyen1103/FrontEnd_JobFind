import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteCV } from "../../redux/slices/JSKerProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const UploadedCVs = () => {
  const dispatch = useDispatch();
  const cvsRedux = useSelector((state) => state.jobSeekerProfile.cvs);

  const handleDeleteCV = async (cvId) => {
    const result = await Swal.fire({
      title: "Xóa CV?",
      text: "Bạn có chắc chắn muốn xóa CV này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      dispatch(deleteCV(cvId));
      Swal.fire("Đã xóa!", "CV đã được xóa thành công.", "success");
    }
  };


  return (
    <div className="flex flex-col items-center gap-4 bg-white mt-2 min-h-[72px] justify-between">
      {cvsRedux.length === 0 ? (
        <p className="self-start text-[#111811] text-sm font-medium leading-normal">
          không có cv
        </p>
      ) : (
        <>
          {/* Thông tin CV */}
          {cvsRedux
            .filter((cv) => !cv.deleted)
            .map((cv, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 w-full"
              >
                <div className="flex items-center">
                  <div className="text-[#111811] flex items-center justify-center rounded-lg bg-[#f0f4f0] shrink-0 size-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center ml-2">
                    <p className="text-[#111811] text-base font-medium leading-normal line-clamp-1">
                      {cv.resumeName}
                    </p>
                    {/* <p className="text-[#638863] text-sm font-normal leading-normal line-clamp-2">{`Marketing · ${cv.date}`}</p> */}
                  </div>
                </div>
                {/* Nút hành động: Upload + Download */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Nút Download */}
                  <a
                    href={`${cv.resumePath}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-green-600 text-[#111811] text-sm font-medium leading-normal w-fit"
                  >
                    <FontAwesomeIcon icon={faDownload} className="text-white" />
                  </a>

                  {/* Nút Xóa */}
                  <button
                    className="flex min-w-[50px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-red-500 text-[#111811] text-sm font-medium leading-normal w-fit"
                    onClick={() => handleDeleteCV(cv.resumeId)}
                  >
                    <span className="truncate">
                      <FontAwesomeIcon icon={faTrash} className="text-white" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default UploadedCVs;
