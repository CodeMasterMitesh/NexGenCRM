import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddLead.css";

const AddLead = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        company: "",
        jobTitle: "",
        source: "Website",
        status: "New",
        owner: "",
        expectedValue: "",
        notes: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New lead data:", formData);
        alert("Lead added successfully!");
        navigate("/leads");
    };

    return (
        <div className="add-lead-page container-fluid py-4">
            <div className="form-header">
                <h1 className="mb-1">Add New Lead</h1>
                <p className="text-muted">Create a new lead record</p>
            </div>

            <div className="form-container card border-0 shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="lead-form">
                        <div className="row g-4">
                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="form-control"
                                    placeholder="Enter lead full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="mobile" className="form-label">Mobile Number</label>
                                <input
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    className="form-control"
                                    placeholder="Enter mobile number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="company" className="form-label">Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    className="form-control"
                                    placeholder="Enter company name"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="jobTitle" className="form-label">Job Title</label>
                                <input
                                    type="text"
                                    id="jobTitle"
                                    name="jobTitle"
                                    className="form-control"
                                    placeholder="Enter job title"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="source" className="form-label">Lead Source</label>
                                <select
                                    id="source"
                                    name="source"
                                    className="form-select"
                                    value={formData.source}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Website">Website</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Cold Call">Cold Call</option>
                                    <option value="Event">Event</option>
                                </select>
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Lost">Lost</option>
                                </select>
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="owner" className="form-label">Lead Owner</label>
                                <input
                                    type="text"
                                    id="owner"
                                    name="owner"
                                    className="form-control"
                                    placeholder="Assign lead owner"
                                    value={formData.owner}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="expectedValue" className="form-label">Expected Value (₹)</label>
                                <input
                                    type="number"
                                    id="expectedValue"
                                    name="expectedValue"
                                    className="form-control"
                                    placeholder="Enter expected value"
                                    value={formData.expectedValue}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <label htmlFor="notes" className="form-label">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    className="form-control"
                                    placeholder="Add notes about the lead"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                            <button type="submit" className="btn btn-primary px-4">
                                Add Lead
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                onClick={() => navigate("/leads")}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddLead;
