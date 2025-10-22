// https://www.topcv.vn/?ref=you
// import components
import BestJob from "./BestJob";
import BestIndustry from "./BestIndustry";

const Home = () => {
  return (
    <div className="">
      {/* Start: BestJob recommend section */}
      <BestJob />
      {/* End: BestJob recommend section */}

      {/* Start: BestCategory  */}
      <BestIndustry />
      {/* End: BestCategory  */}
    </div>
  );
};

export default Home;
