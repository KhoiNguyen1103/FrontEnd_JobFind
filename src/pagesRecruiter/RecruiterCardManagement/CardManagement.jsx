import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import companyApi from "../../api/companyApi";
import { useSelector } from "react-redux";
// import visaLogo from "../../assets/visa-logo.png";

const cardFields = [
    {
        label: "Số thẻ",
        name: "number",
        type: "text",
        placeholder: "4242 4242 4242 4242",
        required: true,
        errorMsg: "Vui lòng nhập số thẻ!",
        pattern: "\\d{16}",
        patternMsg: "Số thẻ phải có 16 chữ số!",
    },
    {
        label: "Loại thẻ",
        name: "type",
        type: "text",
        placeholder: "Visa",
        required: true,
        errorMsg: "Vui lòng nhập loại thẻ!",
    },
    {
        label: "Tháng hết hạn",
        name: "validToMonth",
        type: "text",
        placeholder: "12",
        required: true,
        errorMsg: "Vui lòng nhập tháng hết hạn!",
        pattern: "\\d{2}",
        patternMsg: "Tháng phải có 2 chữ số (01-12)!",
    },
    {
        label: "Năm hết hạn",
        name: "validToYear",
        type: "text",
        placeholder: "28",
        required: true,
        errorMsg: "Vui lòng nhập năm hết hạn!",
        pattern: "\\d{2}",
        patternMsg: "Năm phải có 2 chữ số (ví dụ: 28)!",
    },
    {
        label: "CCV",
        name: "ccv",
        type: "text",
        placeholder: "111",
        required: true,
        errorMsg: "Vui lòng nhập CCV!",
        pattern: "\\d{3}",
        patternMsg: "CCV phải có 3 chữ số!",
    },
    {
        label: "Mã bưu điện",
        name: "postalCode",
        type: "text",
        placeholder: "11111",
        required: true,
        errorMsg: "Vui lòng nhập mã bưu điện!",
        pattern: "\\d{5}",
        patternMsg: "Mã bưu điện phải có 5 chữ số!",
    },
];

const CardManagement = () => {
    const [formData, setFormData] = useState({
        number: "",
        type: "",
        validToMonth: "",
        validToYear: "",
        ccv: "",
        postalCode: "",
    });
    const [cardInfo, setCardInfo] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const userId = user?.id;

    useEffect(() => {
        const fetchCardInfo = async () => {
            try {
                const response = await companyApi.getCardInfo(userId);
                setCardInfo(response);
            } catch (err) {
                console.log(err);
                setCardInfo(null);
            }
        };
        if (userId) fetchCardInfo();
    }, [userId]);

    const handleChangeFormData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cardInfo) {
            setError("Bạn đã thêm một thẻ. Chỉ được phép thêm một thẻ!");
            return;
        }
        try {
            const cardRequest = { ...formData, userId };
            await companyApi.createCard(cardRequest);
            const response = await companyApi.getCardInfo(userId);
            setCardInfo(response);
            setSuccess("Thẻ đã được thêm thành công!");
            setError(null);
            setFormData({
                number: "",
                type: "",
                validToMonth: "",
                validToYear: "",
                ccv: "",
                postalCode: "",
            });
        } catch (err) {
            console.log(err);
            setError("Không thể thêm thẻ. Vui lòng kiểm tra lại thông tin.");
            setSuccess(null);
        }
    };

    const formatCardNumber = (number) => {
        return number.replace(/(\d{4})(?=\d)/g, "$1 ");
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faCreditCard} /> Quản lý thẻ thanh toán
                </h2>

                {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
                {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

                {!cardInfo ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="number"
                                className="block text-sm font-semibold mb-1 text-gray-700"
                            >
                                Số thẻ <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                placeholder={cardFields[0].placeholder}
                                onChange={handleChangeFormData}
                                required
                                pattern="\d{16}"
                                onInvalid={(e) =>
                                    e.target.setCustomValidity(
                                        e.target.value && !e.target.validity.patternMismatch
                                            ? cardFields[0].errorMsg
                                            : cardFields[0].patternMsg
                                    )
                                }
                                onInput={(e) => e.target.setCustomValidity("")}
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="type"
                                className="block text-sm font-semibold mb-1 text-gray-700"
                            >
                                Loại thẻ <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="type"
                                value={formData.type}
                                placeholder={cardFields[1].placeholder}
                                onChange={handleChangeFormData}
                                required
                                onInvalid={(e) => e.target.setCustomValidity(cardFields[1].errorMsg)}
                                onInput={(e) => e.target.setCustomValidity("")}
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label
                                    htmlFor="validToMonth"
                                    className="block text-sm font-semibold mb-1 text-gray-700"
                                >
                                    Tháng hết hạn <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="validToMonth"
                                    value={formData.validToMonth}
                                    placeholder={cardFields[2].placeholder}
                                    onChange={handleChangeFormData}
                                    required
                                    pattern="\d{2}"
                                    onInvalid={(e) =>
                                        e.target.setCustomValidity(
                                            e.target.value && !e.target.validity.patternMismatch
                                                ? cardFields[2].errorMsg
                                                : cardFields[2].patternMsg
                                        )
                                    }
                                    onInput={(e) => e.target.setCustomValidity("")}
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="validToYear"
                                    className="block text-sm font-semibold mb-1 text-gray-700"
                                >
                                    Năm hết hạn <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="validToYear"
                                    value={formData.validToYear}
                                    placeholder={cardFields[3].placeholder}
                                    onChange={handleChangeFormData}
                                    required
                                    pattern="\d{2}"
                                    onInvalid={(e) =>
                                        e.target.setCustomValidity(
                                            e.target.value && !e.target.validity.patternMismatch
                                                ? cardFields[3].errorMsg
                                                : cardFields[3].patternMsg
                                        )
                                    }
                                    onInput={(e) => e.target.setCustomValidity("")}
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label
                                    htmlFor="ccv"
                                    className="block text-sm font-semibold mb-1 text-gray-700"
                                >
                                    CCV <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="ccv"
                                    value={formData.ccv}
                                    placeholder={cardFields[4].placeholder}
                                    onChange={handleChangeFormData}
                                    required
                                    pattern="\d{3}"
                                    onInvalid={(e) =>
                                        e.target.setCustomValidity(
                                            e.target.value && !e.target.validity.patternMismatch
                                                ? cardFields[4].errorMsg
                                                : cardFields[4].patternMsg
                                        )
                                    }
                                    onInput={(e) => e.target.setCustomValidity("")}
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="postalCode"
                                    className="block text-sm font-semibold mb-1 text-gray-700"
                                >
                                    Mã bưu điện <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    placeholder={cardFields[5].placeholder}
                                    onChange={handleChangeFormData}
                                    required
                                    pattern="\d{5}"
                                    onInvalid={(e) =>
                                        e.target.setCustomValidity(
                                            e.target.value && !e.target.validity.patternMismatch
                                                ? cardFields[5].errorMsg
                                                : cardFields[5].patternMsg
                                        )
                                    }
                                    onInput={(e) => e.target.setCustomValidity("")}
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                        >
                            Thêm thẻ
                        </button>
                    </form>
                ) : (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                            Thẻ của bạn
                        </h3>
                        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 w-full max-w-md mx-auto">
                            <img
                                src="https://static-00.iconduck.com/assets.00/visa-icon-2048x1313-o6hi8q5l.png"
                                alt="Visa Logo"
                                className="absolute top-4 right-4 w-16"
                            />
                            
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-6 bg-gray-300 rounded-sm flex items-center justify-center text-xs font-bold text-gray-700">
                                    CHIP
                                </div>
                            </div>
                            <p className="text-xl font-mono tracking-wider mb-4">
                                {formatCardNumber(`**** **** **** ${cardInfo.number.slice(-4)}`)}
                            </p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-xs uppercase">Hết hạn</p>
                                    <p className="text-sm font-medium">
                                        {`${cardInfo.validToMonth}/${cardInfo.validToYear}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <Link
                        to="/recruiter/home"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition"
                    >
                        Quay lại trang chủ
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CardManagement;