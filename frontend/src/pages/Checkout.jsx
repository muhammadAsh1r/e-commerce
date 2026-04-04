import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../features/Order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
import { 
  Truck, 
  CreditCard, 
  PackageCheck, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck,
  Building2,
  Phone,
  User,
  ShoppingBag,
  Ticket
} from "lucide-react";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || "",
    address: user?.address || "",
    city: "",
    postalCode: "",
    phone: user?.phone || "",
  });

  const [paymentData, setPaymentData] = useState({
    method: "card", // 'card' or 'cod'
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      userId: user._id || user.id,
      items: cartItems.map(item => ({
        productId: item.productId._id || item.productId,
        quantity: item.quantity,
        price: item.productId.price
      })),
      shippingAddress: `${shippingData.address}, ${shippingData.city}, ${shippingData.postalCode}`,
      totalAmount: totalPrice,
    };

    try {
      const res = await dispatch(createOrder(orderData)).unwrap();
      
      if (paymentData.method === 'card') {
        navigate(`/payment/${res._id}`);
      } else {
        dispatch(clearCart());
        navigate("/order");
      }
    } catch (err) {
      alert("Failed to place order. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const steps = [
    { id: 1, label: "Logistics", icon: Truck },
    { id: 2, label: "Governance", icon: CreditCard },
    { id: 3, label: "Finalization", icon: PackageCheck }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Progress */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-brand -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${(step - 1) * 50}%` }}
          />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-gray-50 transition-all duration-500 shadow-xl ${
                step >= s.id ? 'bg-brand text-white shadow-brand/20' : 'bg-white text-gray-400'
              }`}>
                <s.icon size={24} />
              </div>
              <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${
                step >= s.id ? 'text-gray-900' : 'text-gray-400'
              }`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3.5rem] p-10 shadow-xl border border-gray-100 min-h-[500px] flex flex-col">
              
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-4xl font-black text-gray-900 mb-2">Shipment <span className="text-brand">Protocols</span></h2>
                  <p className="text-gray-400 font-medium italic mb-10">Define the terminal for package interception</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2"><User size={12} /> Legal Name</label>
                      <input name="fullName" value={shippingData.fullName} onChange={handleShippingChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all shadow-inner" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2"><Phone size={12} /> Signal Line</label>
                      <input name="phone" value={shippingData.phone} onChange={handleShippingChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all shadow-inner" placeholder="+00 000 0000000" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2"><MapPin size={12} /> Primary Residence</label>
                      <input name="address" value={shippingData.address} onChange={handleShippingChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all shadow-inner" placeholder="Street Address, Block/Area" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2"><Building2 size={12} /> Metropolitan Center</label>
                      <input name="city" value={shippingData.city} onChange={handleShippingChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all shadow-inner" placeholder="Karachi" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2"><Ticket size={12} /> Terminal Code</label>
                      <input name="postalCode" value={shippingData.postalCode} onChange={handleShippingChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all shadow-inner" placeholder="75500" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-4xl font-black text-gray-900 mb-2">Asset <span className="text-brand">Transfer</span></h2>
                  <p className="text-gray-400 font-medium italic mb-10">Select your preferred procurement methodology</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <button 
                      onClick={() => setPaymentData({...paymentData, method: 'card'})}
                      className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group cursor-pointer ${
                        paymentData.method === 'card' ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-4 rounded-2xl ${paymentData.method === 'card' ? 'bg-brand text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                        <CreditCard size={32} />
                      </div>
                      <span className="font-black text-gray-900 uppercase tracking-widest">Digital Ledger</span>
                    </button>
                    <button 
                      onClick={() => setPaymentData({...paymentData, method: 'cod'})}
                      className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group cursor-pointer ${
                        paymentData.method === 'cod' ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-4 rounded-2xl ${paymentData.method === 'cod' ? 'bg-brand text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                        <Truck size={32} />
                      </div>
                      <span className="font-black text-gray-900 uppercase tracking-widest">Terminal Ops (COD)</span>
                    </button>
                  </div>

                  {paymentData.method === 'card' && (
                    <div className="p-6 bg-brand/5 border border-brand/20 rounded-3xl text-center animate-in slide-in-from-top-4 duration-300">
                      <ShieldCheck size={32} className="text-brand mx-auto mb-3" />
                      <h3 className="text-lg font-black text-gray-900 mb-2">Stripe Fast Checkout</h3>
                      <p className="text-gray-500 font-medium text-sm leading-relaxed">
                        After confirming your deployment, you will be securely transitioned to our embedded Stripe verification portal to seamlessly input your card details.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-4xl font-black text-gray-900 mb-2">Final <span className="text-brand">Evaluation</span></h2>
                  <p className="text-gray-400 font-medium italic mb-10">Cross-reference assets and terminal addresses</p>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-start gap-5">
                      <div className="p-3 bg-white text-brand rounded-2xl shadow-sm"><MapPin size={24} /></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Deployment Terminal</p>
                        <p className="text-gray-900 font-bold leading-relaxed">{shippingData.fullName}</p>
                        <p className="text-gray-500 text-sm font-medium">{shippingData.address}, {shippingData.city}</p>
                        <p className="text-gray-500 text-sm font-medium">{shippingData.phone}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-start gap-5">
                      <div className="p-3 bg-white text-brand rounded-2xl shadow-sm"><CreditCard size={24} /></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Procurement Method</p>
                        <p className="text-gray-900 font-bold uppercase tracking-widest">{paymentData.method === 'card' ? 'Digital Ledger (Card)' : 'Terminal Operations (COD)'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-10 flex justify-between items-center">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-400 font-black uppercase tracking-widest hover:text-gray-900 transition-colors cursor-pointer">
                    <ChevronLeft size={20} /> Rollback
                  </button>
                ) : (
                  <div />
                )}
                
                {step < 3 ? (
                  <button onClick={() => setStep(step + 1)} className="flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all hover:-translate-y-1 active:scale-95 cursor-pointer">
                    Execute Stage <ChevronRight size={20} />
                  </button>
                ) : (
                  <button onClick={handlePlaceOrder} className="flex items-center gap-3 px-10 py-5 bg-brand text-white rounded-2xl font-black shadow-xl shadow-brand/20 hover:bg-brand-hover transition-all hover:-translate-y-1 active:scale-95 cursor-pointer">
                    Confirm Deployment <ShieldCheck size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="space-y-8 sticky top-24">
            <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <ShoppingBag className="text-brand" size={24} /> Manifest
              </h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={item.productId._id || item.productId} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.productId.images?.[0] || "/placeholder.png"} className="w-full h-full object-cover" alt={item.productId.name} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{item.productId.name}</p>
                      <p className="text-xs text-brand font-black"> x{item.quantity} — PKR {(item.productId.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <span>Gross Assets</span>
                  <span className="text-gray-900">PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <span>Logistics Fee</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xl font-black text-gray-900 uppercase">NET TOTAL</span>
                  <span className="text-3xl font-black text-brand">PKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-brand/5 p-6 rounded-[2rem] border border-brand/10 flex items-center gap-4">
              <ShieldCheck className="text-brand shrink-0" size={32} />
              <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase tracking-tight">
                All transactions are verified through high-entropy encryption standards. Safe processing guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
