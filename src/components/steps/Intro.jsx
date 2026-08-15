import React from 'react';
import { 
  Compass, ArrowRight, MessageSquare, Sparkles, Globe, 
  ShieldCheck, Zap, SlidersHorizontal, Star, MapPin, Heart,
  Flame, CheckCircle2
} from 'lucide-react';

export const Intro = ({ setStep, setData }) => {
  const quickDestinations = [
    {
      name: 'Santorin',
      country: 'Grèce',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
      badge: '🌅 Couchers de soleil',
      tag: 'Plage & Romantique'
    },
    {
      name: 'Bali',
      country: 'Indonésie',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
      badge: '🌴 Rizières & Plages',
      tag: 'Éco-Resort'
    },
    {
      name: 'Kyoto',
      country: 'Japon',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
      badge: '⛩️ Temples & Culture',
      tag: 'Patrimoine'
    },
    {
      name: 'Algarve',
      country: 'Portugal',
      image: 'https://images.unsplash.com/photo-1542314831-c6a4d142104d?w=600&q=80',
      badge: '🏖️ Falaises Dorées',
      tag: 'Soleil & Mer'
    }
  ];

  const handleQuickSelect = (dest) => {
    if (setData) {
      setData(prev => ({
        ...prev,
        destinationType: 'world',
        worldDestination: `${dest.name}, ${dest.country}`,
        worldDestinationCountry: dest.country,
        destinationCountry: dest.country
      }));
    }
    setStep(1);
  };

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* 🌟 HERO BANNER */}
      <div style={{
        position: 'relative',
        borderRadius: '32px',
        overflow: 'hidden',
        padding: '4.5rem 2rem',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.88)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85") center/cover no-repeat'
      }}>
        {/* Glow ambient decoration */}
        <div style={{
          position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px', background: 'var(--primary)',
          filter: 'blur(130px)', opacity: 0.35, pointerEvents: 'none'
        }}></div>

        {/* Top Floating Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          padding: '0.45rem 1.1rem',
          borderRadius: '50px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.75rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <Sparkles size={16} style={{ color: '#fbbf24' }} />
          <span>Le Comparateur Voyage Nouvelle Génération</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          color: '#ffffff',
          textShadow: '0 3px 12px rgba(0, 0, 0, 0.4)'
        }}>
          Trouvez le séjour idéal.<br />
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #2dd4bf 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Sur-mesure, au meilleur prix.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '650px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6,
          fontWeight: 400,
          textShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          Comparez <strong>195 pays</strong> et <strong>28M+ d'hébergements</strong> en quelques clics grâce à nos filtres intelligents et notre IA de recommandation.
        </p>

        {/* Action Buttons Group */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 2
        }}>
          <button
            onClick={() => setStep(1)}
            className="btn"
            style={{
              padding: '1.1rem 2.25rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 10px 25px rgba(20, 184, 166, 0.45)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <span>Lancer la recherche</span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() => setStep(0)}
            className="btn-secondary"
            style={{
              padding: '1.1rem 1.75rem',
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={18} style={{ color: '#38bdf8' }} />
            <span>Assistant IA (Chat)</span>
          </button>
        </div>

        {/* Social Proof / Stats Strip */}
        <div style={{
          marginTop: '3.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.18)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
          <div>
            <strong style={{ fontSize: '1.6rem', display: 'block', fontWeight: 800, color: '#38bdf8' }}>195</strong>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>Pays couverts</span>
          </div>
          <div>
            <strong style={{ fontSize: '1.6rem', display: 'block', fontWeight: 800, color: '#2dd4bf' }}>8+</strong>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>Moteurs en direct</span>
          </div>
          <div>
            <strong style={{ fontSize: '1.6rem', display: 'block', fontWeight: 800, color: '#fbbf24' }}>100%</strong>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>Gratuit & Sans Frais</span>
          </div>
          <div>
            <strong style={{ fontSize: '1.6rem', display: 'block', fontWeight: 800, color: '#f43f5e' }}>4.9 / 5</strong>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>Satisfaction voyageur</span>
          </div>
        </div>
      </div>

      {/* 🚀 3 PILLIERS DE VALEUR */}
      <div style={{
        marginTop: '2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="card fade-in" style={{
          background: 'var(--card-bg)',
          borderRadius: '24px',
          padding: '1.75rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--soft-shadow)'
        }}>
          <div style={{
            width: '48px', height: '48px',
            borderRadius: '14px',
            background: 'rgba(20, 184, 166, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '1rem'
          }}>
            <Globe size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Comparaison Mondiale
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            Google Hotels, Booking.com, Airbnb, Kayak et Expedia interrogés avec vos critères exacts.
          </p>
        </div>

        <div className="card fade-in" style={{
          background: 'var(--card-bg)',
          borderRadius: '24px',
          padding: '1.75rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--soft-shadow)'
        }}>
          <div style={{
            width: '48px', height: '48px',
            borderRadius: '14px',
            background: 'rgba(14, 165, 233, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0ea5e9',
            marginBottom: '1rem'
          }}>
            <SlidersHorizontal size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Filtrage Intelligent
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            Prix par personne, formule repas, éco-score carbone, météo idéale et itinéraire IA jour par jour.
          </p>
        </div>

        <div className="card fade-in" style={{
          background: 'var(--card-bg)',
          borderRadius: '24px',
          padding: '1.75rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--soft-shadow)'
        }}>
          <div style={{
            width: '48px', height: '48px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#f59e0b',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Réservation Sécurisée
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            Confirmation instantanée par e-mail, export d'agenda Google/iCal et alertes baisse de prix.
          </p>
        </div>
      </div>

      {/* 🌴 DESTINATIONS TENDANCE EN 1 CLIC */}
      <div style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Flame size={16} /> Inspirations du moment
            </span>
            <h2 style={{ fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: 'var(--text-main)' }}>
              Destinations Coup de Cœur
            </h2>
          </div>
          <button
            onClick={() => setStep(1)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            Explorer tout le catalogue <ArrowRight size={16} />
          </button>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}>
          {quickDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => handleQuickSelect(dest)}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                height: '240px',
                cursor: 'pointer',
                boxShadow: 'var(--soft-shadow)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="fade-in"
            >
              {/* Background Image */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.85)), url(${dest.image}) center/cover no-repeat`,
                transition: 'transform 0.4s ease'
              }}></div>

              {/* Tag Top */}
              <span style={{
                position: 'absolute', top: '1rem', left: '1rem',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                color: 'white', fontSize: '0.75rem', fontWeight: 600,
                padding: '0.25rem 0.65rem', borderRadius: '20px'
              }}>
                {dest.tag}
              </span>

              {/* Content Bottom */}
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', color: 'white' }}>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, display: 'block' }}>
                  {dest.badge}
                </span>
                <strong style={{ fontSize: '1.3rem', display: 'block', margin: '0.1rem 0' }}>
                  {dest.name}
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                  📍 {dest.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
