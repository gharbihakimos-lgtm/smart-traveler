import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { generateItinerary } from '../utils/itinerary';

export default function ItineraryModal({ hotel, onClose }) {
  const itinerary = generateItinerary(hotel);
  const [activeDay, setActiveDay] = useState(1);

  const currentDayData = itinerary.find(d => d.day === activeDay) || itinerary[0];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.65)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      backdropFilter: 'blur(5px)'
    }}>
      <div className="card fade-in" style={{
        background: 'var(--card-bg)', color: 'var(--text-main)',
        maxWidth: '700px', width: '100%', borderRadius: '24px',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            <Sparkles size={16} /> Générateur d'Itinéraire IA
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{hotel.name}</h2>
          <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            📍 {hotel.location} • Programme optimisé 3 jours
          </p>
        </div>

        {/* Day Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {itinerary.map(item => (
            <button
              key={item.day}
              type="button"
              className={`btn-secondary ${activeDay === item.day ? 'active' : ''}`}
              style={{
                flex: 1, padding: '0.6rem 1rem', fontSize: '0.9rem',
                background: activeDay === item.day ? 'var(--primary)' : undefined,
                color: activeDay === item.day ? 'white' : undefined,
                borderColor: activeDay === item.day ? 'var(--primary)' : undefined
              }}
              onClick={() => setActiveDay(item.day)}
            >
              Jour {item.day}
            </button>
          ))}
        </div>

        {/* Active Day Title */}
        <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '1rem' }}>
          {currentDayData.title}
        </h3>

        {/* Activities Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {currentDayData.activities.map((act, idx) => (
            <div key={idx} style={{
              background: 'var(--border)', padding: '1rem', borderRadius: '16px',
              borderLeft: '4px solid var(--primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.3rem' }}>
                <Clock size={14} /> {act.time}
              </div>
              <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.3rem' }}>{act.title}</strong>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{act.desc}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }} onClick={() => window.print()}>
            <Download size={18} /> Imprimer l'itinéraire
          </button>
          <button className="btn" style={{ flex: 1 }} onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
