import JobItemFiltered from "../../components/ui/JobItemFiltered";

// test UI
import data from "../../data/jobs";

const JobApplied = () => {
  return (
    <div className="container mx-auto py-6">
      <p className="text-2xl font-semibold pb-4" style={{ color: "#333" }}>
        Công việc đã ứng tuyển
      </p>
      {data.map((item, index) => (
        <JobItemFiltered
          key={index}
          job={item}
          iconHeart={false}
          isApply={true}
        />
      ))}
    </div>
  );
};

export default JobApplied;
