import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { enhancedEmailAPI, getCurrentUser, isAuthenticated } from '../services/api';

export default function EmailPreferences() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState({
    job_alerts: true,
    career_guidance: true,
    notifications: true,
    marketing: false
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        const res = await enhancedEmailAPI.getPreferences();
        if (res.success && res.data) {
          setPrefs(res.data);
        }
      } catch (e) {
        console.error('Failed to load preferences:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPrefs(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await enhancedEmailAPI.updatePreferences(prefs);
      setStatus(res.success ? { ok: true, msg: 'Preferences saved.' } : { ok: false, msg: res.message || 'Save failed.' });
    } catch (e) {
      setStatus({ ok: false, msg: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user || !user.email) {
        setStatus({ ok: false, msg: 'No user email found.' });
        return;
      }
      const res = await enhancedEmailAPI.unsubscribe({ email: user.email });
      setStatus(res.success ? { ok: true, msg: 'Unsubscribed from all emails.' } : { ok: false, msg: res.message || 'Unsubscribe failed.' });
      if (res.success) {
        setPrefs({ job_alerts: false, career_guidance: false, notifications: false, marketing: false });
      }
    } catch (e) {
      setStatus({ ok: false, msg: e.message });
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)'
  };

  const card = {
    background: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 720,
    margin: '40px auto',
    boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb'
  };

  return (
    <div style={pageStyle}>
      <div style={{ padding: '16px 24px', background: '#2563eb', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 700 }}>Career Navigator</Link>
        <div>Email Preferences</div>
      </div>
      <div style={card}>
        <h1 style={{ marginTop: 0 }}>Manage Email Preferences</h1>
        <p style={{ color: '#6b7280' }}>Choose which types of emails you want to receive.</p>
        <form onSubmit={handleSave}>
          {[
            { key: 'job_alerts', label: 'Job Alerts', desc: 'Get emails about new job opportunities' },
            { key: 'career_guidance', label: 'Career Guidance', desc: 'Advice and tips to grow your career' },
            { key: 'notifications', label: 'Notifications', desc: 'Important updates about your account' },
            { key: 'marketing', label: 'Marketing', desc: 'Occasional product news and promotions' }
          ].map(opt => (
            <label key={opt.key} style={{ display: 'flex', alignItems: 'start', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <input type="checkbox" name={opt.key} checked={!!prefs[opt.key]} onChange={handleChange} />
              <div>
                <div style={{ fontWeight: 600 }}>{opt.label}</div>
                <div style={{ color: '#6b7280', fontSize: 14 }}>{opt.desc}</div>
              </div>
            </label>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button type="submit" disabled={loading} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '10px 16px', cursor: 'pointer' }}>{loading ? 'Saving...' : 'Save Preferences'}</button>
            <button type="button" onClick={handleUnsubscribeAll} disabled={loading} style={{ background: 'white', border: '1px solid #ef4444', color: '#b91c1c', borderRadius: 6, padding: '10px 16px', cursor: 'pointer' }}>Unsubscribe All</button>
          </div>
        </form>
        {status && (
          <div style={{ marginTop: 16, color: status.ok ? '#065f46' : '#991b1b', background: status.ok ? '#d1fae5' : '#fee2e2', padding: '10px 12px', borderRadius: 6 }}>
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
}
