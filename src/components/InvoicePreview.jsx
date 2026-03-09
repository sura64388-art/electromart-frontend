import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, Loader2 } from "lucide-react";

const InvoicePreview = forwardRef(({ order, className, label = "Download Draft PDF", customIcon: CustomIcon, showButton = true }, ref) => {
    const invoiceRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!invoiceRef.current) return;
        setIsGenerating(true);

        try {
            const element = invoiceRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 794, // A4 width in px at 96dpi (approx)
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Invoice_${order._id.slice(-6).toUpperCase()}.pdf`);
            return true;
        } catch (error) {
            console.error("Error generating PDF:", error);
            return false;
        } finally {
            setIsGenerating(false);
        }
    };

    useImperativeHandle(ref, () => ({
        download: handleDownload
    }));

    if (!order) return null;

    return (
        <>
            {showButton && (
                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className={className || "flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"}
                >
                    {isGenerating ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : CustomIcon ? (
                        <CustomIcon size={18} />
                    ) : (
                        <Download size={18} />
                    )}
                    <span>{label}</span>
                </button>
            )}

            {/* Hidden Invoice Template - Refined Gold Bar Design */}
            <div style={{ position: "fixed", top: 0, left: "-9999px", width: "794px", height: "auto", overflow: "visible", zIndex: -50 }}>
                <div
                    ref={invoiceRef}
                    className="font-sans relative"
                    style={{
                        width: "794px",
                        minHeight: "1123px", // A4 Height
                        backgroundColor: "#ffffff",
                        color: "#111827",
                        boxSizing: "border-box"
                    }}
                >
                    {/* Header Section */}
                    {/* Dark Bar */}
                    <div
                        style={{
                            width: "100%",
                            height: "200px",
                            backgroundColor: "#38372B",
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "40px", // Align with body margin
                            paddingRight: "40px",
                            position: "relative"
                        }}
                    >
                        {/* Company Info */}
                        <div style={{ zIndex: 10 }}>
                            <h1 style={{ color: "#ffffff", fontSize: "32px", fontWeight: "800", letterSpacing: "1px", marginBottom: "8px", textTransform: "uppercase" }}>
                                Sree Saravana Electricals
                            </h1>
                            <div style={{ color: "#e5e7eb", fontSize: "14px", lineHeight: "1.6", fontWeight: "300" }}>
                                37, Tirupur Towers, 4th St Stanes Rd,<br />
                                KNP Puram, Odakkadu, Tiruppur,<br />
                                Tamil Nadu - 641602<br />
                                Contact: 98432 67999
                            </div>
                        </div>

                        {/* Gold Vertical Bar - Aligned to Right Margin */}
                        <div
                            style={{
                                position: "absolute",
                                top: "0",
                                right: "40px", // Aligned with right margin
                                width: "80px",
                                height: "260px", // Extends below header
                                backgroundColor: "#C5A059",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "center",
                                paddingBottom: "40px",
                                zIndex: 20
                            }}
                        >
                            <h2
                                style={{
                                    color: "#ffffff",
                                    fontSize: "32px",
                                    fontFamily: "serif",
                                    fontStyle: "italic",
                                    letterSpacing: "3px",
                                    transform: "rotate(-90deg)",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Invoice
                            </h2>
                        </div>
                    </div>

                    {/* Main Content Body */}
                    <div style={{ padding: "80px 40px 40px 40px" }}> {/* Top padding accounts for Gold Bar overlap */}

                        {/* Order Info & Bill To */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                            {/* Left: Bill To */}
                            <div style={{ width: "50%" }}>
                                <h3 style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                                    Bill To
                                </h3>
                                <div>
                                    <p style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "6px", textTransform: "uppercase" }}>
                                        {order.deliveryAddress?.fullName || order.user?.name || "Customer Name"}
                                    </p>
                                    <div style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.5" }}>
                                        <p>{order.deliveryAddress?.street}</p>
                                        <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
                                        <p style={{ marginTop: "4px" }}>Phone: {order.deliveryAddress?.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Invoice Data */}
                            <div style={{ width: "40%", textAlign: "right" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: "4px 0", fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Invoice No.</td>
                                            <td style={{ padding: "4px 0", fontSize: "14px", color: "#111827", fontWeight: "700" }}>#{order._id.slice(-6).toUpperCase()}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "4px 0", fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Issue Date</td>
                                            <td style={{ padding: "4px 0", fontSize: "14px", color: "#111827", fontWeight: "600" }}>
                                                {new Date(order.createdAt || new Date()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: "4px 0", fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Due Date</td>
                                            <td style={{ padding: "4px 0", fontSize: "14px", color: "#111827", fontWeight: "600" }}>
                                                {new Date(new Date(order.createdAt || new Date()).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" style={{ paddingTop: "12px", paddingBottom: "4px" }}>
                                                <div style={{ fontSize: "12px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>Total Amount Due</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">
                                                <div style={{ fontSize: "28px", color: "#C5A059", fontWeight: "800" }}>
                                                    ₹{(order.totalAmount + (order.shippingCost || 0) + (order.taxAmount || 0) - (order.discountAmount || 0)).toFixed(2)}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ width: "100%", height: "1px", backgroundColor: "#e5e7eb", marginBottom: "40px" }}></div>

                        {/* Items Table */}
                        <div style={{ marginBottom: "40px" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#C5A059", color: "#ffffff", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        <th style={{ padding: "12px 16px", textAlign: "left", width: "45%", fontWeight: "600" }}>Service / Item</th>
                                        <th style={{ padding: "12px 16px", textAlign: "center", width: "15%", fontWeight: "600" }}>Quantity</th>
                                        <th style={{ padding: "12px 16px", textAlign: "right", width: "20%", fontWeight: "600" }}>Price</th>
                                        <th style={{ padding: "12px 16px", textAlign: "right", width: "20%", fontWeight: "600" }}>Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.products.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                            <td style={{ padding: "16px", verticalAlign: "top" }}>
                                                <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                                                    {item.product?.name || "Product"}
                                                </div>
                                                {item.size && (
                                                    <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                                                        Size: {item.size}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: "16px", textAlign: "center", verticalAlign: "top", fontSize: "14px", color: "#6b7280" }}>
                                                {item.quantity}
                                            </td>
                                            <td style={{ padding: "16px", textAlign: "right", verticalAlign: "top", fontSize: "14px", color: "#111827" }}>
                                                ₹{item.price.toFixed(2)}
                                            </td>
                                            <td style={{ padding: "16px", textAlign: "right", verticalAlign: "top", fontSize: "14px", fontWeight: "700", color: "#111827" }}>
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "60px" }}>
                            <div style={{ width: "45%", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "24px", border: "1px solid #f3f4f6" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", color: "#4b5563" }}>
                                    <span>Subtotal</span>
                                    <span style={{ fontWeight: "600", color: "#111827" }}>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                                {order.shippingCost > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", color: "#4b5563" }}>
                                        <span>Shipping</span>
                                        <span>₹{order.shippingCost.toFixed(2)}</span>
                                    </div>
                                )}
                                {order.taxAmount > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", color: "#4b5563" }}>
                                        <span>GST (18%)</span>
                                        <span>₹{order.taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {order.discountAmount > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", color: "#16a34a" }}>
                                        <span>Discount</span>
                                        <span>-₹{order.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div style={{ width: "100%", height: "1px", backgroundColor: "#d1d5db", margin: "16px 0" }}></div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#38372B" }}>Total Due</span>
                                    <span style={{ fontSize: "20px", fontWeight: "800", color: "#C5A059" }}>
                                        ₹{(order.totalAmount + (order.shippingCost || 0) + (order.taxAmount || 0) - (order.discountAmount || 0)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer Section */}
                    <div style={{ position: "absolute", bottom: "0", left: "0", width: "100%" }}>
                        <div style={{ padding: "0 40px 24px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div style={{ width: "60%" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#38372B", textTransform: "uppercase", marginBottom: "8px" }}>Notes:</p>
                                <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.5" }}>
                                    Thank you for investing in quality. Please contact us for warranty-related queries.
                                    Payments are due within the specified timeframe.
                                </p>
                            </div>
                            <div style={{ width: "35%", textAlign: "right" }}> {/* Adjusted width and alignment */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}> {/* Stack items right-aligned */}
                                    <div style={{ fontFamily: "serif", fontStyle: "italic", fontSize: "18px", color: "#4b5563", marginBottom: "8px", marginRight: "20px" }}>Sree Saravana Electricals</div>
                                    <div style={{ width: "200px", height: "1px", backgroundColor: "#9ca3af", marginBottom: "8px" }}></div>
                                    <div style={{ width: "200px", textAlign: "center", fontSize: "10px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>Authorized Signature</div>
                                </div>
                            </div>
                        </div>
                        {/* Bottom Stripe */}
                        <div style={{ width: "100%", height: "16px", backgroundColor: "#38372B" }}></div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default InvoicePreview;

