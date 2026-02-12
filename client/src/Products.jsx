import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";

const Products = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/products`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load products");
            const data = await response.json();
            setProducts(data || []);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        const ok = window.confirm("Delete this product?");
        if (!ok) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            if (!response.ok) throw new Error("Failed to delete product");
            fetchProducts();
        } catch (err) {
            setError(err.message || "Unable to delete product");
        }
    };

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Products</h1>
                    <p className="text-muted mb-0">Catalog for vehicles, services, and parts</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/add-product")}>
                    + Add Product
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Vehicle Type</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center text-muted py-4">Loading products...</td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center text-muted py-4">No products found.</td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                <strong>{product.name}</strong>
                                                {product.model && <div className="text-muted small">{product.model}</div>}
                                            </td>
                                            <td>{product.category || "-"}</td>
                                            <td>{product.vehicleType || "-"}</td>
                                            <td>{product.unitPrice || 0}</td>
                                            <td>{product.stockQty || 0}</td>
                                            <td>
                                                <span className={`badge ${product.isActive ? "text-bg-success" : "text-bg-secondary"}`}>
                                                    {product.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => navigate(`/edit-product/${product._id}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(product._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
