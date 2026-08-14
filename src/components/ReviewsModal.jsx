import React, { useState } from 'react';
import { X, Star, ThumbsUp, MessageSquarePlus, UserCheck } from 'lucide-react';

export default function ReviewsModal({ hotel, onClose }) {
  const [reviewsList, setReviewsList] = useState(hotel.reviews || []);
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(9);
  const [showAddForm, setShowAddForm] = useState(false);

  const subScores = hotel.subScores || {
    cleanliness: hotel.cleanScore ? hotel.cleanScore * 2 : 9.0,
    location: hotel.beachScore ? hotel.beachScore * 2 : 9.2,
    service: 8.8,
    value: 9.0
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const created = {
      author: newAuthor.trim(),
      rating: newRating,
      date: 'À l\'instant',
      comment: newComment.trim()
    };

    setReviewsList([created, ...reviewsList]);
    setNewAuthor('');
    setNewComment('');
    setShowAddForm(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.65)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      backdropFilter: 'blur(5px)'
    }}>
      <div className="card fade-in" style={{
        background: 'var(--card-bg)', color: 'var(--text-main)',
        maxWidth: '650px', width: '100%', borderRadius: '24px',
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
        padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'var(--border)', border: 'none', color: 'var(--text-main)',
            cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ paddingRight: '2.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: '0 0 0.25rem 0' }}>
            {hotel.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: 'var(--primary)', color: 'white', fontWeight: 800,
              padding: '0.3rem 0.6rem', borderRadius: '10px', fontSize: '1.1rem'
            }}>
              {hotel.rating} / 10
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Basé sur {reviewsList.length + 14} avis vérifiés
            </span>
          </div>
        </div>

        {/* Sub-Scores Rating Breakdown */}
        <div style={{
          background: 'rgba(20, 184, 166, 0.05)', borderRadius: '16px', padding: '1.25rem',
          marginBottom: '2rem', border: '1px solid var(--border)'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1rem' }}>
            📊 Notes détaillées par catégorie
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { label: '🧹 Propreté', score: subScores.cleanliness },
              { label: '📍 Emplacement', score: subScores.location },
              { label: '🛎️ Service & Équipements', score: subScores.service },
              { label: '💰 Rapport Qualité/Prix', score: subScores.value }
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>{item.label}</span>
                  <span style={{ color: 'var(--primary)' }}>{item.score} / 10</span>
                </div>
                <div className="progress-bar-bg" style={{ height: '6px', margin: 0 }}>
                  <div className="progress-bar-fill" style={{ width: `${(item.score / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>💬 Avis des voyageurs</h3>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <MessageSquarePlus size={16} />
              {showAddForm ? 'Annuler' : 'Donner mon avis'}
            </button>
          </div>

          {/* Add Review Form */}
          {showAddForm && (
            <form onSubmit={handleAddReview} className="fade-in" style={{
              background: 'var(--border)', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem'
            }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>Rédiger votre avis</h4>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Votre prénom"
                  className="form-input"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  style={{ flex: 1, minWidth: '160px', padding: '0.5rem 0.85rem', fontSize: '0.9rem' }}
                  required
                />
                <select
                  className="form-input"
                  value={newRating}
                  onChange={e => setNewRating(Number(e.target.value))}
                  style={{ width: '120px', padding: '0.5rem 0.85rem', fontSize: '0.9rem' }}
                >
                  <option value={10}>10 / 10 ★</option>
                  <option value={9}>9 / 10 ★</option>
                  <option value={8}>8 / 10 ★</option>
                  <option value={7}>7 / 10 ★</option>
                </select>
              </div>
              <textarea
                placeholder="Partagez votre expérience sur cet hébergement..."
                className="form-input"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{ width: '100%', height: '70px', padding: '0.5rem 0.85rem', fontSize: '0.9rem', marginBottom: '0.75rem' }}
                required
              />
              <button className="btn" type="submit" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem' }}>
                Publier mon avis
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviewsList.map((rev, index) => (
              <div key={index} style={{
                background: 'var(--border)', padding: '1rem', borderRadius: '14px',
                borderLeft: '4px solid var(--primary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.author}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '6px' }}>
                      <UserCheck size={12} /> Séjour vérifié
                    </span>
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>
                    {rev.rating} / 10
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
                  "{rev.comment}"
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.4rem' }}>
                  {rev.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn-secondary" onClick={onClose} style={{ width: '100%', padding: '0.75rem' }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
