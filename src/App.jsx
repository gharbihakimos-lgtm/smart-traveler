import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar, Users, Wallet, Heart, Settings2,
  CheckCircle, ArrowRight, ArrowLeft, Check, Palmtree, Map, ShieldCheck, ThumbsUp,
  Globe, Euro, Compass, MessageCircle, Send, Home,
  Share2, Download, Sun, Moon, CloudSun, DollarSign, PoundSterling, HeartPulse
} from 'lucide-react';
import { calculateScores } from './utils/scoring';
import { signInWithGoogle, logOut } from './firebase';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mockHotels from './data/hotels.json';
import { t } from './i18n';
import HotelCard from './components/HotelCard';
import { Intro } from './components/steps/Intro';
import { StepChat } from './components/steps/StepChat';
import { toast } from 'sonner';

// Fix for missing default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TOTAL_STEPS = 8;

function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(-1); 
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [sortBy, setSortBy] = useState('score');
  const [lang, setLang] = useState('fr');
  const [darkMode, setDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      setUser({ name: result.user.displayName });
      setShowLogin(false);
    } catch (error) {
      toast.error("La connexion a échoué.");
    }
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  const [data, setData] = useState({
    departure: 'Rennes',
    destinationType: 'world',
    distanceMax: 500,
    destinationCountry: 'France',
    destinationRegion: 'Bretagne',
    dateStart: '2026-08-10',
    dateEnd: '2026-08-15',
    flexible: false,
    budgetFlexible: false,
    adults: 2,
    children: 1,
    childAge: 7,
    sameRoom: true,
    budget: 1000,
    stayType: ['hotel'],
    priorities: { pool: 5, beach: 4, clean: 5, kids: 3, quiet: 4, luxury: 2 },
    constraints: ['Climatisation obligatoire']
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('smartstay-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('smartstay-favorites', JSON.stringify(favorites));
  }, [favorites]);
  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const [currency, setCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(1);
  useEffect(() => {
    if (currency === 'EUR') { setExchangeRate(1); return; }
    fetch(`https://api.frankfurter.app/latest?from=EUR&to=${currency}`)
      .then(res => res.json())
      .then(d => setExchangeRate(d.rates[currency]))
      .catch(() => setExchangeRate(1));
  }, [currency]);
  
  const formatPrice = (priceInEur) => {
    const p = Math.round(priceInEur * exchangeRate);
    if (currency === 'USD') return `$${p}`;
    if (currency === 'GBP') return `£${p}`;
    return `${p}€`;
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else submit();
  };
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const rawHotels = mockHotels;
      const scored = calculateScores(data, rawHotels);
      setResults(scored);
    } catch (err) {
      console.error(err);
      toast.error("Erreur de connexion au serveur backend (Vérifiez qu'il est bien lancé).");
    } finally {
      setLoading(false);
    }
  };

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // --- Components for Steps ---
  
  const Step1 = () => (
    <div className="fade-in">
      <h2><MapPin size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Votre Itinéraire</h2>
      <p style={{marginBottom: '2rem'}}>D'où partez-vous et où voulez-vous aller ?</p>
      
      <div className="form-group" style={{marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)'}}>
        <label className="form-label">1. Lieu de départ (pour le calcul du trajet)</label>
        <div className="radio-grid">
          {['Rennes', 'Nantes', 'Paris', 'Autre', '📍 Ma position'].map(city => (
            <div 
              key={city}
              className={`radio-card ${data.departure === city ? 'selected' : ''}`}
              onClick={() => {
                if (city === '📍 Ma position') {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      updateData('lat', pos.coords.latitude);
                      updateData('lng', pos.coords.longitude);
                      updateData('departure', city);
                    }, () => toast.error("Impossible d'obtenir votre position."));
                  } else toast.error("Géolocalisation non supportée.");
                } else {
                  updateData('departure', city);
                }
              }}
            >
              {city}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">2. Destination souhaitée</label>
        <div className="radio-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
          <div className={`radio-card ${data.destinationType === 'world' ? 'selected' : ''}`} onClick={() => updateData('destinationType', 'world')}>
            🌍 Le Monde Entier
          </div>
          <div className={`radio-card ${data.destinationType === 'around_me' ? 'selected' : ''}`} onClick={() => updateData('destinationType', 'around_me')}>
            📍 Autour de moi
          </div>
          <div className={`radio-card ${data.destinationType === 'country' ? 'selected' : ''}`} onClick={() => updateData('destinationType', 'country')}>
            🗺️ Un Pays
          </div>
          <div className={`radio-card ${data.destinationType === 'region' ? 'selected' : ''}`} onClick={() => updateData('destinationType', 'region')}>
            🏞️ Une Région
          </div>
        </div>

        {data.destinationType === 'around_me' && (
          <div className="fade-in" style={{marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px'}}>
            <div style={{textAlign: 'center', marginBottom: '1rem'}}>
              <button className="btn fade-in" onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    toast.success(`Localisation OK ! Lat: ${pos.coords.latitude.toFixed(2)}, Lng: ${pos.coords.longitude.toFixed(2)}`);
                    updateData('lat', pos.coords.latitude);
                    updateData('lng', pos.coords.longitude);
                    updateData('departure', 'Ma position');
                  }, () => toast.error("Impossible d'obtenir votre position."));
                } else {
                  toast.error("Géolocalisation non supportée.");
                }
              }}>
                <MapPin size={18} /> Me localiser
              </button>
            </div>
            <label className="form-label" style={{display:'flex', justifyContent:'space-between'}}>
              <span>Rayon de recherche max</span>
              <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{data.distanceMax} km</span>
            </label>
            <input 
              type="range" 
              min="50" max="1500" step="50"
              value={data.distanceMax} 
              onChange={e => updateData('distanceMax', parseInt(e.target.value))}
              style={{width: '100%', accentColor: 'var(--primary)'}}
            />
          </div>
        )}
        
        {data.destinationType === 'country' && (
          <div className="fade-in" style={{marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px'}}>
            <label className="form-label">Choisissez un pays</label>
            <select className="form-input" value={data.destinationCountry} onChange={e => updateData('destinationCountry', e.target.value)}>
              <option value="France">France</option>
              <option value="Espagne">Espagne</option>
              <option value="Portugal">Portugal</option>
            </select>
          </div>
        )}

        {data.destinationType === 'region' && (
          <div className="fade-in" style={{marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px'}}>
            <label className="form-label">Choisissez une région</label>
            <select className="form-input" value={data.destinationRegion} onChange={e => updateData('destinationRegion', e.target.value)}>
              <option value="Bretagne">Bretagne</option>
              <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
              <option value="Île-de-France">Île-de-France</option>
              <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
              <option value="Pays de la Loire">Pays de la Loire</option>
              <option value="Catalogne">Catalogne (Espagne)</option>
              <option value="Algarve">Algarve (Portugal)</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="fade-in">
      <h2><Calendar size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Vos dates</h2>
      <p style={{marginBottom: '2rem'}}>Quand souhaitez-vous partir ?</p>
      
      <div className="form-group">
        <label className="form-label">Date de début</label>
        <input type="date" className="form-input" value={data.dateStart} onChange={e => updateData('dateStart', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Date de fin</label>
        <input type="date" className="form-input" value={data.dateEnd} onChange={e => updateData('dateEnd', e.target.value)} />
      </div>
      <div className="form-group" style={{display:'flex', alignItems:'center', gap:'0.5rem', marginTop: '1rem'}}>
        <input type="checkbox" id="flex" checked={data.flexible} onChange={e => updateData('flexible', e.target.checked)} style={{width: '20px', height: '20px'}} />
        <label htmlFor="flex" style={{fontWeight: 500, cursor:'pointer'}}>Dates flexibles (+/- 3 jours) - <i>Recommandé pour payer moins cher</i></label>
      </div>
    </div>
  );

  const Step3 = () => {
    const handleChildrenChange = (newVal) => {
      setData(prev => ({
        ...prev, 
        children: newVal,
        sameRoom: newVal > 2 ? false : prev.sameRoom
      }));
    };

    return (
      <div className="fade-in">
        <h2><Users size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Voyageurs</h2>
        <p style={{marginBottom: '2rem'}}>Qui participe à l'aventure ?</p>
        
        <div className="form-group" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span className="form-label" style={{marginBottom:0}}>Adultes</span>
          <div className="counter">
            <button className="counter-btn" onClick={() => updateData('adults', Math.max(1, data.adults - 1))}>-</button>
            <span className="counter-value">{data.adults}</span>
            <button className="counter-btn" onClick={() => updateData('adults', data.adults + 1)}>+</button>
          </div>
        </div>
        <div className="form-group" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span className="form-label" style={{marginBottom:0}}>Enfants</span>
          <div className="counter">
            <button className="counter-btn" onClick={() => handleChildrenChange(Math.max(0, data.children - 1))}>-</button>
            <span className="counter-value">{data.children}</span>
            <button className="counter-btn" onClick={() => handleChildrenChange(data.children + 1)}>+</button>
          </div>
        </div>
        {data.children > 0 && (
          <div className="form-group" style={{marginTop: '2rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px'}}>
            <label className="form-label">Âge du plus jeune enfant</label>
            <input type="number" className="form-input" value={data.childAge} onChange={e => updateData('childAge', parseInt(e.target.value))} min="0" max="17" />
          </div>
        )}

        <div className="form-group" style={{display:'flex', alignItems:'center', gap:'0.5rem', marginTop: '1.5rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)'}}>
          <input type="checkbox" id="sameRoom" checked={data.sameRoom} onChange={e => updateData('sameRoom', e.target.checked)} style={{width: '20px', height: '20px'}} />
          <label htmlFor="sameRoom" style={{fontWeight: 500, cursor:'pointer'}}>Tous dans la même chambre (décocher pour séparer parents/enfants)</label>
        </div>
      </div>
    );
  };

  const Step4 = () => (
    <div className="fade-in">
      <h2><Wallet size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Budget Total</h2>
      <p style={{marginBottom: '2rem'}}>Transport, logement et taxes inclus. Nous cherchons le meilleur rapport qualité/prix.</p>
      
      <div className="radio-grid">
        {[500, 1000, 1500, 2000, 3000].map(val => (
          <div 
            key={val}
            className={`radio-card ${data.budget === val ? 'selected' : ''}`}
            onClick={() => updateData('budget', val)}
          >
            {val} € max
          </div>
        ))}
      </div>
      
      <div className="form-group" style={{display:'flex', alignItems:'center', gap:'0.5rem', marginTop: '2rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px'}}>
        <input type="checkbox" id="budgetFlex" checked={data.budgetFlexible} onChange={e => updateData('budgetFlexible', e.target.checked)} style={{width: '20px', height: '20px'}} />
        <label htmlFor="budgetFlex" style={{fontWeight: 500, cursor:'pointer'}}>Légèrement flexible (+10%) si le logement est vraiment exceptionnel</label>
      </div>
    </div>
  );

  const Step5 = () => {
    const toggleType = (type) => {
      if (data.stayType.includes(type)) {
        updateData('stayType', data.stayType.filter(t => t !== type));
      } else {
        updateData('stayType', [...data.stayType, type]);
      }
    };
    return (
      <div className="fade-in">
        <h2><Home size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Type de séjour</h2>
        <p style={{marginBottom: '2rem'}}>Plusieurs choix possibles.</p>
        
        <div className="radio-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
          {[
            {id: 'hotel', label: 'Hôtel'},
            {id: 'camping', label: 'Camping premium'},
            {id: 'village', label: 'Village vacances'},
            {id: 'appart', label: 'Appartement'}
          ].map(type => (
            <div 
              key={type.id}
              className={`radio-card ${data.stayType.includes(type.id) ? 'selected' : ''}`}
              onClick={() => toggleType(type.id)}
            >
              {type.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Step6 = () => {
    const [showMore, setShowMore] = useState(false);
    const setRating = (key, val) => {
      updateData('priorities', { ...data.priorities, [key]: val });
    };
    const mainCriteria = [
      {id: 'pool', label: 'Piscine'},
      {id: 'beach', label: 'Proximité Plage'},
      {id: 'clean', label: 'Propreté'},
      {id: 'kids', label: 'Animation Enfant'},
      {id: 'quiet', label: 'Calme'},
      {id: 'luxury', label: 'Luxe / Standing'}
    ];
    const moreCriteria = [
      {id: 'spa', label: 'Spa & Bien-être'},
      {id: 'food', label: 'Gastronomie'},
      {id: 'nature', label: 'Proximité Nature'},
      {id: 'sport', label: 'Infrastructures Sportives'}
    ];
    
    const displayCriteria = showMore ? [...mainCriteria, ...moreCriteria] : mainCriteria;

    return (
      <div className="fade-in">
        <h2><Heart size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Vos priorités</h2>
        <p style={{marginBottom: '1rem'}}>Qu'est-ce qui est le plus important pour vous ? (1 à 5)</p>
        
        <div style={{background: 'white', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '1rem'}}>
          {displayCriteria.map(c => (
            <div key={c.id} className="rating-row fade-in">
              <span className="rating-label">{c.label}</span>
              <div>
                {[1,2,3,4,5].map(star => (
                  <button 
                    key={star} 
                    className={`star-btn ${(data.priorities[c.id] || 3) >= star ? 'active' : ''}`}
                    onClick={() => setRating(c.id, star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{textAlign: 'center'}}>
          <button className="btn-secondary" style={{padding: '0.5rem 1.5rem', fontSize: '0.9rem'}} onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Afficher moins' : 'Afficher plus de critères'}
          </button>
        </div>
      </div>
    );
  };

  const Step7 = () => {
    const [showMore, setShowMore] = useState(false);
    const toggleConstraint = (c) => {
      if (data.constraints.includes(c)) {
        updateData('constraints', data.constraints.filter(x => x !== c));
      } else {
        updateData('constraints', [...data.constraints, c]);
      }
    };
    const mainOptions = [
      'Climatisation obligatoire', 'Parking', 'Petit déjeuner', 
      'Serviettes fournies', 'Ménage quotidien', 'Animaux acceptés'
    ];
    const moreOptions = [
      'Borne de recharge électrique', 'Accès PMR', 'Cuisine équipée', 'Navette aéroport'
    ];
    
    const displayOptions = showMore ? [...mainOptions, ...moreOptions] : mainOptions;

    return (
      <div className="fade-in">
        <h2><CheckCircle size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Contraintes</h2>
        <p style={{marginBottom: '2rem'}}>Cochez ce qui est non négociable.</p>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
          {displayOptions.map(opt => (
            <label key={opt} className="fade-in" style={{display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer'}}>
              <input 
                type="checkbox" 
                checked={data.constraints.includes(opt)}
                onChange={() => toggleConstraint(opt)}
                style={{width: '20px', height: '20px'}}
              />
              <span style={{fontWeight: 500}}>{opt}</span>
            </label>
          ))}
        </div>

        <div style={{textAlign: 'center'}}>
          <button className="btn-secondary" style={{padding: '0.5rem 1.5rem', fontSize: '0.9rem'}} onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Afficher moins' : 'Afficher plus de contraintes'}
          </button>
        </div>
      </div>
    );
  };

  // --- Loading & Results ---

  if (loading) {
    return (
      <div className="app-container">
        <div className="card loading-screen fade-in">
          <Compass className="magic-icon" />
          <h2 style={{marginBottom: '1rem'}}>Analyse de 1000+ séjours en cours...</h2>
          <p>Recherche du meilleur compromis Famille / Prix / Localisation</p>
        </div>
      </div>
    );
  }

  if (results !== null) {
    if (results.length === 0) {
      return (
        <div className="app-container">
          <div className="card fade-in" style={{textAlign: 'center'}}>
            <h2>Oups ! Aucun séjour ne correspond...</h2>
            <p style={{margin: '1rem 0'}}>Vos contraintes sont peut-être trop strictes ou le budget trop bas.</p>
            <button className="btn" onClick={() => {setResults(null); setStep(1);}}>
              Modifier mes critères
            </button>
          </div>
        </div>
      );
    }

    let sortedResults = [...results];
    if (sortBy === 'price') {
      sortedResults.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortBy === 'distance') {
      sortedResults.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    const topResults = sortedResults.slice(0, 3);

    return (
      <div className="app-container" style={{maxWidth: '900px'}}>
        {/* Interactive Map */}
        <div className="card fade-in" style={{marginTop: '2rem', padding: '0', overflow: 'hidden', height: '400px', borderRadius: '12px'}}>
          <MapContainer center={[46.0, 2.0]} zoom={4} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {topResults.map((res, index) => (
              res.lat && res.lng && (
                <Marker key={res.id} position={[res.lat, res.lng]}>
                  <Popup>
                    <div style={{textAlign: 'center'}}>
                      <img src={res.images && res.images.length > 0 ? res.images[0] : res.image} alt={res.name} style={{width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem'}} />
                      <strong style={{display: 'block', fontSize: '1rem', marginBottom: '0.2rem'}}>{res.name}</strong>
                      <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{res.basePricePerNight}€ / nuit</span><br/>
                      <button 
                        onClick={() => document.getElementById(`hotel-${res.id}`)?.scrollIntoView({behavior: 'smooth'})} 
                        style={{background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', marginTop: '0.5rem', cursor: 'pointer', width: '100%', fontWeight: 'bold'}}
                      >
                        Voir les détails
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>

        <div style={{marginTop: '2rem', textAlign: 'center'}}>
          <h1 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Voici votre Top {topResults.length}</h1>
          <p>Les meilleures correspondances selon vos critères.</p>
          
          <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap'}}>
            <button className={`btn-secondary ${sortBy === 'score' ? 'active' : ''}`} onClick={() => setSortBy('score')} style={sortBy === 'score' ? {background: 'var(--primary)', color: 'white'} : {}}>🌟 Meilleur Score</button>
            <button className={`btn-secondary ${sortBy === 'price' ? 'active' : ''}`} onClick={() => setSortBy('price')} style={sortBy === 'price' ? {background: 'var(--primary)', color: 'white'} : {}}>💰 Prix le plus bas</button>
            <button className={`btn-secondary ${sortBy === 'distance' ? 'active' : ''}`} onClick={() => setSortBy('distance')} style={sortBy === 'distance' ? {background: 'var(--primary)', color: 'white'} : {}}>📍 Le plus proche</button>
          </div>
        </div>
        
        {topResults.map((res, index) => (
          <HotelCard 
            key={res.id} 
            res={res} 
            index={index} 
            isFavorite={favorites.includes(res.id)} 
            toggleFavorite={toggleFavorite} 
            formatPrice={formatPrice}
            t={t}
            lang={lang}
          />
        ))}

        <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', marginBottom: '3rem'}} className="no-print">
          <button className="btn-secondary" style={{padding: '0.75rem 1.5rem'}} onClick={() => {setResults(null); setStep(1);}}>
            Nouvelle recherche
          </button>
          <button className="btn-secondary" style={{padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => window.print()}>
            <Download size={18} /> PDF
          </button>
          <button className="btn" style={{padding: '0.75rem 1.5rem'}} onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Mon voyage SmartStay', url: window.location.href })
                .catch(() => {});
            } else {
              toast.error('Partage non supporté');
            }
          }}>
            <Share2 size={18} /> Partager
          </button>
        </div>
      </div>
    );
  }

  // --- Main Render ---

  const steps = [
    null,
    null,
    <Step1 key="s1" />,
    <Step2 key="s2" />,
    <Step3 key="s3" />,
    <Step4 key="s4" />,
    <Step5 key="s5" />,
    <Step6 key="s6" />,
    <Step7 key="s7" />
  ];

  return (
    <div className="app-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '24px', width: '100%', marginBottom: '2rem', boxShadow: 'var(--soft-shadow)'}} className="no-print">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem'}}>
          <Compass size={24}/> {t('appTitle', lang)}
        </div>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <div style={{display: 'flex', gap: '0.5rem', color: 'white'}}>
            <button onClick={() => setCurrency(c => c === 'EUR' ? 'USD' : c === 'USD' ? 'GBP' : 'EUR')} style={{background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              {currency === 'EUR' ? <Euro size={18}/> : currency === 'USD' ? <DollarSign size={18}/> : <PoundSterling size={18}/>} {currency}
            </button>
            <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} style={{background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Globe size={18} /> {lang.toUpperCase()}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} style={{background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
              {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <div style={{background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <HeartPulse size={18} color="#ef4444" fill="#ef4444" /> {favorites.length}
            </div>
          </div>
          
          {user ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '1rem'}}>
              <span style={{fontWeight: 500}}>👋 {user.name}</span>
              <button className="btn-secondary" style={{padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--text-main)'}} onClick={handleLogout}>{t('logoutBtn', lang)}</button>
            </div>
          ) : (
            <div style={{marginLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '1rem'}}>
              <button className="btn-secondary" style={{padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--text-main)'}} onClick={() => setShowLogin(true)}>{t('loginBtn', lang)}</button>
            </div>
          )}
        </div>
      </div>

      {showLogin && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card fade-in" style={{width: '400px', textAlign: 'center'}}>
            <h2 style={{marginBottom: '1rem'}}>Connexion</h2>
            <p style={{marginBottom: '2rem'}}>Connectez-vous pour débloquer les favoris.</p>
            <button className="btn" style={{width: '100%', marginBottom: '1rem'}} onClick={handleLogin}>
              Se connecter avec Google
            </button>
            <button className="btn-secondary" style={{width: '100%'}} onClick={() => setShowLogin(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {step >= 0 && (
        <div className="progress-container">
          <div className="step-indicator" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
            <span>SmartStay Premium</span>
            <span>Étape {step} / {TOTAL_STEPS}</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}></div>
          </div>
        </div>
      )}

      <div className="card">
        {step === -1 && <Intro setStep={setStep} />}
        {step === 0 && <StepChat setStep={setStep} setData={setData} />}
        {step > 0 && steps[step]}
        
        {step > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <button className="btn-secondary btn" onClick={prevStep} style={{padding: '0.75rem 1.25rem'}}>
              <ArrowLeft size={18} /> Retour
            </button>
            
            <button className="btn" onClick={nextStep} style={{padding: '0.75rem 1.5rem'}}>
              {step === TOTAL_STEPS ? 'Trouver mon séjour' : 'Suivant'} {step !== TOTAL_STEPS && <ArrowRight size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
