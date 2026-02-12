import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";

const AddInquiry = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isEditMode = Boolean(id);
    const { token, user } = useAuth();

    const [formData, setFormData] = useState({
        sourceType: "lead",
        sourceId: "",
        sourceName: "",
        contactPerson: "",
        email: "",
        mobile: "",
        vehicleType: "",
        requirementType: "",
        showroomRequired: false,
        serviceCenterRequired: false,
        modelInterested: "",
        variant: "",
        quantity: 1,
        expectedDeliveryDate: "",
        status: "New",
        assignedTo: "",
        createdBy: "",
        notes: "",
    });
    const [leads, setLeads] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showLeadSuggestions, setShowLeadSuggestions] = useState(false);
    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const sourceTypeParam = searchParams.get("sourceType");
    const sourceIdParam = searchParams.get("sourceId");

    const loadSources = async () => {
        try {
            const [leadResponse, customerResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/api/leads`, { headers: authHeaders }),
                fetch(`${API_BASE_URL}/api/customers`, { headers: authHeaders }),
            ]);
            const [leadData, customerData] = await Promise.all([
                leadResponse.ok ? leadResponse.json() : [],
                customerResponse.ok ? customerResponse.json() : [],
            ]);
            setLeads(leadData || []);
            setCustomers(customerData || []);
        } catch {
            setLeads([]);
            setCustomers([]);
        }
    };

    const loadEmployees = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load employees");
            const data = await response.json();
            const staff = (data || []).filter((item) => (item.type || "").toLowerCase() !== "lead");
            setEmployees(staff);
        } catch {
            setEmployees([]);
        }
    };

    const fetchInquiry = async () => {
        const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, { headers: authHeaders });
        if (!response.ok) throw new Error("Failed to load inquiry");
        return response.json();
    };

    const fetchSourceDetail = async (type, sourceId) => {
        const url = type === "customer"
            ? `${API_BASE_URL}/api/customers/${sourceId}`
            : `${API_BASE_URL}/api/leads/${sourceId}`;
        const response = await fetch(url, { headers: authHeaders });
        if (!response.ok) throw new Error("Failed to load source details");
        return response.json();
    };

    useEffect(() => {
        loadSources();
        loadEmployees();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            const loadInquiry = async () => {
                try {
                    setLoading(true);
                    const data = await fetchInquiry();
                    setFormData({
                        sourceType: data.sourceType || "lead",
                        sourceId: data.sourceId || "",
                        sourceName: data.sourceName || "",
                        contactPerson: data.contactPerson || "",
                        email: data.email || "",
                        mobile: data.mobile || "",
                        vehicleType: data.vehicleType || "",
                        requirementType: data.requirementType || "",
                        showroomRequired: Boolean(data.showroomRequired),
                        serviceCenterRequired: Boolean(data.serviceCenterRequired),
                        modelInterested: data.modelInterested || "",
                        variant: data.variant || "",
                        quantity: data.quantity || 1,
                        expectedDeliveryDate: data.expectedDeliveryDate ? data.expectedDeliveryDate.split("T")[0] : "",
                        status: data.status || "New",
                        assignedTo: data.assignedTo || "",
                        createdBy: data.createdBy || "",
                        notes: data.notes || "",
                    });
                    setError("");
                } catch (err) {
                    setError(err.message || "Unable to load inquiry");
                } finally {
                    setLoading(false);
                }
            };
            loadInquiry();
            return;
        }

        if (sourceTypeParam && sourceIdParam) {
            const loadFromSource = async () => {
                try {
                    const source = await fetchSourceDetail(sourceTypeParam, sourceIdParam);
                    setFormData((prev) => ({
                        ...prev,
                        sourceType: sourceTypeParam,
                        sourceId: sourceIdParam,
                        sourceName: source.name || "",
                        contactPerson: source.contactPerson || source.name || "",
                        email: source.email || "",
                        mobile: source.mobile || "",
                    }));
                } catch {
                    // ignore
                }
            };
            loadFromSource();
        }
    }, [id, isEditMode, sourceIdParam, sourceTypeParam]);

    useEffect(() => {
        if (user?.name) {
            setFormData((prev) => ({
                ...prev,
                createdBy: prev.createdBy || user.name,
            }));
        }
    }, [user]);

    const sourceOptions = useMemo(() => {
        return formData.sourceType === "customer" ? customers : leads;
    }, [formData.sourceType, customers, leads]);

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
                expectedDeliveryDate: formData.expectedDeliveryDate
                    ? new Date(formData.expectedDeliveryDate).toISOString()
                    : null,
                quantity: Number(formData.quantity) || 1,
            };

            const response = await fetch(
                isEditMode ? `${API_BASE_URL}/api/inquiries/${id}` : `${API_BASE_URL}/api/inquiries`,
                {
                    method: isEditMode ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json", ...authHeaders },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to save inquiry");
            }
            navigate("/inquiries");
        } catch (err) {
            setError(err.message || "Unable to save inquiry");
        } finally {
            setSubmitting(false);
        }
    };

    const sourceLocked = Boolean(sourceTypeParam && sourceIdParam && !isEditMode);

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">{isEditMode ? "Edit Inquiry" : "Add Inquiry"}</h1>
                    <p className="text-muted mb-0">Capture showroom and service interest</p>
                </div>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/inquiries")}>
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
                                <label className="form-label">Source Type</label>
                                <select
                                    name="sourceType"
                                    className="form-select"
                                    value={formData.sourceType}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setSearchTerm("");
                                        setShowLeadSuggestions(false);
                                    }}
                                    disabled={sourceLocked}
                                >
                                    <option value="lead">Lead</option>
                                    <option value="customer">Customer</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-8">
                                <label className="form-label">Source</label>
                                {formData.sourceType === "lead" ? (
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search leads by name, email or mobile..."
                                            value={searchTerm || formData.sourceName}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setShowLeadSuggestions(true);
                                            }}
                                            onFocus={() => setShowLeadSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowLeadSuggestions(false), 200)}
                                            disabled={sourceLocked}
                                            required={!formData.sourceId}
                                        />
                                        {showLeadSuggestions && searchTerm && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "100%",
                                                    left: 0,
                                                    right: 0,
                                                    backgroundColor: "white",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "4px",
                                                    maxHeight: "200px",
                                                    overflowY: "auto",
                                                    zIndex: 1000,
                                                }}
                                            >
                                                {leads
                                                    .filter((lead) =>
                                                        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        lead.mobile?.includes(searchTerm)
                                                    )
                                                    .slice(0, 10)
                                                    .map((lead) => (
                                                        <div
                                                            key={lead._id}
                                                            onClick={() => {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    sourceId: lead._id,
                                                                    sourceName: lead.name || "",
                                                                    contactPerson: lead.contactPerson || lead.name || "",
                                                                    email: lead.email || "",
                                                                    mobile: lead.mobile || "",
                                                                }));
                                                                setSearchTerm("");
                                                                setShowLeadSuggestions(false);
                                                            }}
                                                            style={{
                                                                padding: "8px 12px",
                                                                cursor: "pointer",
                                                                borderBottom: "1px solid #f0f0f0",
                                                                fontSize: "0.9rem",
                                                            }}
                                                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                                                            onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                                                        >
                                                            <div>
                                                                <strong>{lead.name}</strong>
                                                            </div>
                                                            <small style={{ color: "#666" }}>
                                                                {lead.email} | {lead.mobile}
                                                            </small>
                                                        </div>
                                                    ))}
                                                {leads.filter((lead) =>
                                                    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    lead.mobile?.includes(searchTerm)
                                                ).length === 0 && (
                                                    <div style={{ padding: "8px 12px", color: "#999" }}>
                                                        No leads found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {formData.sourceId && !showLeadSuggestions && (
                                            <small style={{ display: "block", marginTop: "4px", color: "#666" }}>
                                                Selected: {formData.sourceName}
                                            </small>
                                        )}
                                    </div>
                                ) : (
                                    <select
                                        name="sourceId"
                                        className="form-select"
                                        value={formData.sourceId}
                                        onChange={(e) => {
                                            const selected = customers.find((item) => item._id === e.target.value);
                                            setFormData((prev) => ({
                                                ...prev,
                                                sourceId: e.target.value,
                                                sourceName: selected?.name || "",
                                                contactPerson: selected?.contactPerson || selected?.name || "",
                                                email: selected?.email || "",
                                                mobile: selected?.mobile || "",
                                            }));
                                        }}
                                        disabled={sourceLocked}
                                        required
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map((item) => (
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="col-12 col-md-4">
                                <label className="form-label">Contact Person</label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    className="form-control"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Mobile</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    className="form-control"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
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
                                <label className="form-label">Requirement</label>
                                <select
                                    name="requirementType"
                                    className="form-select"
                                    value={formData.requirementType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Vehicle">Vehicle</option>
                                    <option value="Service">Service</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Expected Delivery</label>
                                <input
                                    type="date"
                                    name="expectedDeliveryDate"
                                    className="form-control"
                                    value={formData.expectedDeliveryDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <label className="form-label">Model Interested</label>
                                <input
                                    type="text"
                                    name="modelInterested"
                                    className="form-control"
                                    value={formData.modelInterested}
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
                                <label className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    className="form-control"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">Assigned To</label>
                                <select
                                    name="assignedTo"
                                    className="form-select"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    {employees.map((employee) => (
                                        <option key={employee._id} value={employee._id}>{employee.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label">Status</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="New">New</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Lost">Lost</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="showroomRequired"
                                        name="showroomRequired"
                                        checked={formData.showroomRequired}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="showroomRequired">
                                        Showroom Required
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="serviceCenterRequired"
                                        name="serviceCenterRequired"
                                        checked={formData.serviceCenterRequired}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="serviceCenterRequired">
                                        Service Center Required
                                    </label>
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Notes</label>
                                <textarea
                                    name="notes"
                                    className="form-control"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12 d-flex gap-2">
                                <button className="btn btn-primary" type="submit" disabled={submitting}>
                                    {submitting ? "Saving..." : "Save Inquiry"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate("/inquiries")}
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

export default AddInquiry;
