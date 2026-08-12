import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/common/StatusBadge';
import { playerService } from '../../services/playerService';

export default function Players() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    year: '',
    status: ''
  });

  const positions = ['SETTER', 'OUTSIDE_HITTER', 'OPPOSITE', 'MIDDLE_BLOCKER', 'LIBERO'];
  const statuses = ['PENDING', 'SHORTLISTED', 'SELECTED', 'REJECTED'];

  useEffect(() => {
    fetchPlayers();
  }, [page, filters]);
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 20,
        ...(filters.search && { search: filters.search }),
        ...(filters.position && { position: filters.position }),
        ...(filters.year && { year: parseInt(filters.year) }),
        ...(filters.status && { status: filters.status })
      };

      const res = await playerService.getAllPlayers(params);
      setPlayers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch players:', error);
      toast.error('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setPage(0);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      position: '',
      year: '',
      status: ''
    });
    setPage(0);
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Name', 'Email', 'Registration No', 'Position', 'Year', 'Height', 'Status'];
    const rows = players.map(p => [
      p.name,
      p.email,
      p.collegeRegistrationNo,
      p.position.replace('_', ' '),
      p.year,
      p.heightCm,
      p.status
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `players-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Players exported successfully!');
  };

  const hasActiveFilters = filters.search || filters.position || filters.year || filters.status;
  return (
    <>
      <div className="hero-row">
        <div>
          <span className="eyebrow">PLAYER MANAGEMENT</span>
          <h1>All Players</h1>
          <p className="muted">
            {totalElements} {totalElements === 1 ? 'player' : 'players'} registered
          </p>
        </div>

        <button className="secondary" onClick={handleExport}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="card table-card">
        <div className="table-toolbar">
          <div>
            <span className="eyebrow">PLAYER LIST</span>
            <h3>Manage Applications</h3>
          </div>
        </div>

        <div className="filters">
          <div className="search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name or registration number..."
              value={filters.search}
              onChange={handleSearch}
            />
          </div>

          <select
            value={filters.position}
            onChange={(e) => handleFilterChange('position', e.target.value)}
          >
            <option value="">All Positions</option>
            {positions.map(pos => (
              <option key={pos} value={pos}>
                {pos.replace('_', ' ')}
              </option>
            ))}
          </select>

          <select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              className="secondary"
              onClick={handleClearFilters}
              style={{ minWidth: 'auto' }}
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-container" style={{ minHeight: '200px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : players.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <div className="empty-icon">
              <Filter size={28} />
            </div>
            <h3>No Players Found</h3>
            <p>
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results.'
                : 'No player applications yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>PLAYER</th>
                    <th>REGISTRATION NO.</th>
                    <th>POSITION</th>
                    <th>YEAR</th>
                    <th>HEIGHT</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id}>
                      <td>
                        <div className="table-player">
                          <div className="avatar">
                            {player.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <strong>{player.name}</strong>
                            <div style={{ color: '#9aa3b1', fontSize: '9px', marginTop: '2px' }}>
                              {player.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{player.collegeRegistrationNo}</td>
                      <td>{player.position.replace('_', ' ')}</td>
                      <td>Year {player.year}</td>
                      <td>{player.heightCm} cm</td>
                      <td>
                        <StatusBadge status={player.status} />
                      </td>
                      <td>
                        <button
                          className="secondary"
                          style={{ fontSize: '10px', padding: '6px 10px' }}
                          onClick={() => navigate(`/admin/players/${player.id}`)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                >
                  Previous
                </button>

                {[...Array(Math.min(totalPages, 10))].map((_, idx) => {
                  let pageNum;
                  if (totalPages <= 10) {
                    pageNum = idx;
                  } else if (page < 5) {
                    pageNum = idx;
                  } else if (page > totalPages - 6) {
                    pageNum = totalPages - 10 + idx;
                  } else {
                    pageNum = page - 4 + idx;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={page === pageNum ? 'active' : ''}
                      disabled={loading}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1 || loading}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
