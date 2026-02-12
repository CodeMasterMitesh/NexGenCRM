import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";

const blankItem = () => ({
    productId: "",
    productName: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    taxRate: 0,
    discount: 0,
});

const AddProformaInvoice = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isEditMode = Boolean(id);
    const { token, user } = useAuth();

    const [formData, setFormData] = useState({
        quotationId: "",
        inquiryId: "",
        sourceType: "",
        sourceId: "",
        invoiceNumber: "",
        issueDate: "",
        dueDate: "",
        customerName: "",
        customerEmail: "",
        customerMobile: "",
        vehicleType: "",
        items: [blankItem()],
        status: "Draft",
        notes: "",
        createdBy: "",
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const quotationIdParam = searchParams.get("quotationId");

    const loadProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load products");
            const data = await response.json();
            setProducts(data || []);
        } catch {
            setProducts([]);
        }
    };

    const fetchQuotation = async () => {
        const response = await fetch(`${API_BASE_URL}/api/quotations/${quotationIdParam}`, { headers: authHeaders });
        if (!response.ok) throw new Error("Failed to load quotation");
        return response.json();
    };

    const fetchInvoice = async () => {
        const response = await fetch(`${API_BASE_URL}/api/proforma-invoices/${id}`, { headers: authHeaders });
        if (!response.ok) throw new Error("Failed to load proforma invoice");
        return response.json();
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            const loadInvoice = async () => {
                try {
                    setLoading(true);
                    const data = await fetchInvoice();
                    setFormData({
                        quotationId: data.quotationId || "",
                        inquiryId: data.inquiryId || "",
                        sourceType: data.sourceType || "",
                        sourceId: data.sourceId || "",
                        invoiceNumber: data.invoiceNumber || "",
                        issueDate: data.issueDate ? data.issueDate.split("T")[0] : "",
                        dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
                        customerName: data.customerName || "",
                        customerEmail: data.customerEmail || "",
                        customerMobile: data.customerMobile || "",
                        vehicleType: data.vehicleType || "",
                        items: data.items && data.items.length ? data.items : [blankItem()],
                        status: data.status || "Draft",
                        notes: data.notes || "",
                        createdBy: data.createdBy || "",
                    });
                    setError("");
                } catch (err) {
                    setError(err.message || "Unable to load proforma invoice");
                } finally {
                    setLoading(false);
                }
            };
            loadInvoice();
            return;
        }

        if (quotationIdParam) {
            const loadFromQuotation = async () => {
                try {
                    const quotation = await fetchQuotation();
                    setFormData((prev) => ({
                        ...prev,
                        quotationId: quotationIdParam,
                        inquiryId: quotation.inquiryId || "",
                        sourceType: quotation.sourceType || "",
                        sourceId: quotation.sourceId || "",
                        customerName: quotation.customerName || "",
                        customerEmail: quotation.customerEmail || "",
                        customerMobile: quotation.customerMobile || "",
                        vehicleType: quotation.vehicleType || "",
                        items: quotation.items && quotation.items.length ? quotation.items : [blankItem()],
                    }));
                } catch (err) {
                    setError(err.message || "Unable to load quotation");
                }
            };
            loadFromQuotation();
        }
    }, [id, isEditMode, quotationIdParam]);

    useEffect(() => {
        if (user?.name) {
            setFormData((prev) => ({
                ...prev,
                createdBy: prev.createdBy || user.name,
            }));
        }
    }, [user]);

    const totals = useMemo(() => {
        const subtotal = formData.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
        const discountTotal = formData.items.reduce((sum, item) => sum + (Number(item.discount) || 0), 0);
        const taxable = Math.max(subtotal - discountTotal, 0);
        const taxTotal = formData.items.reduce((sum, item) => {
            const lineSubtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
            const lineDiscount = Number(item.discount) || 0;
            const lineTaxable = Math.max(lineSubtotal - lineDiscount, 0);
            const rate = Number(item.taxRate) || 0;
            return sum + (lineTaxable * rate) / 100;
        }, 0);
        const grandTotal = taxable + taxTotal;
        return { subtotal, discountTotal, taxTotal, grandTotal };
    }, [formData.items]);

    const handleItemChange = (index, field, value) => {
        setFormData((prev) => {
            const updated = [...prev.items];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, items: updated };
        });
    };

    const handleProductSelect = (index, productId) => {
        const product = products.find((item) => item._id === productId);
        setFormData((prev) => {
            const updated = [...prev.items];
            updated[index] = {
                ...updated[index],
                productId,
                productName: product?.name || "",
                unitPrice: product?.unitPrice ?? 0,
                taxRate: product?.taxRate ?? 0,
                description: product?.description || "",
            };
            return { ...prev, items: updated };
        });
    };

    const addItem = () => {
        setFormData((prev) => ({ ...prev, items: [...prev.items, blankItem()] }));
    };

    const removeItem = (index) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((_, idx) => idx !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError("");

            const payload = {
                ...formData,
                items: formData.items.filter((item) => item.productName.trim()),
                subtotal: totals.subtotal,
                discountTotal: totals.discountTotal,
                taxTotal: totals.taxTotal,
                grandTotal: totals.grandTotal,
                issueDate: formData.issueDate ? new Date(formData.issueDate).toISOString() : null,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
            };

            const response = await fetch(
                isEditMode ? `${API_BASE_URL}/api/proforma-invoices/${id}` : `${API_BASE_URL}/api/proforma-invoices`,
                {
                    method: isEditMode ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json", ...authHeaders },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to save proforma invoice");
            }
            navigate("/proforma-invoices");
        } catch (err) {
            setError(err.message || "Unable to save proforma invoice");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">{isEditMode ? "Edit Proforma Invoice" : "Add Proforma Invoice"}</h1>
                    <p className="text-muted mb-0">Issue proforma invoice for dealers</p>
                </div>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/proforma-invoices")}>
                    Back
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center text-muted py-5">Loading...</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="row g-3">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="col-12 col-md-4">
                                <label className="form-label">Invoice Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.invoiceNumber}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Issue Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.issueDate}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: e.target.value }))}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Due Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <label className="form-label">Customer Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Customer Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.customerEmail}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Customer Mobile</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.customerMobile}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, customerMobile: e.target.value }))}
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <label className="form-label">Vehicle Type</label>
                                <select
                                    className="form-select"
                                    value={formData.vehicleType}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, vehicleType: e.target.value }))}
                                >
                                    <option value="">Select</option>
                                    <option value="2W">2W</option>
                                    <option value="4W">4W</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={formData.status}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Issued">Issued</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Items</label>
                                {formData.items.map((item, index) => (
                                    <div key={index} className="row g-2 align-items-end mb-2">
                                        <div className="col-12 col-md-3">
                                            <select
                                                className="form-select"
                                                value={item.productId}
                                                onChange={(e) => handleProductSelect(index, e.target.value)}
                                            >
                                                <option value="">Select product</option>
                                                {products.map((product) => (
                                                    <option key={product._id} value={product._id}>{product.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Product"
                                                value={item.productName}
                                                onChange={(e) => handleItemChange(index, "productName", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Qty"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Price"
                                                min="0"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Tax %"
                                                min="0"
                                                value={item.taxRate}
                                                onChange={(e) => handleItemChange(index, "taxRate", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-1">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => removeItem(index)}
                                                disabled={formData.items.length === 1}
                                            >
                                                X
                                            </button>
                                        </div>
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Description"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Discount"
                                                min="0"
                                                value={item.discount}
                                                onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-outline-primary" onClick={addItem}>
                                    + Add Item
                                </button>
                            </div>

                            <div className="col-12 col-md-3">
                                <label className="form-label">Subtotal</label>
                                <input className="form-control" value={totals.subtotal.toFixed(2)} readOnly />
                            </div>
                            <div className="col-12 col-md-3">
                                <label className="form-label">Discount</label>
                                <input className="form-control" value={totals.discountTotal.toFixed(2)} readOnly />
                            </div>
                            <div className="col-12 col-md-3">
                                <label className="form-label">Tax</label>
                                <input className="form-control" value={totals.taxTotal.toFixed(2)} readOnly />
                            </div>
                            <div className="col-12 col-md-3">
                                <label className="form-label">Grand Total</label>
                                <input className="form-control" value={totals.grandTotal.toFixed(2)} readOnly />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                                />
                            </div>

                            <div className="col-12 d-flex gap-2">
                                <button className="btn btn-primary" type="submit" disabled={submitting}>
                                    {submitting ? "Saving..." : "Save Proforma Invoice"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate("/proforma-invoices")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddProformaInvoice;
