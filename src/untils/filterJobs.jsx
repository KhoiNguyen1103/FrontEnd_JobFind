export const filterJobs = (jobs, filter) => {
  let temp = [...jobs];
  // LOCATION
  if (filter.LOCATION && filter.LOCATION !== "Tất cả địa điểm") {
    temp = temp.filter((job) => job.location === filter.LOCATION);
  }

  // WORK TYPE
  if (filter.WORK_TYPE && filter.WORK_TYPE !== "Tất cả") {
    console.log("filter.WORKTYPE", filter.WORK_TYPE);
    temp = temp.filter(
      (job) =>
        job.jobType ===
        (filter.WORK_TYPE === "Toàn thời gian"
          ? "FULLTIME"
          : filter.WORK_TYPE === "Bán thời gian"
          ? "PARTTIME"
          : "")
    );
    console.log("temp", temp);
  }

  // DATE
  if (filter.DATE && filter.DATE !== "Tất cả ngày đăng") {
    if (filter.DATE === "Mới nhất") {
      temp.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    } else if (filter.DATE === "Cũ nhất") {
      temp.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
    } else if (filter.DATE === "Hạn nộp gần nhất") {
      temp.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (filter.DATE === "Hạn nộp xa nhất") {
      temp.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    }
  }

  // FILTER BY SALARY
  if (filter.SALARY && filter.SALARY !== "Tất cả") {
    switch (filter.SALARY) {
      case "Dưới 5 triệu":
        temp = temp.filter((job) => job.salaryMin < 5000000);
        break;
      case "5 triệu - 10 triệu":
        temp = temp.filter(
          (job) => job.salaryMin >= 5000000 && job.salaryMin <= 10000000
        );
        break;
      case "10 triệu - 15 triệu":
        temp = temp.filter(
          (job) => job.salaryMin >= 10000000 && job.salaryMin <= 15000000
        );
        break;
      case "15 triệu - 20 triệu":
        temp = temp.filter(
          (job) => job.salaryMin >= 15000000 && job.salaryMin <= 20000000
        );
        break;
      case "Trên 20 triệu":
        temp = temp.filter((job) => job.salaryMin > 20000000);
        break;
      default:
        break;
    }
  }

  // FILTER BY EXPERIENCE
  if (filter.EXPERIENCE && filter.EXPERIENCE !== "Tất cả") {
    temp = temp.filter((job) => {
      const [minExp, maxExp] = parseExperienceRange(job.yearsOfExperience);
      console.log("minExp - maxExp", minExp, maxExp);

      switch (filter.EXPERIENCE) {
        case "Dưới 1 năm":
          return minExp < 1;
        case "1 năm":
          return minExp == 1 || maxExp == 1;
        case "2 năm":
          return minExp == 2 || maxExp == 2;
        case "3 năm":
          return minExp == 3 || maxExp == 3;
        case "4 năm":
          return minExp == 4 || maxExp == 4;
        case "5 năm":
          return minExp == 5 || maxExp == 5;
        case "Trên 5 năm":
          return minExp >= 5;
        default:
          return true;
      }
    });
  }

  return temp;
};

// Helper function to parse experience range string like "1-4"
function parseExperienceRange(expString) {
  if (!expString) return [0, 0];

  if (expString.includes("-")) {
    const [min, max] = expString.split("-").map(Number);
    return [min, max];
  }

  if (expString.includes("+")) {
    const min = parseInt(expString);
    return [min, 99]; // Trên 3 năm -> 3+
  }

  return [0, 0];
}
