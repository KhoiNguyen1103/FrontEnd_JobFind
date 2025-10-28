import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import subscriptionPlanApi from "../../api/subscriptionPlanApi";
import { useSelector } from "react-redux";
import orderApi from "../../api/orderApi";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaCcVisa } from "react-icons/fa";

const stripePromise = loadStripe("pk_test_51Q61wC08BpdjTVb3oNVqG6KXhoIiQKB82Qi2oophJYjbrP0DLtAqDQL9WaoFqz558MgNtpTDfIKu4Ydu4J2Gpgg700dadQ6akd");

const CheckoutForm = ({ planId, plans, setPaymentLoading, setPaymentError, setPaymentSuccess, paymentLoading, setOrderData, existingOrder }) => {
    const stripe = useStripe();
    const elements = useElements();
    const user = useSelector((state) => state.auth.user);
    const userId = user?.id;
    const [orderData, setLocalOrderData] = useState(existingOrder || null);
    const [isCardConfirmed, setIsCardConfirmed] = useState(false);
    const [chargeStatus, setChargeStatus] = useState(existingOrder?.status || null);

    useEffect(() => {
        if (existingOrder) {
            setLocalOrderData(existingOrder);
            setOrderData(existingOrder);
            setChargeStatus(existingOrder.status);
            if (existingOrder.status === "PENDING" && existingOrder.intentSecret) {
                setIsCardConfirmed(true);
            } else if (existingOrder.status === "PENDING") {
                setIsCardConfirmed(false);
            } else if (existingOrder.status === "succeeded" || existingOrder.status === "COMPLETED") {
                setIsCardConfirmed(true);
                setPaymentSuccess(true);
            }
        }
    }, [existingOrder, setOrderData, setPaymentSuccess]);

    const handleCreateOrder = async (event) => {
        event.preventDefault();
        setPaymentLoading(true);
        setPaymentError(null);

        try {
            const plan = plans.find((p) => p.id === planId);
            if (!plan) {
                throw new Error("Gói dịch vụ không tồn tại");
            }

            const orderRequest = {
                userId: userId,
                subscriptionPlanId: planId,
                isPayByCC: true,
            };

            const orderResponse = await orderApi.createOrder(orderRequest);
            setLocalOrderData(orderResponse);
            setOrderData(orderResponse);
        } catch (err) {
            console.error("Order creation error:", err);
            setPaymentError(err.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleConfirmCard = async (event) => {
        event.preventDefault();
        setPaymentLoading(true);
        setPaymentError(null);

        try {
            const cardElement = elements.getElement(CardElement);
            const paymentMethodResult = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: {
                    address: { postal_code: "11111" },
                },
            });

            if (paymentMethodResult.error) {
                throw new Error(paymentMethodResult.error.message);
            }

            const paymentMethodId = paymentMethodResult.paymentMethod.id;

            const paymentResult = await stripe.confirmCardPayment(orderData.intentSecret, {
                payment_method: paymentMethodId,
                setup_future_usage: "on_session",
            });

            if (paymentResult.error) {
                throw new Error(paymentResult.error.message);
            }

            // Update orderData with paymentInfo (assuming API returns it after confirmation)
            const updatedOrder = {
                ...orderData,
                paymentInfo: {
                    cardNumber: `**** **** **** ${paymentMethodResult.paymentMethod.card.last4}`,
                    expiryMonth: paymentMethodResult.paymentMethod.card.exp_month,
                    expiryYear: paymentMethodResult.paymentMethod.card.exp_year.toString(),
                    id: paymentMethodResult.paymentMethod.id,
                    subscriptionId: paymentResult.paymentIntent?.id || "N/A",
                },
            };

            setLocalOrderData(updatedOrder);
            setOrderData(updatedOrder);
            setIsCardConfirmed(true);
        } catch (err) {
            console.error("Card confirmation error:", err);
            setPaymentError(err.message || "Không thể xác nhận thẻ. Vui lòng thử lại.");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleChargeOrder = async () => {
        setPaymentLoading(true);
        setPaymentError(null);

        try {
            const chargeResponse = await orderApi.chargeOrder(orderData.id);
            setLocalOrderData(chargeResponse);
            setOrderData(chargeResponse);
            setChargeStatus(chargeResponse.status);

            if (chargeResponse.status === "succeeded" || chargeResponse.status === "COMPLETED") {
                setPaymentSuccess(true);
            } else {
                setPaymentSuccess(false);
            }
        } catch (err) {
            console.error("Charge order error:", err);
            setPaymentError(err.message || "Không thể thực hiện thanh toán. Vui lòng thử lại.");
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">Thông Tin Gói Đăng Ký</h3>

                    {orderData || planId ? (
                        <div className="space-y-6">
                            {(() => {
                                const displayPlan = orderData || plans.find((p) => p.id === planId);
                                if (!displayPlan) return null;

                                return (
                                    <div className="p-6 bg-white rounded-lg shadow-sm space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-600">Gói Dịch Vụ:</span>
                                            <span className="text-lg text-gray-800 font-semibold">{displayPlan.name}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div
                                                className="text-gray-800 text-lg"
                                                dangerouslySetInnerHTML={{
                                                    __html: displayPlan.description || "",
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-600">Thành tiền:</span>
                                            <span className="text-lg text-gray-800 font-semibold">
                                                ${orderData?.totalPrice ?? displayPlan.price}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-600">Thời Hạn:</span>
                                            <span className="text-lg text-gray-800 font-semibold">{displayPlan.durationMonths} tháng</span>
                                        </div>
                                        {orderData && (
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-600">Trạng Thái:</span>
                                                <span className="text-green-600 font-semibold">{orderData.status}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    ) : (
                        <div className="text-gray-600">Vui lòng chọn gói để hiển thị chi tiết.</div>
                    )}
                </div>

                {/* Payment Form and Card Graphic */}
                <div>
                    {/* Always show card graphic if paymentInfo exists */}
                    {orderData && orderData.paymentInfo && (
                        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-md mb-6 h-56 w-full max-w-md mx-auto">
                            <div className="absolute top-4 left-4 text-2xl font-bold">VISA</div>
                            <div className="absolute bottom-8 left-4 text-lg font-mono">
                                {orderData.paymentInfo.cardNumber || "**** **** **** 1234"}
                            </div>
                            <div className="absolute bottom-8 right-4 text-lg">
                                {orderData.paymentInfo.expiryMonth}/{orderData.paymentInfo.expiryYear.slice(-2)}
                            </div>
                            <div className="absolute top-4 right-4">
                                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Card Input Form or Payment Button */}
                    {!orderData ? (
                        <form onSubmit={handleCreateOrder} className="w-full max-w-md mx-auto">
                            <button
                                type="submit"
                                disabled={paymentLoading}
                                className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${paymentLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {paymentLoading ? "Đang xử lý..." : "Đăng ký"}
                            </button>
                        </form>
                    ) : !isCardConfirmed && chargeStatus !== "COMPLETED" ? (
                        <form onSubmit={handleConfirmCard} className="w-full max-w-md mx-auto">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-medium">Thông Tin Thẻ</label>
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: "16px",
                                                color: "#32325d",
                                                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                                                "::placeholder": { color: "#aab7c4" },
                                            },
                                            invalid: { color: "#fa755a", iconColor: "#fa755a" },
                                        },
                                    }}
                                    className="p-3 border border-gray-300 rounded-lg bg-white"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={paymentLoading}
                                className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${paymentLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {paymentLoading ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                        </form>
                    ) : chargeStatus === "COMPLETED" ? (
                        <div className="w-full max-w-md mx-auto">
                            <p className="text-green-600 font-semibold">Thanh toán thành công!</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-md mx-auto">
                            <button
                                onClick={handleChargeOrder}
                                disabled={paymentLoading}
                                className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${paymentLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {paymentLoading ? "Đang xử lý..." : "Thanh toán"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const OrderSummary = ({ orders }) => {
    return (
        <div className="w-full max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Thông Tin Đăng Ký</h2>
            {orders.map((order, index) => (
                <div key={order.id} className="bg-gray-50 p-6 rounded-lg mb-6">
                    <div className="space-y-4">
                        <div>
                            <span className="font-medium text-gray-600">Gói Dịch Vụ:</span>
                            <span className="ml-2 text-gray-800">{order.name}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Mô Tả:</span>
                            <span
                                className="ml-2 text-gray-800 text-lg"
                                dangerouslySetInnerHTML={{
                                    __html: order.description || "",
                                }}
                            />
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Thời Hạn:</span>
                            <span className="ml-2 text-gray-800">{order.durationMonths} tháng</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Số Tiền:</span>
                            <span className="ml-2 text-gray-800">${order.totalPrice}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Trạng Thái:</span>
                            <span className="ml-2 text-green-600">{order.status}</span>
                        </div>
                        {order.status === "COMPLETED" && order.paymentInfo && (
                            <div className="mt-6 space-y-3 bg-white border border-green-200 p-5 rounded-lg shadow-sm">
                                <div className="text-green-700 text-lg font-semibold flex items-center">
                                    <FaCcVisa className="text-blue-600 mr-2 text-2xl" />
                                    Thông Tin Thanh Toán (Visa)
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                                    <div>
                                        <span className="font-medium text-gray-600">Mã Thanh Toán:</span>
                                        <div className="text-gray-800">{order.paymentInfo.id}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Số Thẻ:</span>
                                        <div className="text-gray-800">{order.paymentInfo.cardNumber}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Hết Hạn:</span>
                                        <div className="text-gray-800">
                                            {order.paymentInfo.expiryMonth}/{order.paymentInfo.expiryYear}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Mã Subscription:</span>
                                        <div className="text-gray-800">{order.paymentInfo.subscriptionId}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {order.status === "COMPLETED" && (
                            <div className="flex">
                                <div className="text-green-600 font-semibold mt-4">Thanh toán thành công!</div>
                                <div className="text-gray-600 font-light mt-4 ml-3">{order.createdAt}</div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const RecruiterSubcribe = () => {
    const [plans, setPlans] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const userId = user?.id;

    useEffect(() => {
        const { selectedPlanId } = location.state || {};
        if (selectedPlanId) {
            setSelectedPlanId(selectedPlanId);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const orderResponse = await orderApi.getOrderByUserId(userId);
                setOrders([orderResponse]);

                if (orderResponse && orderResponse.status === "PENDING") {
                    setOrderData(orderResponse);
                    setSelectedPlanId(orderResponse.subscriptionPlanId);
                }
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    try {
                        const planResponse = await subscriptionPlanApi.listAllSubscriptionPlans();
                        const activePlans = planResponse.filter((plan) => plan.isActive);
                        setPlans(activePlans);
                    } catch (planErr) {
                        console.error("Error fetching plans:", planErr);
                        setError("Không thể tải gói dịch vụ. Vui lòng thử lại sau.");
                    }
                } else {
                    console.error("Error fetching order:", err);
                    setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    const handleSelectPlan = (planId) => {
        setSelectedPlanId(planId);
        setOrderData(null);
        setPaymentSuccess(false);
        setPaymentError(null);
    };

    return (
        <div className="py-10 bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Các Gói Dịch Vụ Dành Cho Nhà Tuyển Dụng</h1>

                {loading && <div className="text-center text-gray-600">Đang tải...</div>}

                {error && <div className="text-center text-red-500 mb-6">{error}</div>}

                {paymentError && <div className="text-center text-red-500 mb-6">{paymentError}</div>}

                {paymentSuccess && orderData && orderData.status === "COMPLETED" && (
                    <div className="text-center text-green-600 mb-6">Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.</div>
                )}

                {!loading && !error && orders.length > 0 && orders[0].status === "COMPLETED" && <OrderSummary orders={orders} />}

                {!loading && !error && orders.length === 0 && plans.length === 0 && (
                    <div className="text-center text-gray-600">Hiện tại không có gói dịch vụ nào khả dụng.</div>
                )}

                {!loading && !error && orders.length === 0 && plans.length > 0 && !selectedPlanId && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center"
                            >
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">{plan.name}</h2>
                                <p
                                    className="text-gray-600 mb-4 min-h-[80px]"
                                    dangerouslySetInnerHTML={{
                                        __html: plan.description || "",
                                    }}
                                />
                                <p className="text-3xl font-bold text-green-600 mb-2">${plan.price.toFixed(2)}</p>
                                <p className="text-gray-500 mb-6">Thời hạn: {plan.durationMonths} tháng</p>
                                <button
                                    onClick={() => handleSelectPlan(plan.id)}
                                    disabled={paymentLoading}
                                    className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 ${paymentLoading ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    Chọn gói
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && ((orders.length === 0 && selectedPlanId) || (orders.length > 0 && orders[0].status === "PENDING")) && (
                    <Elements stripe={stripePromise}>
                        <CheckoutForm
                            planId={selectedPlanId || orders[0]?.subscriptionPlanId}
                            plans={plans}
                            setPaymentLoading={setPaymentLoading}
                            setPaymentError={setPaymentError}
                            setPaymentSuccess={setPaymentSuccess}
                            paymentLoading={paymentLoading}
                            setOrderData={setOrderData}
                            existingOrder={orders.length > 0 && orders[0].status === "PENDING" ? orders[0] : null}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default RecruiterSubcribe;