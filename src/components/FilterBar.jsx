import React from 'react';
import { Search, SlidersHorizontal, Star, DollarSign, Check } from 'lucide-react';

export default function FilterBar({ filters, setFilters, maxPriceLimit = 300 }) {
  const handleMinRatingChange = (score) => {
    setFilters(prev => ({ ...prev, minRating: prev.minRating === score ? 0 : score }));
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
      };
    });
  };

  return (
    <div className="card fade-in" style={{ padding: '1.25rem', marginBottom: '2rem', borderRadius: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 600, color: 'var(--primary)' }}>
        <SlidersHorizontal size={20} />
        <span>Filtres de recherche instantanés</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {/* Text Search */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
            Rechercher un lieu ou hôtel
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem', paddingRight: '1rem', fontSize: '0.95rem' }}
              placeholder="Ex: Espagne, Paris, Soleil..."
              value={filters.searchQuery}
              onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>
        </div>

        {/* Max Price Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Prix max / nuit</span>
            <span style={{ color: 'var(--primary)' }}>{filters.maxPrice} €</span>
          </div>
          <input
            type="range"
            min="50"
            max={maxPriceLimit}
            step="10"
            value={filters.maxPrice}
            onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>

        {/* Min Score Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
            Note minimale
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { label: 'Tous', val: 0 },
              { label: '8+', val: 8 },
              { label: '9+', val: 9 }
            ].map(item => (
              <button
                key={item.val}
                type="button"
                className={`btn-secondary ${filters.minRating === item.val ? 'active' : ''}`}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  background: filters.minRating === item.val ? 'var(--primary)' : undefined,
                  color: filters.minRating === item.val ? 'white' : undefined,
                  borderColor: filters.minRating === item.val ? 'var(--primary)' : undefined
                }}
                onClick={() => handleMinRatingChange(item.val)}
              >
                {item.val > 0 && <Star size={14} fill="currentColor" style={{ verticalAlign: 'text-bottom', marginRight: '3px' }} />}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Amenities Filter Chips */}
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.5rem' }}>Équipements :</span>
        {[
          { id: 'parking', label: '🅿️ Parking' },
          { id: 'breakfast', label: '☕ Petit déjeuner' },
          { id: 'Climatisation obligatoire', label: '❄️ Climatisation' },
          { id: 'Animaux acceptés', label: '🐾 Animaux' }
        ].map(chip => {
          const isSelected = filters.amenities.includes(chip.id);
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => toggleAmenity(chip.id)}
              style={{
                background: isSelected ? 'rgba(20, 184, 166, 0.15)' : 'var(--border)',
                color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                borderRadius: '20px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s ease'
              }}
            >
              {isSelected && <Check size={14} />}
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
