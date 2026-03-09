import { useEffect, useMemo, useState, useRef } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import {
  Filter,
  IndianRupee,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Tag,
  Star,
  Clock,
  TrendingUp,
  Grid2X2,
  LayoutGrid,
  Check,
  Settings,
  Activity,
  Zap,
  Fan,
  Cable,
  Wind,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  Headphones,
  Truck,
  Award,
  ZapOff,
  Wrench,
  ThumbsUp,
  Package,
  Activity as SupportIcon
} from "lucide-react";

const categories = [
  { name: "Switches & Sockets", icon: Settings, slug: "switches", themeColor: "bg-indigo-600", colorClass: "text-indigo-600" },
  { name: "Power Generation & Transformers", icon: Zap, slug: "power", themeColor: "bg-yellow-500", colorClass: "text-yellow-600" },
  { name: "Light & Fans", icon: Fan, slug: "fan", themeColor: "bg-cyan-500", colorClass: "text-cyan-600" },
  { name: "Water Heaters & Geyser", icon: Sparkles, slug: "water-heaters", themeColor: "bg-teal-500", colorClass: "text-teal-600" },
  { name: "Wires & Cables", icon: Cable, slug: "wires-cables", themeColor: "bg-orange-500", colorClass: "text-orange-600" },
  { name: "Water Pumps & Motor", icon: Wind, slug: "water-pumps", themeColor: "bg-emerald-500", colorClass: "text-emerald-600" },
  { name: "Metering & Distribution", icon: Activity, slug: "metering-distribution", themeColor: "bg-red-500", colorClass: "text-red-600" },
];

const sortOptions = [
  { value: "", label: "Popularity", icon: Sparkles },
  { value: "low-high", label: "Price: Low to High", icon: TrendingUp },
  { value: "high-low", label: "Price: High to Low", icon: TrendingUp },
  { value: "latest", label: "New Arrivals", icon: Clock },
  { value: "rating", label: "Top Rated", icon: Star },
];

const CategoryPage = () => {
  const { fetchProductsByCategory, fetchAllProducts, products, isLoading } = useProductStore();
  const { category } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q");

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Increased to fill more space per page

  // FILTER STATES
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
  });

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const [showAllCategories, setShowAllCategories] = useState(false); // Default to false to verify "Show More" or set based on user pref. Image shows "Show Less" which means it's expanded. The user says "add like this" which implies the expanded view or the ability to expand.
  // Wait, Image 1 shows "Show Less" at the bottom of a specific list subset. Image 2 shows "Search".
  // Let's implement the search state.
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  const sidebarCategories = useMemo(() => {
    const activeCat = categories.find(c => c.slug === category);

    let items = [];
    let grouped = false;
    let groups = [];

    // If a brand is selected and no category is active, show the subcategories (product items) for that brand
    if (!activeCat && selectedBrands.length > 0) {
      const brandProducts = products.filter(p =>
        selectedBrands.some(brand => p.brand && p.brand.toLowerCase() === brand.toLowerCase()) ||
        selectedBrands.some(brand => p.name.toLowerCase().includes(brand.toLowerCase()))
      );
      const uniqueSubCats = [...new Set(brandProducts.map(p => p.subCategory).filter(Boolean))];
      items = uniqueSubCats.map(name => ({ name }));
    } else if (!activeCat) {
      // Show main categories if no specific category is selected (e.g., brand page)
      items = categories.map(c => ({ name: c.name, slug: c.slug }));
    } else if (category === "fan") {
      grouped = true;
      groups = [
        { group: "Light Bulbs", items: ["LED Bulb", "LED Batten", "LED Night Bulb"] },
        { group: "Ceiling Lights", items: ["LED Panel Light"] },
        { group: "Fan", items: ["Pedestal Fan", "Table Fan", "Wall Fan", "Exhaust Fan", "Ceiling Fan"] }
      ];
    } else {
      const subCats = {
        "switches": [
          "Switch Board Plate", "Switch", "Electrical Socket", "Blank Plate Cover",
          "Fan Regulator", "Modular Surface Box", "Plug Top", "Lamp Holder",
          "Communication Socket", "Door Bell", "Multi Plug Adaptor",
          "Spike Guard", "Combined Box"
        ],
        "power": ["Inverter Battery", "Inverter", "Stabilizer", "Inverter Trolly"],
        "water-heaters": ["Electric Geyser", "Instant Geyser", "Solar Water Heater"],
        "wires-cables": ["Low Tension Wire", "Coaxial TV Cable", "LAN Cable", "CCTV Cable"],
        "water-pumps": ["Centrifugal Pumps", "Submersible Pumps", "Pressure Pumps", "Induction Motors"],
        "metering-distribution": ["Single Phase Energy Meters", "Three Phase Energy Meters", "Distribution Boards (DB / MDB / SDB)", "Circuit Breakers (MCB / MCCB / ACB)"]
      };
      items = (subCats[category] || []).map(name => ({ name }));
    }

    // Filter by search
    if (categorySearch) {
      const search = categorySearch.toLowerCase();
      if (grouped) {
        groups = groups.map(g => ({
          ...g,
          items: g.items.filter(i => i.toLowerCase().includes(search))
        })).filter(g => g.items.length > 0);
      } else {
        items = items.filter(i => i.name.toLowerCase().includes(search));
      }
    }

    return { grouped, items, groups };
  }, [category, categorySearch, selectedBrands, products]);

  // CATEGORY BANNER SLIDER STATE
  const categoryBanners = {
    "switches": ["/br1.png"],
    "wires-cables": ["/br5.jpg"],
    "power": ["/br2.jpg"],
    "fan": ["/br3.jpg", "/br4.jpg"],
    "water-heaters": ["/br6.jpg"],
    "water-pumps": ["/water1.jpg"],
    "metering-distribution": ["/br7.png"],
  };

  const bannerImages = useMemo(() => {
    const images = categoryBanners[category] || ["/Switches_Sockets_web_4 (3).png"];
    return images.map(src => ({ src, link: "#products" }));
  }, [category]);

  const [currentBanner, setCurrentBanner] = useState(0);



  const scrollToProducts = () => {
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on category change
    setSelectedSubCategory(""); // Reset subcategory on category change

    // Check for brand parameter in URL
    const brandParam = searchParams.get("brand");
    if (brandParam) {
      setSelectedBrands([brandParam]);
    } else {
      setSelectedBrands([]);
    }

    if (category) {
      fetchProductsByCategory(category);
    } else {
      fetchAllProducts();
    }
  }, [fetchProductsByCategory, fetchAllProducts, category, searchQuery, location.search]);

  // Update price range when min/max changes
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // FILTER + SORT LOGIC
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(p =>
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    // Price filter
    data = data.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      data = data.filter(p => {
        // Case-insensitive exact brand match
        const isBrandMatch = selectedBrands.some(brand => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
        if (isBrandMatch) return true;

        // If the product has a different brand assigned, don't fallback to name search
        // This prevents "GM" products showing up when searching for "Anchor" if "Anchor" is in the name
        if (p.brand && p.brand !== "N/A" && !isBrandMatch) return false;

        // Fallback to name search only if brand is missing or matches
        return selectedBrands.some(brand => p.name.toLowerCase().includes(brand.toLowerCase()));
      });
    }

    // Color filter
    if (selectedColors.length > 0) {
      data = data.filter(p =>
        (p.color && selectedColors.some(color => color.toLowerCase() === p.color.toLowerCase())) ||
        selectedColors.some(color => p.name.toLowerCase().includes(color.toLowerCase()))
      );
    }

    // SubCategory filter
    if (selectedSubCategory) {
      data = data.filter(p => p.subCategory === selectedSubCategory);
    }

    // Sorting
    if (sort === "low-high") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      data.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (sort === "latest") {
      data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return data;
  }, [products, minPrice, maxPrice, sort, selectedBrands, selectedColors, selectedSubCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceChange = (type, value) => {
    const numValue = Number(value);
    if (type === 'min') {
      setMinPrice(Math.min(numValue, maxPrice));
    } else {
      setMaxPrice(Math.max(numValue, minPrice));
    }
  };

  // Handle dual range slider
  const handleRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);

    // Ensure min doesn't exceed max and vice versa
    if (index === 0) {
      newRange[0] = Math.min(newRange[0], priceRange[1]);
      setMinPrice(newRange[0]);
    } else {
      newRange[1] = Math.max(newRange[1], priceRange[0]);
      setMaxPrice(newRange[1]);
    }

    setPriceRange(newRange);
  };

  // Format price Indian style
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const clearFilters = () => {
    setMinPrice(0);
    setMaxPrice(100000);
    setPriceRange([0, 100000]);
    setSort("");
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const hasActiveFilters = minPrice > 0 || maxPrice < 100000 || sort || selectedBrands.length > 0 || selectedColors.length > 0;
  const currentCategory = categories.find(cat => cat.slug === category);

  // Dynamic Metadata for Sidebar
  const switchBrands = ["Anchor", "Legrand", "GM", "Cona"];
  const powerBrands = ["Luminous", "Exide", "V-Guard", "Microtek"];
  const meteringBrands = ["Secure Meters", "L&T (Larsen & Toubro)", "Genus Power", "Schneider Electric", "ABB", "Siemens"];
  const waterPumpBrands = ["Crompton", "Kirloskar", "Texmo", "CRI", "V-Guard", "KSB", "Havells", "Bindu"];
  const wireBrands = ["Finolex", "Polycab", "Havells", "RR Kabel", "Orbit"];
  const fanBrands = ["Atomberg", "Havells", "Orient", "Crompton", "V-Guard", "Anchor", "Luker", "Panasonic", "Philips", "Sturlite"];
  const waterHeaterBrands = ["AO Smith", "Racold", "Bajaj", "V-Guard"];
  const brandList = category === "switches" ? switchBrands :
    category === "power" ? powerBrands :
      category === "metering-distribution" ? meteringBrands :
        category === "water-pumps" ? waterPumpBrands :
          (category === "wires-cables" || category === "wires & cables") ? wireBrands :
            category === "fan" ? fanBrands :
              category === "water-heaters" ? waterHeaterBrands : [];

  const dynamicBrands = brandList.map(brand => ({
    name: brand,
    count: products.filter(p => p.brand === brand || p.name.toLowerCase().includes(brand.toLowerCase())).length || 0
  }));

  const sortOptions = [
    { label: "Popularity", value: "" },
    { label: "Price Low-High", value: "low-high" },
    { label: "Price High-Low", value: "high-low" },
    { label: "Latest", value: "latest" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bg-blue-300 rounded-full top-1/4 left-1/4 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
        <div className="absolute delay-1000 bg-purple-300 rounded-full bottom-1/4 right-1/4 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
      </div>

      <div className="w-full bg-white mb-8">
        <div className="mx-auto max-w-[1600px] px-8 pt-4 pb-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-[11px] text-gray-500 mb-2 font-medium font-sans">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">
              {category ? (currentCategory?.name || "Category") : searchQuery ? `Search Results for "${searchQuery}"` : "Products"}
            </span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900 mb-4 font-outfit tracking-tight text-center">
            {selectedBrands.length > 0
              ? `${selectedBrands[0]} Products`
              : category
                ? `Buy High-Quality ${currentCategory?.name || "Products"} at the Best Prices from Sree Saravana Electricals`
                : searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "All Products"}
          </h1>
        </div>

        {/* Banner - Only show on category pages, not in search results */}
        {category && !searchQuery && (
          <div className={`relative w-full overflow-hidden group ${(category === 'fan' || category === 'water-pumps' || category === 'water-heaters' || category === 'power' || category === 'switches' || category === 'wires-cables' || category === 'metering-distribution') ? 'h-auto' : 'aspect-[1098/339]'}`}>
            {/* Left Arrow */}
            <button
              onClick={prevBanner}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/20 p-3 hover:bg-black/40 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-r"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Full Image - Full Width */}
            <div className={`w-full relative bg-white ${(category === 'fan' || category === 'water-pumps' || category === 'water-heaters' || category === 'power' || category === 'switches' || category === 'wires-cables' || category === 'metering-distribution') ? 'h-auto' : 'h-full'}`}>
              <motion.img
                key={currentBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={bannerImages[currentBanner]?.src || "/switches_sockets_banner.png"}
                alt="Category Banner"
                className={`w-full cursor-pointer ${(category === 'fan' || category === 'water-pumps' || category === 'water-heaters' || category === 'power' || category === 'switches' || category === 'wires-cables' || category === 'metering-distribution') ? 'h-auto object-contain' : 'h-full object-cover'}`}
                onClick={scrollToProducts}
              />
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextBanner}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/20 p-3 hover:bg-black/40 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-l"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}
      </div>



      <div id="products-section" className="px-8 mx-auto max-w-[1600px] pt-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR FILTERS - LEFT */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            {/* FILTERS Header */}
            <div className="pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-base font-bold text-gray-900 tracking-wider">FILTERS</h2>
            </div>
            {/* Main Title Filter was removed or simplified in many designs, sticking to content for now */}
            {/* If sticking to image strictly, there is no "FILTERS" header shown, just the list? The image start is cropped. 
                But usually a header is good. I will keep the sidebar structure but maybe remove the red bar header if it distracts? 
                The image is very white/clean.
                However, I will leave the header for structure unless asked to remove.
                The image starts with "Communication Socket", so maybe it's just a segment.
            */}
            {/* CATEGORY Filter */}
            <div className="bg-white pb-8 border-b border-gray-100 relative">
              <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-tight">
                {selectedBrands.length > 0 && !category ? "PRODUCT ITEMS" : "CATEGORY"}
              </h3>

              {/* Category Search Input - matching second image layout */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search for Category"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-red-500 placeholder:text-gray-400"
                />
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {sidebarCategories.grouped ? (
                // Grouped layout for fan category
                <div className="grid grid-cols-1 gap-6">
                  {sidebarCategories.groups.map((group) => (
                    <div key={group.group}>
                      <p className="font-bold text-red-600 text-sm mb-2">{group.group}</p>
                      <div className="space-y-1">
                        {group.items.map((subName) => {
                          const count = products.filter(p => {
                            const matchesSub = p.subCategory === subName;
                            const matchesBrand = selectedBrands.length > 0
                              ? (selectedBrands.includes(p.brand) || selectedBrands.some(b => p.name.toLowerCase().includes(b.toLowerCase())))
                              : true;
                            return matchesSub && matchesBrand;
                          }).length;
                          return (
                            <div
                              key={subName}
                              onClick={() => setSelectedSubCategory(selectedSubCategory === subName ? "" : subName)}
                              className="flex items-center gap-2 text-[14px] cursor-pointer group hover:bg-gray-50 -mx-2 px-2 py-1 rounded-md transition-colors relative"
                            >
                              {selectedSubCategory === subName && <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-600 rounded-l-full"></div>}
                              <span className={`font-medium ${selectedSubCategory === subName ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'}`}>
                                {subName}
                              </span>
                              <span className="text-[13px] text-gray-400 font-normal">
                                ({count})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Flat layout for other categories
                <div className="space-y-4">
                  {sidebarCategories.items.map((item) => {
                    const count = products.filter(p => {
                      const matchesCategory = item.slug ? p.category === item.slug : p.subCategory === item.name;
                      const matchesBrand = selectedBrands.length > 0
                        ? (selectedBrands.includes(p.brand) || selectedBrands.some(b => p.name.toLowerCase().includes(b.toLowerCase())))
                        : true;
                      return matchesCategory && matchesBrand;
                    }).length;
                    const isActive = item.slug ? category === item.slug : selectedSubCategory === item.name;

                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (item.slug) {
                            navigate(`/category/${item.slug}${location.search}`);
                          } else {
                            setSelectedSubCategory(selectedSubCategory === item.name ? "" : item.name);
                          }
                        }}
                        className="flex items-center gap-2 text-[15px] cursor-pointer group hover:bg-gray-50 -mx-2 px-2 py-1 rounded-md transition-colors relative"
                      >
                        {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-600 rounded-l-full"></div>}
                        <span className={`font-medium ${isActive ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'}`}>
                          {item.name}
                        </span>
                        <span className="text-[13.5px] text-gray-400 font-normal">
                          ({count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            {(category === "switches" || category === "power" || category === "metering-distribution" || category === "water-pumps" || category === "wires-cables" || category === "wires & cables" || category === "fan" || category === "water-heaters") && dynamicBrands.length > 0 && (
              <div className="bg-white py-8 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-tight">BRAND</h3>
                <div className="space-y-4">
                  {dynamicBrands.map((item) => (
                    <label key={item.name} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(item.name)}
                          onChange={() => handleBrandToggle(item.name)}
                          className="w-5 h-5 border border-gray-300 rounded-none bg-white checked:bg-white checked:border-gray-900 appearance-none cursor-pointer transition-all"
                        />
                        {selectedBrands.includes(item.name) && (
                          <div className="absolute pointer-events-none text-gray-900">
                            <Check size={14} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] text-zinc-700 font-medium font-sans">
                          {item.name}
                        </span>
                        <span className="text-[14px] text-gray-400 font-normal">
                          ({item.count})
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Color Filter */}
            {(category === "wires-cables" || category === "wires & cables" || category === "fan") && (() => {
              const colorList = (category === "wires-cables" || category === "wires & cables")
                ? ["Black", "Red", "Yellow", "Blue", "Green", "Dark Green", "Grey", "White"]
                : ["White", "Green", "Brown", "Off-White", "Black", "Grey", "Yellow", "Blue", "Orange"];

              return (
                <div className="bg-white py-8 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-tight">COLOUR</h3>
                  <div className="space-y-4">
                    {colorList.map((color) => {
                      const count = products.filter(p =>
                        (p.color && p.color.toLowerCase() === color.toLowerCase()) ||
                        p.name.toLowerCase().includes(color.toLowerCase())
                      ).length;
                      return (
                        <label key={color} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedColors.includes(color)}
                              onChange={() => handleColorToggle(color)}
                              className="w-5 h-5 border border-gray-300 rounded-none bg-white checked:bg-white checked:border-gray-900 appearance-none cursor-pointer transition-all"
                            />
                            {selectedColors.includes(color) && (
                              <div className="absolute pointer-events-none text-gray-900">
                                <Check size={14} strokeWidth={4} />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[16px] text-zinc-700 font-medium font-sans">
                              {color}
                            </span>
                            <span className="text-[14px] text-gray-400 font-normal">
                              ({count})
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })()}





            {/* Price Range Filter Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                    <IndianRupee size={16} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Price Range</h3>
                </div>
                <button
                  onClick={() => setIsPriceOpen(!isPriceOpen)} // Expects state or just always show. I'll stick to always open.
                  className="text-gray-400"
                >
                  <ChevronUp size={18} />
                </button>
              </div>

              {/* Slider Component */}
              <div className="relative mb-8 px-2">
                {/* Track */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full -translate-y-1/2"></div>
                {/* Active Range Track */}
                <div
                  className="absolute top-1/2 h-1 bg-blue-500 rounded-full -translate-y-1/2"
                  style={{
                    left: `${(minPrice / 100000) * 100}%`,
                    right: `${100 - (maxPrice / 100000) * 100}%`
                  }}
                ></div>

                {/* Range Inputs (Dual Slider) */}
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={minPrice}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), maxPrice - 100);
                    setMinPrice(val);
                    setPriceRange([val, maxPrice]);
                  }}
                  className="absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 transition-all z-20"
                />
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), minPrice + 100);
                    setMaxPrice(val);
                    setPriceRange([minPrice, val]);
                  }}
                  className="absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 transition-all z-20"
                />
              </div>

              {/* Min/Max Inputs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Min</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors">
                      <IndianRupee size={14} />
                    </div>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Max</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors">
                      <IndianRupee size={14} />
                    </div>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Text */}
              <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between text-sm">
                <div className="text-center flex-1 border-r border-blue-100 last:border-0">
                  <span className="text-gray-500 block text-xs mb-1">From</span>
                  <span className="font-bold text-gray-900 text-base">{formatPrice(minPrice)}</span>
                </div>
                <div className="w-8 h-px bg-gray-300 mx-2"></div>
                <div className="text-center flex-1">
                  <span className="text-gray-500 block text-xs mb-1">To</span>
                  <span className="font-bold text-gray-900 text-base">{formatPrice(maxPrice)}</span>
                </div>
              </div>
            </div>


          </aside>

          {/* MAIN CONTENT - RIGHT */}
          <div className="flex-1">


            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-10 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-sm hover:border-gray-400 cursor-pointer transition-all">
                    <span className="text-sm font-normal text-gray-600">Sort By:</span>
                    <span className="text-sm font-bold text-gray-900">{sortOptions.find(o => o.value === sort)?.label || "Popularity"}</span>
                    <ChevronDown size={14} className="text-gray-400 ml-2" />
                  </div>

                  {/* Custom Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-100 shadow-2xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top scale-95 group-hover:scale-100">
                    {sortOptions.map(option => (
                      <div
                        key={option.value}
                        onClick={() => setSort(option.value)}
                        className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${sort === option.value ? 'font-bold text-black border-l-2 border-red-500' : 'text-gray-600'}`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>

            {/* Pagination Section */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row items-center justify-between mt-16 pt-8 border-t border-gray-100 gap-6">
                {/* Page Info */}
                <div className="text-gray-500 text-sm font-medium">
                  Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-3">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold transition-all ${currentPage === 1
                      ? "text-gray-300 cursor-not-allowed bg-gray-50"
                      : "text-gray-600 hover:bg-gray-50 hover:border-gray-300 active:scale-95"
                      }`}
                  >
                    <ChevronLeft size={18} />
                    <span>Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      const delta = 2; // Number of pages either side of current page

                      for (let i = 1; i <= totalPages; i++) {
                        if (
                          i === 1 ||
                          i === totalPages ||
                          (i >= currentPage - delta && i <= currentPage + delta)
                        ) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`w-9 h-9 flex items-center justify-center rounded-sm text-sm font-bold transition-all ${currentPage === i
                                ? "bg-[#2D3142] text-white shadow-md shadow-gray-200"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                              {i}
                            </button>
                          );
                        } else if (
                          (i === currentPage - delta - 1 && i > 1) ||
                          (i === currentPage + delta + 1 && i < totalPages)
                        ) {
                          pages.push(
                            <span key={i} className="px-1 text-gray-400 font-bold">
                              ...
                            </span>
                          );
                        }
                      }
                      return pages;
                    })()}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold transition-all ${currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed bg-gray-50"
                      : "text-gray-600 hover:bg-gray-50 hover:border-gray-300 active:scale-95"
                      }`}
                  >
                    <span>Next</span>
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Right Spacer for Desktop Alignment */}
                <div className="hidden md:block w-24"></div>
              </div>
            )}
          </div>

          {/* MOBILE FILTERS MODAL */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                  onClick={() => setShowMobileFilters(false)}
                />

                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed inset-y-0 right-0 z-50 w-full max-w-sm p-6 overflow-y-auto bg-white dark:bg-gray-900 lg:hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <X size={24} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Mobile filters content (same as desktop sidebar but vertical) */}
                  <div className="space-y-6">
                    {/* Categories */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Categories</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.slug}
                            onClick={() => {
                              navigate(`/category/${cat.slug}`);
                              setShowMobileFilters(false);
                            }}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${category === cat.slug
                              ? `bg-linear-to-r ${cat.color} text-white shadow-lg`
                              : `bg-linear-to-r ${cat.color} text-white shadow-lg`
                              }`}
                          >
                            <span className="mb-2 text-2xl">{cat.icon}</span>
                            <span className="text-sm font-medium">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Price Range</h4>
                      <div className="space-y-4">
                        {/* Price inputs */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <IndianRupee className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
                            <input
                              type="number"
                              placeholder="Min"
                              min="0"
                              max={maxPrice}
                              value={minPrice}
                              onChange={(e) => handlePriceChange('min', e.target.value)}
                              className="w-full py-2.5 pr-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                          </div>

                          <div className="relative">
                            <IndianRupee className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
                            <input
                              type="number"
                              placeholder="Max"
                              min={minPrice}
                              max="100000"
                              value={maxPrice}
                              onChange={(e) => handlePriceChange('max', e.target.value)}
                              className="w-full py-2.5 pr-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Price display */}
                        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Min</div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {formatPrice(minPrice)}
                            </div>
                          </div>
                          <div className="w-6 h-px bg-gray-400"></div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Max</div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {formatPrice(maxPrice)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Apply Filters Button */}
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Why Choose Us Full-Width Section */}
        <div className="mt-32 pt-20 border-t border-gray-100">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 font-outfit">Why Choose Sree Saravana Electricals?</h2>
            <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ThumbsUp,
                title: "Quality First",
                desc: "We only stock premium brands that meet our rigorous quality standards.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: Wrench,
                title: "Expert Installation",
                desc: "Get technical support and installation guidance from our certified team.",
                color: "bg-green-50 text-green-600"
              },
              {
                icon: Package,
                title: "Massive Inventory",
                desc: "Wide range of electrical solutions under one roof for all your needs.",
                color: "bg-orange-50 text-orange-600"
              },
              {
                icon: IndianRupee,
                title: "Best Value",
                desc: "Competitive pricing and attractive offers on top-tier electrical products. ",
                color: "bg-purple-50 text-purple-600"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-8 bg-white rounded-[2.5rem] hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 border border-transparent hover:border-gray-100 group"
              >
                <div className={`w-20 h-20 rounded-[1.5rem] ${item.color} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500`}>
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};

export default CategoryPage;