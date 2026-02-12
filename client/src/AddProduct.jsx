import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";

const AddProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "Vehicle",
        vehicleType: "",
        brand: "",
        model: "",
        variant: "",
        unitPrice: "",
        taxRate: "",
        stockQty: "",
        unit: "",
        description: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        if (!isEditMode) return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/products/${id}`, { headers: authHeaders });
                if (!response.ok) throw new Error("Failed to load product");
                const data = await response.json();
                setFormData({
                    name: data.name || "",
                    sku: data.sku || "",
                    category: data.category || "Vehicle",
                    vehicleType: data.vehicleType || "",
                    brand: data.brand || "",
                    model: data.model || "",
                    variant: data.variant || "",
                    unitPrice: data.unitPrice ?? "",
                    taxRate: data.taxRate ?? "",
                    stockQty: data.stockQty ?? "",
                    unit: data.unit || "",
                    description: data.description || "",
                    isActive: data.isActive !== false,
                });
                setError("");
            } catch (err) {
                setError(err.message || "Unable to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, isEditMode, token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError("");

            const payload = {
                ...formData,
                unitPrice: formData.unitPrice === "" ? 0 : Number(formData.unitPrice),
                taxRate: formData.taxRate === "" ? 0 : Number(formData.taxRate),
                stockQty: formData.stockQty === "" ? 0 : Number(formData.stockQty),
            };

            const response = await fetch(
                isEditMode ? `${API_BASE_URL}/api/products/${id}` : `${API_BASE_URL}/api/products`,
                {
                    method: isEditMode ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json", ...authHeaders },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to save product");
            }
            navigate("/products");
        } catch (err) {
            setError(err.message || "Unable to save product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="mb-1">{isEditMode ? "Edit Product" : "Add Product"}</h1>
                <p className="text-muted mb-0">Vehicle, service, or accessory catalog item</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center text-muted py-5">Loading...</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="row g-3">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="col-12 col-md-6">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label">SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    className="form-control"
                                    value={formData.sku}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Category</label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="Vehicle">Vehicle</option>
                                    <option value="Service">Service</option>
                                    <option value="Accessory">Accessory</option>
                                    <option value="Spare">Spare</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Vehicle Type</label>
                                <select
                                    name="vehicleType"
                                    className="form-select"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="2W">2W</option>
                                    <option value="4W">4W</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Unit</label>
                                <input
                                    type="text"
                                    name="unit"
                                    className="form-control"
                                    value={formData.unit}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    className="form-control"
                                    value={formData.brand}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Model</label>
                                <input
                                    type="text"
                                    name="model"
                                    className="form-control"
                                    value={formData.model}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Variant</label>
                                <input
                                    type="text"
                                    name="variant"
                                    className="form-control"
                                    value={formData.variant}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Unit Price</label>
                                <input
                                    type="number"
                                    name="unitPrice"
                                    className="form-control"
                                    value={formData.unitPrice}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Tax Rate (%)</label>
                                <input
                                    type="number"
                                    name="taxRate"
                                    className="form-control"
                                    value={formData.taxRate}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Stock Qty</label>
                                <input
                                    type="number"
                                    name="stockQty"
                                    className="form-control"
                                    value={formData.stockQty}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="isActive">
                                        Active
                                    </label>
                                </div>
                            </div>
                            <div className="col-12 d-flex gap-2">
                                <button className="btn btn-primary" type="submit" disabled={submitting}>
                                    {submitting ? "Saving..." : "Save Product"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate("/products")}
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

export default AddProduct;
