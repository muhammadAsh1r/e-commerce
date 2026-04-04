import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateOrderStatus } from "../features/Order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
import { ShieldCheck, ArrowRight, ChevronLeft, CreditCard } from "lucide-react";

// Load stripe outside of component to avoid recreating it on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

const CheckoutForm = ({ order, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Prevent automatic redirect so we can handle SPA navigation
    });

    if (submitError) {
      setError(submitError.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment Successful! Update order directly
      try {
        await dispatch(updateOrderStatus({ id: order._id, paymentStatus: "paid" })).unwrap();
        // Clear cart globally for the user
        await dispatch(clearCart(order.userId));
        navigate("/order");
      } catch (err) {
        setError("Payment succeeded, but order status failed to update.");
        setLoading(false);
      }
    } else {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement />
      
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm border border-red-100 dark:border-red-900/50">{error}</div>}
      
      <button 
        disabled={!stripe || loading}
        className="w-full py-5 bg-brand text-white rounded-2xl font-black shadow-xl shadow-brand/20 hover:bg-brand-hover hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>Pay PKR {(order.totalAmount || 0).toLocaleString()} <ArrowRight size={20} /></>
        )}
      </button>
    </form>
  );
};

const Payment = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const [clientSecret, setClientSecret] = useState("");
  const [networkError, setNetworkError] = useState("");

  // Retrieve the selected order natively from redux
  const order = orders.find((o) => o._id === id);

  useEffect(() => {
    if (!order) return;

    // Create PaymentIntent as soon as the page loads
    const fetchPaymentIntent = async () => {
      try {
        const res = await axios.post("/api/payment/create-intent", { orderId: order._id });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        setNetworkError("Failed to initialize payment gateway. Please ensure your backend Stripe secret is valid.");
      }
    };
    
    fetchPaymentIntent();
  }, [order]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-white/5 max-w-lg">
          <ShieldCheck size={48} className="mx-auto text-brand mb-6" />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">You must be authorized to access payment endpoints.</p>
          <Link to="/" className="text-brand font-bold hover:underline">Return to safety</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 font-bold mb-4">Validating transit token...</p>
        <Link to="/order" className="text-brand font-bold hover:underline">Go to Orders</Link>
      </div>
    );
  }

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#14b8a6', // brand teal
      colorBackground: '#1f2937',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '16px',
    }
  };

  return (
    <div className="bg-transparent min-h-screen pb-10">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/checkout" className="p-2 bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-brand transition-colors cursor-pointer">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">Secure <span className="text-brand">Checkout</span></h1>
        </div>

        <div className="bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl rounded-[3.5rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/5 grid md:grid-cols-2 gap-12">
          
          {/* Order Summary Left Column */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-1">Transaction Ref</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white break-all">{order._id}</h3>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2"><CreditCard size={18}/> Order Manifest</h4>
              <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-600 dark:text-gray-400">Package {idx + 1} &times; {item.quantity}</span>
                    <span className="font-black text-gray-900 dark:text-white tracking-tighter">PRK {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="h-px bg-gray-200 dark:bg-white/5 w-full my-4" />
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px]">Total Due</span>
                  <span className="text-3xl font-black text-brand tracking-tighter">PKR {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-brand/5 dark:bg-brand/10 p-6 rounded-[2rem] border border-brand/10 flex items-center gap-4">
              <ShieldCheck className="text-brand shrink-0" size={32} />
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase tracking-tight">
                Tokens processed over TLS 1.3 AES-256 encryption. PCI-DSS Tier 1 standards enforced.
              </p>
            </div>
          </div>

          {/* Stripe Container Right Column */}
          <div>
            {networkError ? (
              <div className="h-full flex flex-col justify-center text-center p-6 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-900/50 shadow-sm">
                <p className="font-black uppercase tracking-widest text-xs mb-2">Network Protocol Error</p>
                <p className="font-bold text-sm leading-relaxed">{networkError}</p>
              </div>
            ) : clientSecret ? (
              <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                <CheckoutForm order={order} clientSecret={clientSecret} />
              </Elements>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col justify-center items-center gap-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 animate-pulse">
                <div className="h-10 w-10 border-4 border-brand/20 dark:border-white/10 border-t-brand rounded-full animate-spin" />
                <p className="font-bold text-gray-400 dark:text-gray-500 text-sm italic uppercase tracking-widest">Establishing secure connection...</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;
