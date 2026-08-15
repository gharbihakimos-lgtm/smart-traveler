import React, { useState } from 'react';
import { ExternalLink, Sparkles, Search, SlidersHorizontal, Globe } from 'lucide-react';
import { getAllSearchLinks } from '../utils/liveSearch';

export default function LiveSearchBlock({ userData }) {
  // Determine effective destination name
  const getDestinationLabel = () => {
    if (userData.destinationType === 'country') {
      return userData.destinationCountry || 'France';
    }
    if (userData.destinationType === 'region') {
      return userData.destinationRegion ? `${userData.destinationRegion}, ${userData.destinationCountry || 'France'}` : 'Bretagne, France';
    }
    if (userData.destinationType === 'around_me') {
      return userData.departure || 'Autour de moi';
    }
    if (userData.destinationType === 'world' && userData.worldDestination) {
      return userData.worldDestination;
    }
    return userData.destinationFreeText || userData.departure || 'Europe';
  };

  const [customQuery, setCustomQuery] = useState('');
  const destination = customQuery || getDestinationLabel();

  const searchParams = {
    destination,
    dateStart: userData.dateStart,
    dateEnd: userData.dateEnd,
    adults: userData.adults || 2,
    children: userData.children || 0,
    budget: userData.budget || 1000,
    sameRoom: userData.sameRoom ?? true
  };

  const links = getAllSearchLinks(searchParams);

  return (
    <div className="card fade-in" style={{
      marginTop: '2rem',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.04) 0%, rgba(14, 165, 233, 0.08) 100%)',
      border: '1px solid rgba(20, 184, 166, 0.25)',
      borderRadius: '24px',
      padding: '2rem',
      width: '100%',
      maxWidth: '100%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            <Globe size={16} /> Moteurs de Recherche Mondiaux en Direct
          </div>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-main)' }}>
            Comparez en 1 clic pour <span style={{ color: 'var(--primary)' }}>{destination}</span>
          </h2>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Dates ({userData.dateStart || 'Août'} → {userData.dateEnd || 'Août'}), {userData.adults || 2} adulte(s){userData.children > 0 ? `, ${userData.children} enfant(s)` : ''} et budget sont <strong>déjà pré-remplis</strong> !
          </p>
        </div>
      </div>

      {/* Optional Custom Destination Input */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', maxWidth: '450px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.3rem', paddingRight: '0.75rem', fontSize: '0.88rem', padding: '0.55rem 0.75rem 0.55rem 2.3rem' }}
            placeholder={`Changer de ville (ex: ${destination})...`}
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
          />
        </div>
        {customQuery && (
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            onClick={() => setCustomQuery('')}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Grid of Search Engines */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {links.map((item) => (
          <a
            key={item.platform}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              background: 'var(--card-bg)',
              border: item.recommended ? `2px solid ${item.color}` : '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: item.recommended ? '0 8px 20px rgba(0,0,0,0.06)' : '0 2px 6px rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="fade-in"
          >
            {item.recommended && (
              <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: item.color,
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderBottomLeftRadius: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ⭐ Top Choix
              </span>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{item.logo}</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{item.platform}</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {item.desc}
              </p>
            </div>

            <div style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: item.color,
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              <span>Voir les offres en direct</span>
              <ExternalLink size={15} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
