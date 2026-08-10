import React, { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, Heart, CloudSun, ArrowLeft, ArrowRight } from 'lucide-react';

export default function HotelCard({ res, index, isFavorite, toggleFavorite, formatPrice, t, lang }) {
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [weather, setWeather] = useState(null);

  const images = res.images || (res.imageUrl ? [res.imageUrl] : ['https://images.unsplash.com/photo-1542314831-c6a4d142104d']);

  useEffect(() => {
    if (res.lat && res.lng) {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${res.lat}&longitude=${res.lng}&current_weather=true`)
        .then(r => r.json())
        .then(data => {
          if (data && data.current_weather) {
            setWeather(data.current_weather.temperature);
          }
        })
        .catch(console.error);
    }
  }, [res.lat, res.lng]);

  const nextImage = (e) => { e.stopPropagation(); setGalleryIdx((galleryIdx + 1) % images.length); };
  const prevImage = (e) => { e.stopPropagation(); setGalleryIdx((galleryIdx - 1 + images.length) % images.length); };

  return (
    <div className="card fade-in" style={{maxWidth: '100%', padding: '0', overflow: 'hidden', marginBottom: '2rem', position: 'relative'}}>
      
      <div className="result-header" style={{
        position: 'relative',
        padding: '2rem',
        minHeight: index === 0 ? '250px' : '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
          background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${images[galleryIdx]}) center/cover`,
          transition: 'background 0.5s ease'
        }}></div>

        {images.length > 1 && (
          <div style={{position: 'absolute', top: '50%', left: '1rem', right: '1rem', transform: 'translateY(-50%)', display: 'flex', justifyContent: 'space-between', zIndex: 10}}>
            <button onClick={prevImage} style={{background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><ArrowLeft size={20}/></button>
            <button onClick={nextImage} style={{background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><ArrowRight size={20}/></button>
          </div>
        )}

        <div style={{position: 'absolute', top: '1rem', left: '1rem', zIndex: 10}}>
          <button onClick={() => toggleFavorite(res.id)} style={{background: 'transparent', border: 'none', cursor: 'pointer', color: isFavorite ? '#ef4444' : 'rgba(255,255,255,0.7)', transition: 'transform 0.2s', padding: 0}}>
            <Heart size={32} fill={isFavorite ? '#ef4444' : 'none'} />
          </button>
        </div>

        <div style={{position: 'relative', zIndex: 5}}>
          {index === 0 && (
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
              <span style={{fontWeight:600, color: '#fbbf24', textTransform:'uppercase', letterSpacing:'0.05em', fontSize: '0.85rem'}}>🏆 Recommandation #1</span>
            </div>
          )}
          <h1 style={{color: 'white', fontSize: index === 0 ? '2rem' : '1.5rem', margin: '0', display: 'flex', alignItems: 'center', gap: '1rem'}}>
            {res.name}
            {weather !== null && <span style={{fontSize: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem'}}><CloudSun size={18}/> {weather}°C</span>}
          </h1>
          <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginTop: '0.2rem'}}><MapPin size={18} style={{verticalAlign:'text-bottom'}}/> {res.location}</p>
        </div>
        
        <div className="score-badge" style={{top: '1.5rem', right: '1.5rem', fontSize: index === 0 ? '1.25rem' : '1rem', background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.2)', zIndex: 5}}>
          Score: <span style={{color: 'var(--success)'}}>{res.score}/100</span>
        </div>
      </div>
      
      <div className="result-card-body" style={{padding: '2rem'}}>
        {res.warnings && res.warnings.length > 0 && (
          <div style={{background: 'rgba(255, 170, 0, 0.1)', borderLeft: '4px solid var(--warning)', padding: '1rem', marginBottom: '1.5rem', borderRadius: '0 8px 8px 0'}}>
            <h4 style={{margin: 0, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <ShieldCheck size={20}/> Attention
            </h4>
            <ul style={{margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: 'var(--text-main)'}}>
              {res.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem'}}>
          <div>
            <h4 style={{color: 'var(--success)', marginBottom:'0.5rem'}}>À partir de</h4>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)'}}>
              {formatPrice(res.basePricePerNight)} <span style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>/ nuit</span>
            </div>
            {res.distanceKm && (
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem'}}>🚗 à {res.distanceKm} km</p>
            )}
          </div>
          <div>
            <h4 style={{color: 'var(--primary)', marginBottom:'0.5rem'}}>Points forts</h4>
            <ul className="pro-con-list" style={{marginTop:0}}>
              {res.pros && res.pros.map((p, i) => <li key={i}><span style={{color:'var(--success)'}}>✓</span> {p}</li>)}
            </ul>
          </div>
          <div>
            <h4 style={{color: 'var(--warning)', marginBottom:'0.5rem'}}>À prendre en compte</h4>
            <ul className="pro-con-list" style={{marginTop:0}}>
              {res.cons && res.cons.map((c, i) => <li key={i}><span style={{color:'var(--warning)'}}>!</span> {c}</li>)}
            </ul>
          </div>
        </div>
        
        <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)'}}>
          <p style={{textAlign: 'center', marginBottom: '1rem', fontWeight: 600, color: 'var(--text-main)'}}>{t('availabilities', lang)}</p>
          <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem'}}>
            <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(res.name + ' ' + res.location)}`} target="_blank" rel="noreferrer" className="btn fade-in" style={{display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.95rem', background: '#003B95', color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(0, 59, 149, 0.3)'}}>
              Booking.com
            </a>
            <a href={`https://www.agoda.com/search?text=${encodeURIComponent(res.name + ' ' + res.location)}`} target="_blank" rel="noreferrer" className="btn fade-in" style={{display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.95rem', background: '#FF567D', color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(255, 86, 125, 0.3)'}}>
              Agoda
            </a>
            <a href={`https://www.google.com/search?q=${encodeURIComponent(res.name + ' ' + res.location + ' official site')}`} target="_blank" rel="noreferrer" className="btn-secondary fade-in" style={{display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.95rem'}}>
              {t('officialSite', lang)}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
