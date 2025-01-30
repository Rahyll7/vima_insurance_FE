// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const App = () => {
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    minPremium: "",
    maxPremium: "",
    policyType: "",
    minCoverage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllPolicies();
  }, []);

  const fetchAllPolicies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://vimainsurance-production.up.railway.app/get_policies"
      );
      setPolicies(response.data.data);
    } catch (err) {
      setError("Error fetching policies");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchAllPolicies();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://vimainsurance-production.up.railway.app/search_policies",
        { name: searchTerm }
      );
      setPolicies(response.data.data);
    } catch (err) {
      setError("Error searching for policies");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://vimainsurance-production.up.railway.app/filter_policies",
        {
          min_premium: newFilters.minPremium,
          max_premium: newFilters.maxPremium,
          type: newFilters.policyType,
          min_coverage: newFilters.minCoverage,
          sort: sortOrder
        }
      );
      setPolicies(response.data.data);
    } catch (err) {
      setError("Error applying filters");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://vimainsurance-production.up.railway.app/filter_policies",
        {
          min_premium: filters.minPremium,
          max_premium: filters.maxPremium,
          type: filters.policyType,
          min_coverage: filters.minCoverage,
          sort: newSortOrder
        }
      );
      setPolicies(response.data.data);
    } catch (err) {
      setError("Error sorting policies");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilters({
      minPremium: "",
      maxPremium: "",
      policyType: "",
      minCoverage: "",
    });
    setSortOrder("asc");
    fetchAllPolicies();
  };

  return (
    <div className="container">
      <h1>Insurance Policies</h1>
      
      <form onSubmit={handleSearchSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Search policies by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
        <button type="button" className="reset-button" onClick={handleReset}>
          Reset All
        </button>
      </form>

      <div className="filter-container">
        <h3>Filter Policies</h3>
        <div className="filter-grid">
          <div className="filter-item">
            <label>Min Premium</label>
            <input
              type="number"
              name="minPremium"
              value={filters.minPremium}
              onChange={handleFilterChange}
              placeholder="Enter minimum premium"
            />
          </div>
          <div className="filter-item">
            <label>Max Premium</label>
            <input
              type="number"
              name="maxPremium"
              value={filters.maxPremium}
              onChange={handleFilterChange}
              placeholder="Enter maximum premium"
            />
          </div>
          <div className="filter-item">
            <label>Policy Type</label>
            <input
              type="text"
              name="policyType"
              value={filters.policyType}
              onChange={handleFilterChange}
              placeholder="Enter policy type"
            />
          </div>
          <div className="filter-item">
            <label>Min Coverage</label>
            <input
              type="number"
              name="minCoverage"
              value={filters.minCoverage}
              onChange={handleFilterChange}
              placeholder="Enter minimum coverage"
            />
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      
      <div className="table-container">
        {policies.length === 0 ? (
          <div className="info-message">No policies found based on your criteria.</div>
        ) : (
          <div>
            <div className="sort-container">
              <button onClick={handleSort} className="sort-button">
                Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
              </button>
              <span className="sort-label">
                Currently: {sortOrder === "asc" ? "Ascending" : "Descending"} Order
              </span>
            </div>
            <table className="policy-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Premium</th>
                  <th>Coverage</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy, index) => (
                  <tr key={index}>
                    <td>{policy.name}</td>
                    <td>{policy.type}</td>
                    <td>Rs.{policy.premium.toLocaleString()}</td>
                    <td>Rs.{policy.coverage.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;