/**
 * KoreVane™ - Platform Organizations Management View
 */
(function(window) {
  'use strict';

  function OrganizationsView({ showToast, onManageAdmin }) {
    const [organizations, setOrganizations] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editingOrg, setEditingOrg] = React.useState(null);
    const [name, setName] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    const Icons = window.KoreVaneIcons;
    const API = window.KoreVaneAPI;

    const loadOrganizations = async () => {
      try {
        setLoading(true);
        const data = await API.getOrganizations();
        setOrganizations(data || []);
      } catch (err) {
        showToast(err.message || "Failed to load organizations.", "error");
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      loadOrganizations();
    }, []);

    const openCreateModal = () => {
      setEditingOrg(null);
      setName("");
      setSlug("");
      setModalOpen(true);
    };

    const openEditModal = (org) => {
      setEditingOrg(org);
      setName(org.name);
      setSlug(org.slug);
      setModalOpen(true);
    };

    const handleSave = async (e) => {
      e.preventDefault();
      if (!name || !slug) {
        showToast("Both name and slug are required.", "error");
        return;
      }
      setSubmitting(true);
      try {
        if (editingOrg) {
          await API.updateOrganization(editingOrg.id, name, slug);
          showToast(`Organization "${name}" updated successfully.`, "success");
        } else {
          await API.createOrganization(name, slug);
          showToast(`Organization "${name}" created successfully.`, "success");
        }
        setModalOpen(false);
        loadOrganizations();
      } catch (err) {
        showToast(err.message || "Failed to save organization.", "error");
      } finally {
        setSubmitting(false);
      }
    };

    const handleToggleStatus = async (org) => {
      const newStatus = org.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      try {
        await API.changeOrgStatus(org.id, newStatus);
        showToast(`Organization "${org.name}" status changed to ${newStatus}.`, "success");
        loadOrganizations();
      } catch (err) {
        showToast(err.message || "Status change failed.", "error");
      }
    };

    const handleDelete = async (org) => {
      if (!confirm(`Are you sure you want to permanently delete "${org.name}"?`)) return;
      try {
        await API.deleteOrganization(org.id);
        showToast(`Organization "${org.name}" deleted.`, "success");
        loadOrganizations();
      } catch (err) {
        showToast(err.message || "Failed to delete organization.", "error");
      }
    };

    const filtered = organizations.filter(
      (o) =>
        (o.name && o.name.toLowerCase().includes(search.toLowerCase())) ||
        (o.slug && o.slug.toLowerCase().includes(search.toLowerCase()))
    );

    return (
      <div className="view-container">
        {/* View Header */}
        <div className="view-header-bar">
          <div>
            <h2 className="view-title">Tenant Organizations</h2>
            <p className="view-subtitle">Manage multi-tenant isolation, domains, and administrative scopes</p>
          </div>
          <div className="view-actions-group">
            <button className="btn btn-secondary" onClick={loadOrganizations} title="Refresh Organizations">
              <Icons.Refresh /> Refresh
            </button>
            <button className="btn btn-primary btn-shine" onClick={openCreateModal}>
              <Icons.Plus /> New Organization
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-search-card">
          <div className="input-with-icon search-input-box">
            <span className="input-icon"><Icons.Search /></span>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="stats-pill-group">
            <span className="stats-pill">Total: {organizations.length}</span>
            <span className="stats-pill text-success">
              Active: {organizations.filter((o) => o.status === "ACTIVE").length}
            </span>
          </div>
        </div>

        {/* Table View */}
        <div className="data-table-card">
          {loading ? (
            <div className="table-loading-state">
              <div className="spinner-glow"></div>
              <span>Loading organizations...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="table-empty-state">
              <Icons.Building />
              <p>No tenant organizations found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="kore-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Slug Domain</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((org) => (
                    <tr key={org.id}>
                      <td className="font-mono text-muted">#{org.id}</td>
                      <td className="font-medium text-primary">{org.name}</td>
                      <td>
                        <span className="domain-slug-badge">/{org.slug}</span>
                      </td>
                      <td>
                        <span
                          className={`status-chip ${
                            org.status === "ACTIVE" ? "chip-active" : "chip-suspended"
                          }`}
                        >
                          {org.status}
                        </span>
                      </td>
                      <td className="text-muted text-sm">
                        {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="text-right">
                        <div className="table-action-row">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => onManageAdmin(org)}
                            title="Manage Tenant Admin User"
                          >
                            <Icons.Users /> Admin
                          </button>
                          <button
                            className={`btn btn-sm ${
                              org.status === "ACTIVE" ? "btn-warning" : "btn-secondary"
                            }`}
                            onClick={() => handleToggleStatus(org)}
                            title={org.status === "ACTIVE" ? "Suspend Organization" : "Activate Organization"}
                          >
                            {org.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => openEditModal(org)}
                            title="Edit Organization"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger-ghost btn-sm"
                            onClick={() => handleDelete(org)}
                            title="Delete Organization"
                          >
                            <Icons.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {modalOpen && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <div className="modal-header">
                <h3>{editingOrg ? "Edit Organization" : "Create New Organization"}</h3>
                <button className="modal-close" onClick={() => setModalOpen(false)}>
                  <Icons.X />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Organization Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Acme Corporation"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!editingOrg) {
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Slug Domain</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="e.g. acme-corp"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      required
                    />
                    <small className="form-hint">Used as URL namespace prefix for this tenant's API routes.</small>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Saving..." : editingOrg ? "Update Organization" : "Create Organization"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  window.KoreVaneOrganizationsView = OrganizationsView;
})(window);
