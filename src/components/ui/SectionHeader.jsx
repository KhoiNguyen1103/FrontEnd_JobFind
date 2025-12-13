import clsx from "clsx";

const SectionHeader = ({ text, className }) => {
  return (
    <div className={clsx(`flex justify-between items-center`, className)}>
      <div className="flex items-center">
        <div className="bg-primary py-4 px-1 me-2"></div>
        <p className="font-bold text-lg">{text}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
