import BestJob from "./BestJob";
import BestCategory from "./BestCategory";

const Home = () => {
  return (
    <div className="">
      {/* Start: BestJob recommend section */}
      <BestJob />
      {/* End: BestJob recommend section */}

      {/* Start: BestCategory  */}
      {/* <BestIndustry />
       */}
      <BestCategory />
      {/* End: BestCategory  */}
    </div>
  );
};

export default Home;
