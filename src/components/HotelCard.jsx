import React, { useState, useEffect } from 'react';
import { 
  MapPin, ShieldCheck, Heart, CloudSun, ArrowLeft, ArrowRight, 
  MessageSquare, CalendarCheck, Leaf, Bell, Compass, Users, Lightbulb, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import ReviewsModal from './ReviewsModal';
import BookingModal from './BookingModal';
import ItineraryModal from './ItineraryModal';
import { calculateEcoScore } from '../utils/eco';

export default function HotelCard({ res, index, isFavorite, toggleFavorite, formatPrice, t, lang }) {
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [weather, setWeather] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [isPriceAlertOn, setIsPriceAlertOn] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const images = res.images || (res.imageUrl ? [res.imageUrl] : ['https://images.unsplash.com/photo-1542314831-c6a4d142104d']);
  const eco = calculateEcoScore(res.distanceKm);

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

  const togglePriceAlert = () => {
    setIsPriceAlertOn(prev => {
      const nextState = !prev;
      if (nextState) {
        toast.success(`Alerte baisse de prix activée pour ${res.name} ! 🔔`);
      } else {
        toast.info(`Alerte prix désactivée.`);
      }
      return nextState;
    });
  };

  const nextImage = (e) => { e.stopPropagation(); setGalleryIdx((galleryIdx + 1) % images.length); };
  const prevImage = (e) => { e.stopPropagation(); setGalleryIdx((galleryIdx - 1 + images.length) % images.length); };

  return (
    <div id={`hotel-${res.id}`} className="card fade-in" style={{maxWidth: '100%', padding: '0', overflow: 'hidden', marginBottom: '2rem', position: 'relative'}}>
      
      {/* Header Banner with Image & Weather */}
      <div className="result-header" style={{
        position: 'relative',
        padding: '2rem',
        minHeight: index === 0 ? '260px' : '210px',
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

        {/* Favorite & Price Alert Actions */}
        <div style={{position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, display: 'flex', gap: '0.75rem'}}>
          <button onClick={() => toggleFavorite(res.id)} style={{background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer', color: isFavorite ? '#ef4444' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Heart size={24} fill={isFavorite ? '#ef4444' : 'none'} />
          </button>
          <button onClick={togglePriceAlert} style={{background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer', color: isPriceAlertOn ? '#f59e0b' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}} title="Alerte baisse de prix">
            <Bell size={22} fill={isPriceAlertOn ? '#f59e0b' : 'none'} />
          </button>
        </div>

        <div style={{position: 'relative', zIndex: 5}}>
          {index === 0 && (
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
              <span style={{fontWeight:600, color: '#fbbf24', textTransform:'uppercase', letterSpacing:'0.05em', fontSize: '0.85rem'}}>🏆 Recommandation #1</span>
            </div>
          )}
          <h1 style={{color: 'white', fontSize: index === 0 ? '2rem' : '1.5rem', margin: '0', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap'}}>
            {res.name}
            {weather !== null && <span style={{fontSize: '0.9rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem'}}><CloudSun size={16}/> {weather}°C</span>}
          </h1>
          <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', marginTop: '0.2rem'}}><MapPin size={18} style={{verticalAlign:'text-bottom'}}/> {res.location}</p>
        </div>
        
        <div className="score-badge" style={{top: '1.5rem', right: '1.5rem', fontSize: index === 0 ? '1.25rem' : '1rem', background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.2)', zIndex: 5}}>
          Score: <span style={{color: 'var(--success)'}}>{res.score}/100</span>
        </div>
      </div>
      
      {/* Body Content */}
      <div className="result-card-body" style={{padding: '2rem'}}>
        
        {/* Pro Badges Row: Eco-Score & Weather Seasonality */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {/* Eco-Score Badge */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)', border: `1px solid ${eco.badgeColor}`,
            padding: '0.4rem 0.85rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)'
          }}>
            <Leaf size={16} style={{ color: eco.badgeColor }} />
            <span>Éco-Score <strong style={{ color: eco.badgeColor }}>{eco.scoreGrade}</strong> ({eco.co2Kg} kg CO2e)</span>
          </div>

          {/* Weather Seasonality Widget */}
          <div style={{
            background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)',
            padding: '0.4rem 0.85rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)'
          }}>
            <CloudSun size={16} style={{ color: '#0ea5e9' }} />
            <span>Saison idéale : Mai - Octobre</span>
          </div>
        </div>

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

            {/* Per Person Cost Splitter */}
            <div style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Users size={14} /> soit ~{formatPrice(Math.round(res.basePricePerNight / 2))} / pers. / nuit
            </div>

            {res.distanceKm && (
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                {res.distanceKm <= 3 ? '🚶‍♂️ À pied / 🚲 Vélo' : 
                 res.distanceKm <= 50 ? '🚗 Voiture / 🚌 Bus' : 
                 res.distanceKm <= 500 ? '🚗 Voiture / 🚆 Train' : 
                 res.distanceKm <= 1500 ? '🚆 Train / ✈️ Avion' : 
                 '✈️ Avion / ⛴️ Bateau'} à {res.distanceKm} km
              </p>
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

        {/* Destination Tips Accordion */}
        {res.tips && res.tips.length > 0 && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button
              onClick={() => setShowTips(prev => !prev)}
              style={{
                width: '100%', background: showTips ? 'rgba(20,184,166,0.07)' : 'var(--border)',
                border: `1px solid ${showTips ? 'var(--primary)' : 'transparent'}`,
                borderRadius: '16px', padding: '0.9rem 1.25rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', transition: 'all 0.25s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: showTips ? 'var(--primary)' : 'var(--text-main)' }}>
                <Lightbulb size={18} style={{ color: '#f59e0b' }} />
                5 Conseils pour cette destination
              </span>
              {showTips ? <ChevronUp size={18} style={{ color: 'var(--primary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
            </button>

            {showTips && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {res.tips.map((tip, i) => (
                  <div key={i} style={{
                    background: 'var(--border)', borderRadius: '14px',
                    padding: '0.9rem 1.1rem',
                    display: 'flex', gap: '0.9rem', alignItems: 'flex-start',
                    borderLeft: '3px solid var(--primary)'
                  }}>
                    <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>{tip.icon}</span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {tip.label}
                      </span>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{tip.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Interactive Action Buttons (Reviews, Itinerary & Custom Booking) */}
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <button
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.85rem', fontSize: '0.9rem' }}
            onClick={() => setShowReviews(true)}
          >
            <MessageSquare size={18} /> Avis & Notes
          </button>

          <button
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.85rem', fontSize: '0.9rem' }}
            onClick={() => setShowItinerary(true)}
          >
            <Compass size={18} style={{ color: 'var(--primary)' }} /> Itinéraire IA (3 Jours)
          </button>
          
          <button
            className="btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.85rem', fontSize: '0.9rem' }}
            onClick={() => setShowBooking(true)}
          >
            <CalendarCheck size={18} /> Réserver / Chambres
          </button>
        </div>
        
        {/* External Booking Affiliates */}
        {(() => {
          const channels = res.availableChannels || (
            res.type === 'appart' ? ['airbnb', 'booking', 'official'] :
            res.type === 'camping' ? ['official', 'booking'] :
            ['booking', 'agoda', 'official']
          );

          return (
            <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)'}}>
              <p style={{textAlign: 'center', marginBottom: '1rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem'}}>{t('availabilities', lang)}</p>
              <div className="booking-links">
                {channels.includes('booking') && (
                  <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(res.name + ' ' + res.location)}`} target="_blank" rel="noreferrer" className="btn fade-in" style={{display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.95rem', background: '#003B95', color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(0, 59, 149, 0.3)'}}>
                    Booking.com
                  </a>
                )}
                {channels.includes('agoda') && (
                  <a href={`https://www.agoda.com/search?text=${encodeURIComponent(res.name + ' ' + res.location)}`} target="_blank" rel="noreferrer" className="btn fade-in" style={{display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.95rem', background: '#FF567D', color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(255, 86, 125, 0.3)'}}>
                    Agoda
                  </a>
                )}
                {channels.includes('airbnb') && (
                  <a href={`https://www.airbnb.fr/s/${encodeURIComponent(res.name + ' ' + res.location)}/homes`} target="_blank" rel="noreferrer" className="btn fade-in" style={{display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.95rem', background: '#FF5A5F', color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(255, 90, 95, 0.3)'}}>
                    Airbnb
                  </a>
                )}
                {channels.includes('official') && (
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(res.name + ' ' + res.location + ' official site')}`} target="_blank" rel="noreferrer" className="btn-secondary fade-in" style={{display: 'inline-block', textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.95rem'}}>
                    {t('officialSite', lang)}
                  </a>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Render Modals */}
      {showReviews && <ReviewsModal hotel={res} onClose={() => setShowReviews(false)} />}
      {showBooking && <BookingModal hotel={res} formatPrice={formatPrice} onClose={() => setShowBooking(false)} />}
      {showItinerary && <ItineraryModal hotel={res} onClose={() => setShowItinerary(false)} />}
    </div>
  );
}
