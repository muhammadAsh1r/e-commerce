import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productSlice";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Zap, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 8);

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On all orders over PKR 5,000" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment processing" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy for all items" },
    { icon: Zap, title: "Fast Delivery", desc: "Doorstep delivery within 2-3 days" },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-gray-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop" 
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-in slide-in-from-left duration-700">
            <span className="inline-block px-4 py-1.5 mb-5 text-sm font-bold tracking-widest text-brand uppercase bg-brand/10 rounded-full">
              New Collection 2026
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Elevate Your <br />
              <span className="text-brand">Digital Life.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              Discover the latest in premium electronics and accessories. 
              Designed for performance, built for style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products"
                className="px-8 py-4 bg-brand hover:bg-brand-hover text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand/20 transition-all flex items-center gap-2"
              >
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link 
                to="/categories"
                className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl font-bold text-lg border border-gray-200 transition-all"
              >
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-5 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-4 bg-brand/10 text-brand rounded-2xl">
                <f.icon size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-500">The most trending items this week</p>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-brand font-bold hover:underline underline-offset-4">
            View All <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white aspect-square rounded-[2rem] border border-gray-100 mb-4" />
                <div className="space-y-3 px-2">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-6 bg-gray-200 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section (Simplified for now) */}
      <section className="container mx-auto px-4">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand/10 skew-x-12 transform translate-x-1/2" />
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Exclusive Deals on <br />
              <span className="text-brand">Premium Tech Gadgets</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Don't miss out on our limited-time offers. Up to 40% off on selected headphones, 
              smartwatches, and premium accessories.
            </p>
            <button className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl font-bold text-lg transition-all">
              Claim Your Discount
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
