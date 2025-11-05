import { useState, useEffect } from 'react';
import { BarChart, Database, Zap, Activity, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import imageAPI from '../services/api';
import './Stats.css';

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await imageAPI.getStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      toast.error(`Failed to load statistics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'var(--success-color)';
    if (percentage < 80) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="spinner" />
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-error card">
        <p>Failed to load statistics. Please try again.</p>
        <button className="btn btn-primary" onClick={loadStats}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Usage Statistics</h2>
        <button className="btn btn-secondary" onClick={loadStats} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card card fade-in">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Database size={24} style={{ color: 'var(--primary-color)' }} />
            </div>
            <h3>Storage</h3>
          </div>
          <div className="stat-content">
            <div className="stat-values">
              <p className="stat-used">{formatBytes(stats.used.storage)}</p>
              <p className="stat-limit">of {formatBytes(stats.limit.storage)}</p>
            </div>
            <div className="stat-progress">
              <div
                className="stat-progress-bar"
                style={{
                  width: `${stats.percentage.storage}%`,
                  background: getProgressColor(stats.percentage.storage),
                }}
              />
            </div>
            <p className="stat-percentage">{stats.percentage.storage.toFixed(1)}% used</p>
          </div>
        </div>

        <div className="stat-card card fade-in">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <Zap size={24} style={{ color: 'var(--secondary-color)' }} />
            </div>
            <h3>Bandwidth</h3>
          </div>
          <div className="stat-content">
            <div className="stat-values">
              <p className="stat-used">{formatBytes(stats.used.bandwidth)}</p>
              <p className="stat-limit">of {formatBytes(stats.limit.bandwidth)}</p>
            </div>
            <div className="stat-progress">
              <div
                className="stat-progress-bar"
                style={{
                  width: `${stats.percentage.bandwidth}%`,
                  background: getProgressColor(stats.percentage.bandwidth),
                }}
              />
            </div>
            <p className="stat-percentage">{stats.percentage.bandwidth.toFixed(1)}% used</p>
          </div>
        </div>

        <div className="stat-card card fade-in">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <BarChart size={24} style={{ color: 'var(--success-color)' }} />
            </div>
            <h3>Transformations</h3>
          </div>
          <div className="stat-content">
            <div className="stat-values">
              <p className="stat-used">{formatNumber(stats.used.transformations)}</p>
              <p className="stat-limit">of {formatNumber(stats.limit.transformations)}</p>
            </div>
            <div className="stat-progress">
              <div
                className="stat-progress-bar"
                style={{
                  width: `${(stats.used.transformations / stats.limit.transformations) * 100}%`,
                  background: getProgressColor(
                    (stats.used.transformations / stats.limit.transformations) * 100
                  ),
                }}
              />
            </div>
            <p className="stat-percentage">
              {((stats.used.transformations / stats.limit.transformations) * 100).toFixed(1)}% used
            </p>
          </div>
        </div>

        <div className="stat-card card fade-in">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <Activity size={24} style={{ color: 'var(--warning-color)' }} />
            </div>
            <h3>Credits</h3>
          </div>
          <div className="stat-content">
            <div className="stat-values">
              <p className="stat-used">{formatNumber(stats.used.credits)}</p>
              <p className="stat-limit">of {formatNumber(stats.limit.credits)}</p>
            </div>
            <div className="stat-progress">
              <div
                className="stat-progress-bar"
                style={{
                  width: `${stats.percentage.credits}%`,
                  background: getProgressColor(stats.percentage.credits),
                }}
              />
            </div>
            <p className="stat-percentage">{stats.percentage.credits.toFixed(1)}% used</p>
          </div>
        </div>
      </div>

      <div className="stats-info card">
        <h3>About These Statistics</h3>
        <ul>
          <li>
            <strong>Storage:</strong> Total amount of space used by your images on Cloudinary.
          </li>
          <li>
            <strong>Bandwidth:</strong> Data transferred when images are viewed or downloaded.
          </li>
          <li>
            <strong>Transformations:</strong> Number of image transformations (resize, crop, etc.) performed.
          </li>
          <li>
            <strong>Credits:</strong> Overall usage credits based on your Cloudinary plan.
          </li>
        </ul>
        <p className="stats-note">
          Note: Statistics are provided by Cloudinary and may take some time to update.
        </p>
      </div>
    </div>
  );
}

export default Stats;
