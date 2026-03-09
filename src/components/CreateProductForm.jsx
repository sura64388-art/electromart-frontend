import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Upload,
  Loader,
  X,
  Tag,
  Package,
  DollarSign,
  Hash,
  FileText,
  Image,
  CheckCircle,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  TrendingUp,
  Shield,
  ChevronDown
} from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  {
    id: "switches",
    name: "Switches & Sockets",
    icon: "🔌",
    color: "from-indigo-500 to-blue-500",
    subCategories: [
      "Switch Board Plate", "Switch", "Electrical Socket", "Blank Plate Cover",
      "Fan Regulator", "Modular Surface Box", "Plug Top", "Lamp Holder",
      "Communication Socket", "Door Bell", "Multi Plug Adaptor",
      "Spike Guard", "Combined Box"
    ]
  },
  { id: "power", name: "Power Generation & Transformers", icon: "⚡", color: "from-yellow-400 to-orange-500", subCategories: ["Inverter Battery", "Inverter", "Stabilizer", "Inverter Trolly"] },
  {
    id: "fan",
    name: "Light & Fans",
    icon: "💡",
    color: "from-cyan-400 to-blue-500",
    subCategories: [
      "LED Bulb", "LED Batten", "LED Night Bulb",
      "LED Panel Light",
      "Pedestal Fan", "Table Fan", "Wall Fan", "Exhaust Fan", "Ceiling Fan"
    ],
    subCategoryGroups: [
      { group: "Light Bulbs", items: ["LED Bulb", "LED Batten", "LED Night Bulb"] },
      { group: "Ceiling Lights", items: ["LED Panel Light"] },
      { group: "Fan", items: ["Pedestal Fan", "Table Fan", "Wall Fan", "Exhaust Fan", "Ceiling Fan"] }
    ]
  },
  { id: "water-heaters", name: "Water Heaters & Geyser", icon: "🔥", color: "from-teal-400 to-blue-500", subCategories: ["Electric Geyser", "Instant Geyser", "Solar Water Heater"] },
  { id: "wires-cables", name: "Wires & Cables", icon: "🧵", color: "from-orange-400 to-red-500", subCategories: ["Low Tension Wire", "Coaxial TV Cable", "LAN Cable", "CCTV Cable"] },
  { id: "water-pumps", name: "Water Pumps & Motor", icon: "💧", color: "from-green-400 to-emerald-500", subCategories: ["Centrifugal Pumps", "Submersible Pumps", "Pressure Pumps", "Induction Motors"] },
  { id: "metering-distribution", name: "Metering & Distribution", icon: "📊", color: "from-red-400 to-pink-500", subCategories: ["Single Phase Energy Meters", "Three Phase Energy Meters", "Distribution Boards (DB / MDB / SDB)", "Circuit Breakers (MCB / MCCB / ACB)"] },
];

const CreateProductForm = ({ productToEdit, onCancel }) => {
  const isEditing = !!productToEdit;
  const [newProduct, setNewProduct] = useState({
    name: productToEdit?.name || "",
    price: productToEdit?.price || "",
    category: productToEdit?.category || "",
    subCategory: productToEdit?.subCategory || "",
    image: productToEdit?.image || "",
    brand: productToEdit?.brand || "",
    stock: productToEdit?.stock || "10",
    offer: productToEdit?.offer || false,
    discountPercentage: productToEdit?.discountPercentage || "",
    color: productToEdit?.color || "",
  });

  const [uploadProgress, setUploadProgress] = useState(isEditing ? 100 : 0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { createProduct, updateProduct, loading, error } = useProductStore();

  // File input reference
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProduct.image) {
      alert("Please upload an image");
      return;
    }

    if (!newProduct.category) {
      alert("Please select a category");
      return;
    }

    if (!newProduct.subCategory) {
      alert("Please select a sub-category");
      return;
    }

    const isBrandRequired = newProduct.category === "switches" || newProduct.category === "power" || newProduct.category === "metering-distribution" || newProduct.category === "water-pumps" || newProduct.category === "wires-cables" || newProduct.category === "wires & cables" || newProduct.category === "water-heaters" || newProduct.category === "fan";
    if (!newProduct.brand && isBrandRequired) {
      alert("Please enter a brand name");
      return;
    }

    const price = parseFloat(newProduct.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    try {
      if (isEditing) {
        await updateProduct(productToEdit._id, {
          name: newProduct.name.trim(),
          price: price,
          category: newProduct.category,
          subCategory: newProduct.subCategory,
          brand: (newProduct.category === "switches" || newProduct.category === "power" || newProduct.category === "metering-distribution" || newProduct.category === "water-pumps" || newProduct.category === "wires-cables" || newProduct.category === "wires & cables" || newProduct.category === "water-heaters" || newProduct.category === "fan") ? newProduct.brand : "N/A",
          image: newProduct.image,
          stock: parseInt(newProduct.stock) || 10,
          offer: newProduct.offer,
          discountPercentage: newProduct.offer ? (parseFloat(newProduct.discountPercentage) || 0) : 0,
          color: (newProduct.category === "wires-cables" || newProduct.category === "wires & cables") ? newProduct.color : "",
        });
      } else {
        await createProduct({
          name: newProduct.name.trim(),
          price: price,
          category: newProduct.category,
          subCategory: newProduct.subCategory,
          brand: (newProduct.category === "switches" || newProduct.category === "power" || newProduct.category === "metering-distribution" || newProduct.category === "water-pumps" || newProduct.category === "wires-cables" || newProduct.category === "wires & cables" || newProduct.category === "water-heaters" || newProduct.category === "fan") ? newProduct.brand : "N/A",
          image: newProduct.image,
          stock: parseInt(newProduct.stock) || 10,
          offer: newProduct.offer,
          discountPercentage: newProduct.offer ? (parseFloat(newProduct.discountPercentage) || 0) : 0,
          color: (newProduct.category === "wires-cables" || newProduct.category === "wires & cables") ? newProduct.color : "",
        });
      }

      clearInterval(interval);
      setUploadProgress(100);

      setNewProduct({
        name: "",
        price: "",
        category: "",
        subCategory: "",
        brand: "",
        image: "",
        stock: "10",
        offer: false,
        discountPercentage: "",
        color: "",
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product. Please check console for details.");
      clearInterval(interval);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.onerror = () => {
      alert("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  // Function to trigger file input click
  const handleBrowseFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    setNewProduct(prev => ({ ...prev, image: "" }));
  };

  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-4xl px-4 mx-auto">
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed z-50 transform -translate-x-1/2 top-6 left-1/2"
            >
              <div className="flex items-center gap-3 px-6 py-4 text-white shadow-2xl bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Product Added Successfully!</p>
                  <p className="text-sm opacity-90">Your product is now live in the store</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="overflow-hidden border shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/20 dark:border-gray-700/30 rounded-3xl"
        >
          {/* Form Header */}
          <div className="relative p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    {isEditing ? "Edit Product" : "Add New Product"}
                  </h1>
                  <p className="mt-2 text-blue-100">
                    {isEditing ? "Modify your product details" : "Add amazing products to your digital store"}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <LayoutGrid className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Product Details</span>
                </div>
                <div className="w-8 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Upload Media</span>
                </div>
                <div className="w-8 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Category</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 mb-8 border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800/30 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-300">Error Creating Product</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Product Name & Description */}
            <div className="grid grid-cols-1 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Product Name
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g., LED Bulbs, Ceiling Fans, Switches, Wires, MCB, Water Pumps"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-5 py-4 text-gray-900 transition-all duration-300 border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>


            </div>

            {/* Price, Category, Brand & Stock */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-800/30">
                    <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <label className="font-medium text-gray-900 dark:text-white">Price (₹)</label>
                </div>
                <div className="relative">
                  <span className="absolute text-gray-500 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))}
                    required
                    className="w-full pl-10 pr-5 py-3.5 text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/30 dark:to-pink-800/30">
                    <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <label className="font-medium text-gray-900 dark:text-white">Category</label>
                </div>
                <div className="relative">
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
                    required
                    className="w-full px-5 py-3.5 appearance-none text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                  >
                    <option value="" className="text-gray-500">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="text-gray-900 dark:text-white">
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
                    <LayoutGrid className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>



              {(newProduct.category === "switches" || newProduct.category === "power" || newProduct.category === "metering-distribution" || newProduct.category === "water-pumps" || newProduct.category === "wires-cables" || newProduct.category === "wires & cables" || newProduct.category === "fan" || newProduct.category === "water-heaters") && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900/30 dark:to-red-800/30">
                      <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <label className="font-medium text-gray-900 dark:text-white">Brand Name</label>
                  </div>
                  <div className="relative">
                    <select
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct(p => ({ ...p, brand: e.target.value }))}
                      required={newProduct.category === "switches" || newProduct.category === "power" || newProduct.category === "metering-distribution" || newProduct.category === "water-pumps" || newProduct.category === "wires-cables" || newProduct.category === "wires & cables" || newProduct.category === "fan" || newProduct.category === "water-heaters"}
                      className="w-full px-5 py-3.5 appearance-none text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                    >
                      <option value="" className="text-gray-500">Select Brand</option>
                      {newProduct.category === "switches" && (
                        <>
                          <option value="Anchor">Anchor</option>
                          <option value="Legrand">Legrand</option>
                          <option value="GM">GM</option>
                          <option value="Cona">Cona</option>
                        </>
                      )}
                      {newProduct.category === "power" && (
                        <>
                          <option value="Luminous">Luminous</option>
                          <option value="Exide">Exide</option>
                          <option value="V-Guard">V-Guard</option>
                          <option value="Microtek">Microtek</option>
                        </>
                      )}
                      {newProduct.category === "metering-distribution" && (
                        <>
                          <option value="Secure Meters">Secure Meters</option>
                          <option value="L&T (Larsen & Toubro)">L&T (Larsen & Toubro)</option>
                          <option value="Genus Power">Genus Power</option>
                          <option value="Schneider Electric">Schneider Electric</option>
                          <option value="ABB">ABB</option>
                          <option value="Siemens">Siemens</option>
                        </>
                      )}
                      {newProduct.category === "water-pumps" && (
                        <>
                          <option value="Crompton">Crompton</option>
                          <option value="Kirloskar">Kirloskar</option>
                          <option value="Texmo">Texmo</option>
                          <option value="CRI">CRI</option>
                          <option value="V-Guard">V-Guard</option>
                          <option value="KSB">KSB</option>
                          <option value="Havells">Havells</option>
                          <option value="Bindu">Bindu</option>
                        </>
                      )}
                      {(newProduct.category === "wires-cables" || newProduct.category === "wires & cables") && (
                        <>
                          <option value="Finolex">Finolex</option>
                          <option value="Polycab">Polycab</option>
                          <option value="Havells">Havells</option>
                          <option value="RR Kabel">RR Kabel</option>
                          <option value="Orbit">Orbit</option>
                        </>
                      )}
                      {newProduct.category === "fan" && (
                        <>
                          <option value="Atomberg">Atomberg</option>
                          <option value="Havells">Havells</option>
                          <option value="Orient">Orient</option>
                          <option value="Crompton">Crompton</option>
                          <option value="V-Guard">V-Guard</option>
                          <option value="Anchor">Anchor</option>
                          <option value="Luker">Luker</option>
                          <option value="Panasonic">Panasonic</option>
                          <option value="Philips">Philips</option>
                          <option value="Sturlite">Sturlite</option>
                        </>
                      )}
                      {newProduct.category === "water-heaters" && (
                        <>
                          <option value="AO Smith">AO Smith</option>
                          <option value="Racold">Racold</option>
                          <option value="Bajaj">Bajaj</option>
                          <option value="V-Guard">V-Guard</option>
                        </>
                      )}

                    </select>
                    <div className="absolute transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              {(newProduct.category === "wires-cables" || newProduct.category === "wires & cables") && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                      <Sparkles className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <label className="font-medium text-gray-900 dark:text-white">Wire Color</label>
                  </div>
                  <div className="relative">
                    <select
                      value={newProduct.color}
                      onChange={(e) => setNewProduct(p => ({ ...p, color: e.target.value }))}
                      className="w-full px-5 py-3.5 appearance-none text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                    >
                      <option value="" className="text-gray-500">Select Color</option>
                      <option value="Black">Black</option>
                      <option value="Red">Red</option>
                      <option value="Yellow">Yellow</option>
                      <option value="Blue">Blue</option>
                      <option value="Green">Green</option>
                      <option value="Dark Green">Dark Green</option>
                      <option value="Grey">Grey</option>
                      <option value="White">White</option>
                    </select>
                    <div className="absolute transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              {newProduct.category === "fan" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                      <Sparkles className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <label className="font-medium text-gray-900 dark:text-white">Colour</label>
                  </div>
                  <div className="relative">
                    <select
                      value={newProduct.color}
                      onChange={(e) => setNewProduct(p => ({ ...p, color: e.target.value }))}
                      className="w-full px-5 py-3.5 appearance-none text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                    >
                      <option value="" className="text-gray-500">Select Colour</option>

                      <option value="White">White</option>
                      <option value="Green">Green</option>
                      <option value="Brown">Brown</option>
                      <option value="Off-White">Off-White</option>
                      <option value="Black">Black</option>
                      <option value="Grey">Grey</option>
                      <option value="Yellow">Yellow</option>
                      <option value="Blue">Blue</option>
                      <option value="Orange">Orange</option>
                    </select>
                    <div className="absolute transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-900/30 dark:to-blue-800/30">
                    <Hash className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <label className="font-medium text-gray-900 dark:text-white">Stock</label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                  className="w-full px-5 py-3.5 text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                />
              </div>

              {/* Offer Section */}
              <div className="flex flex-col gap-6 md:col-span-2">
                <div className="flex items-center gap-3 p-4 border border-blue-100 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-900/20 rounded-2xl">
                  <div className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="offer-toggle"
                      checked={newProduct.offer}
                      onChange={(e) => setNewProduct(p => ({ ...p, offer: e.target.checked, discountPercentage: e.target.checked ? p.discountPercentage : "" }))}
                      className="hidden"
                    />
                    <label
                      htmlFor="offer-toggle"
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${newProduct.offer ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <motion.div
                        animate={{ x: newProduct.offer ? 26 : 2 }}
                        className="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className={`w-4 h-4 ${newProduct.offer ? 'text-blue-600' : 'text-gray-400'}`} />
                      <label htmlFor="offer-toggle" className="font-semibold text-gray-900 cursor-pointer dark:text-white">
                        Special Offer
                      </label>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Enable discount for this product</p>
                  </div>

                  <AnimatePresence>
                    {newProduct.offer && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3"
                      >
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            value={newProduct.discountPercentage}
                            onChange={(e) => setNewProduct(p => ({ ...p, discountPercentage: e.target.value }))}
                            className="w-24 px-4 py-2 text-right text-blue-600 border border-blue-200 font-bold dark:bg-gray-800 dark:border-blue-900/30 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                          />
                          <span className="absolute transform -translate-y-1/2 left-3 top-1/2 text-blue-600/50">%</span>
                        </div>
                        <span className="font-bold text-blue-600">OFF</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Category Selection Grid */}
            {!newProduct.category && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-8"
              >
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Select Category
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewProduct(p => ({ ...p, category: cat.id, subCategory: "" }))}
                      className="p-4 transition-all duration-300 bg-white border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 dark:bg-gray-800 group"
                    >
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-3`}>
                        {cat.icon}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Selected Category Display */}
            {newProduct.category && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Selected Category
                  </h3>
                  <button
                    type="button"
                    onClick={() => setNewProduct(p => ({ ...p, category: "", subCategory: "" }))}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Change
                  </button>
                </div>
                {(() => {
                  const cat = getCategoryById(newProduct.category);
                  return cat ? (
                    <div className="flex items-center gap-4 p-4 border border-gray-200 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 rounded-2xl">
                      <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl`}>
                        {cat.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{cat.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">All products in this category</p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </motion.div>
            )}

            {/* Sub-Category Selection Grid */}
            {newProduct.category && !newProduct.subCategory && (() => {
              const cat = getCategoryById(newProduct.category);
              // If the category has grouped sub-categories (e.g. fan), show grouped layout
              if (cat?.subCategoryGroups) {
                return (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-8"
                  >
                    <h3 className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      Select Sub-Category
                    </h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {cat.subCategoryGroups.map((group) => (
                        <div key={group.group} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <div className="bg-red-600 px-4 py-2">
                            <p className="font-bold text-white text-sm">{group.group}</p>
                          </div>
                          <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {group.items.map((sub) => (
                              <motion.button
                                key={sub}
                                type="button"
                                whileHover={{ backgroundColor: "#fef2f2" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setNewProduct(p => ({ ...p, subCategory: sub }))}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors dark:bg-gray-800"
                              >
                                {sub}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              }
              // Default flat grid layout for other categories
              return (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-8"
                >
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Select Sub-Category
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {cat?.subCategories.map((sub) => (
                      <motion.button
                        key={sub}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNewProduct(p => ({ ...p, subCategory: sub }))}
                        className="p-4 transition-all duration-300 bg-white border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 dark:bg-gray-800 group"
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{sub}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              );
            })()}

            {/* Selected Sub-Category Display */}
            {newProduct.subCategory && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Selected Sub-Category
                  </h3>
                  <button
                    type="button"
                    onClick={() => setNewProduct(p => ({ ...p, subCategory: "" }))}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center gap-4 p-4 border border-gray-200 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 rounded-2xl">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white`}>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{newProduct.subCategory}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Specific item type</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Image Upload */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900/30 dark:to-rose-800/30 rounded-xl">
                  <Image className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Image
                </label>
              </div>

              {!newProduct.image ? (
                <div className="p-12 text-center transition-all duration-300 border-gray-300 border-dashed border-3 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30">
                    <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Drag & Drop or Click to Upload
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                    <button
                      type="button"
                      onClick={handleBrowseFilesClick}
                      className="inline-flex items-center gap-2 px-6 py-3 mt-4 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700"
                    >
                      Browse Files
                    </button>
                  </div>
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-700"
                >
                  <div className="absolute z-10 top-4 right-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={removeImage}
                      className="p-3 text-white shadow-lg bg-gradient-to-br from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Image Preview</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Click remove to change image</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                            initial={{ width: "0%" }}
                            animate={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {uploadProgress}%
                        </span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        className="object-cover w-full h-64 shadow-lg rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Section */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 rounded-xl">
                    <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Secure & Verified</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your data is protected with encryption</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={isEditing ? onCancel : () => setNewProduct({
                      name: "",
                      price: "",
                      category: "",
                      brand: "",
                      image: "",
                      stock: "10",
                    })}
                    className="px-8 py-3.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    {isEditing ? "Cancel Edit" : "Reset Form"}
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="relative px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                  >
                    <div className="absolute inset-0 w-full h-full transition-transform duration-500 translate-y-full bg-gradient-to-r from-blue-700 to-indigo-700 group-hover:translate-y-0" />
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Adding Product...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-5 h-5" />
                          <span>{isEditing ? "Update Product" : "Publish Product"}</span>
                          <TrendingUp className="w-4 h-4" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div >
  );
};

export default CreateProductForm;