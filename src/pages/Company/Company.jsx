import { useDispatch, useSelector } from "react-redux";
import CompanyItem from "../../components/ui/CompanyItem";
import { fetchCompanies } from "../../redux/slices/companySlide";
import NotFoundItem from "../../components/ui/NotFoundItem";
import { useEffect } from "react";
import { isEmpty } from "lodash";
import Spinner from "../../components/ui/Spinner";

const Company = () => {
  const dispatch = useDispatch();

  const { companies, loading } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Danh sách công ty
        </h1>
      </div>

      {loading && <Spinner size="lg" />}

      {!loading &&
        (isEmpty(companies) ? (
          <NotFoundItem title="Hiện chưa có công ty nào" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {companies.map((item, index) => (
              <CompanyItem key={index} item={item} />
            ))}
          </div>
        ))}
    </div>
  );
};

export default Company;
