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
import FilterBar from './components/FilterBar';
import LiveSearchBlock from './components/LiveSearchBlock';
import { Intro } from './components/steps/Intro';
import { StepChat } from './components/steps/StepChat';
import LegalModal from './components/LegalModal';
import { toast } from 'sonner';
import { 
  COUNTRIES, REGIONS_BY_COUNTRY, WORLD_DESTINATIONS, 
  THEMES, CONTINENTS, getSeasonalSuggestions 
} from './data/destinations';
import { generateHotelsForDestination, getEffectiveDestinationName } from './utils/hotelEngine';

// Fix for missing default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TOTAL_STEPS = 7;

function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(-1); 
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [sortBy, setSortBy] = useState('score');
  const [lang, setLang] = useState('fr');
  const [darkMode, setDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [legalType, setLegalType] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    maxPrice: 300,
    minRating: 0,
    amenities: []
  });

  if (window.location.search.includes('privacy=true') || window.location.pathname === '/privacy') {
    return (
      <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)'}}>
        <h1 style={{color: 'var(--primary)', marginBottom: '2rem'}}>Politique de Confidentialité</h1>
        <p><strong>1. Données collectées :</strong> Nous pouvons demander l'accès à votre géolocalisation pour calculer les distances. Cette position est traitée localement et n'est jamais sauvegardée sur nos serveurs.</p>
        <p><strong>2. Cookies et Stockage Local :</strong> Nous utilisons le stockage local de votre appareil (localStorage) uniquement pour conserver vos préférences (thème sombre, favoris).</p>
        <p><strong>3. Partage de données :</strong> Vos données ne sont ni revendues, ni partagées avec des tiers à des fins publicitaires.</p>
        <div style={{marginTop: '2rem'}}><a href="/" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold'}}>← Retour à l'accueil</a></div>
      </div>
    );
  }

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
    departureCustom: '',
    destinationType: 'world',
    worldDestination: 'Bali, Indonésie',
    worldDestinationCountry: 'Indonésie',
    distanceMax: 500,
    destinationCountry: 'France',
    destinationRegion: 'Bretagne',
    destinationFreeText: '',
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
      const destinationHotels = generateHotelsForDestination(data, mockHotels);
      const scored = calculateScores(data, destinationHotels);
      setResults(scored);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la recherche des hébergements.");
    } finally {
      setLoading(false);
    }
  };

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // --- Components for Steps ---
  
  const Step1 = () => {
    const [worldTheme, setWorldTheme] = useState('all');
    const [worldSearch, setWorldSearch] = useState('');
    const [countryContinent, setCountryContinent] = useState('Tous');
    const [countrySearch, setCountrySearch] = useState('');
    const [regionCountry, setRegionCountry] = useState(data.destinationCountry || 'France');
    const [regionSearch, setRegionSearch] = useState('');

    const seasonal = getSeasonalSuggestions();

    // Filter world destinations
    const filteredWorld = WORLD_DESTINATIONS.filter(item => {
      const matchTheme = worldTheme === 'all' || item.theme === worldTheme;
      const matchSearch = !worldSearch || 
        item.name.toLowerCase().includes(worldSearch.toLowerCase()) || 
        item.country.toLowerCase().includes(worldSearch.toLowerCase()) || 
        item.desc.toLowerCase().includes(worldSearch.toLowerCase());
      return matchTheme && matchSearch;
    });

    // Filter countries
    const filteredCountries = COUNTRIES.filter(c => {
      const matchCont = countryContinent === 'Tous' || c.continent === countryContinent;
      const matchSearch = !countrySearch || 
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
        c.code.toLowerCase().includes(countrySearch.toLowerCase());
      return matchCont && matchSearch;
    });

    // Filter regions
    const availableRegions = REGIONS_BY_COUNTRY[regionCountry] || [];
    const filteredRegions = availableRegions.filter(r => {
      return !regionSearch || 
        r.name.toLowerCase().includes(regionSearch.toLowerCase()) || 
        r.city.toLowerCase().includes(regionSearch.toLowerCase());
    });

    return (
      <div className="fade-in">
        <h2><MapPin size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Votre Itinéraire</h2>
        <p style={{marginBottom: '1.5rem'}}>D'où partez-vous et où voulez-vous aller ?</p>
        
        {/* 1. Departure Selection */}
        <div className="form-group" style={{marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)'}}>
          <label className="form-label">1. Lieu de départ (pour calcul du trajet & estimation transport)</label>
          <div className="radio-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
            {['Rennes', 'Nantes', 'Paris', 'Lyon', '📍 Ma position', 'Autre'].map(city => (
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
                        toast.success("Position détectée avec succès !");
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

          {data.departure === 'Autre' && (
            <div className="fade-in" style={{ marginTop: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Entrez votre ville de départ (ex: Marseille, Bordeaux, Bruxelles...)"
                value={data.departureCustom || ''}
                onChange={(e) => {
                  updateData('departureCustom', e.target.value);
                  updateData('departureFreeText', e.target.value);
                }}
              />
            </div>
          )}
        </div>

        {/* 2. Destination Selection */}
        <div className="form-group">
          <label className="form-label">2. Destination souhaitée</label>
          <div className="radio-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1.5rem'}}>
            <div className={`radio-card ${data.destinationType === 'world' ? 'selected' : ''}`} onClick={() => updateData('destinationType', 'world')}>
              🌍 Le Monde Entier
            </div>
            <div className={`radio-card ${data.destinationType === 'around_me' ? 'selected' : ''}`} onClick={() => updateData('destinationType', 'around_me')}>
              📍 Autour de moi
            </div>
            <div className={`radio-card ${data.destinationType === 'country' ? 'selected' : ''}`} onClick={() => updateData('destinationType', 'country')}>
              🗺️ Un Pays (195)
            </div>
            <div className={`radio-card ${data.destinationType === 'region' ? 'selected' : ''}`} onClick={() => updateData('destinationType', 'region')}>
              🏞️ Une Région
            </div>
          </div>

          {/* 🌍 1. LE MONDE ENTIER */}
          {data.destinationType === 'world' && (
            <div className="fade-in" style={{ background: 'var(--border)', padding: '1.25rem', borderRadius: '18px' }}>
              {/* Seasonal Suggestion Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                border: '1px solid var(--primary)',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ fontSize: '0.88rem' }}>
                  <strong style={{ color: 'var(--primary)' }}>☀️ Recommandation pour la saison ({seasonal.season}) :</strong>{' '}
                  <span>{seasonal.suggestions.join(' • ')}</span>
                </div>
              </div>

              {/* Theme Filters */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {THEMES.map(th => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setWorldTheme(th.id)}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: worldTheme === th.id ? 'var(--primary)' : 'transparent',
                      background: worldTheme === th.id ? 'var(--primary)' : 'var(--card-bg)',
                      color: worldTheme === th.id ? 'white' : 'var(--text-main)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {th.emoji} {th.label}
                  </button>
                ))}
              </div>

              {/* Search Bar for World Destinations */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Rechercher une destination ou pays (ex: Bali, Maldives, Islande, Japon...)"
                  value={worldSearch}
                  onChange={(e) => setWorldSearch(e.target.value)}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              {/* Destinations Grid */}
              <div style={{
                maxHeight: '320px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.75rem',
                paddingRight: '4px'
              }}>
                {filteredWorld.map(item => {
                  const isSelected = data.worldDestination === item.name;
                  return (
                    <div
                      key={item.name}
                      onClick={() => {
                        updateData('worldDestination', item.name);
                        updateData('worldDestinationCountry', item.country);
                        updateData('destinationCountry', item.country);
                      }}
                      style={{
                        background: isSelected ? 'rgba(20, 184, 166, 0.12)' : 'var(--card-bg)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: '14px',
                        padding: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <strong style={{ fontSize: '0.95rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                          {item.flag} {item.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {item.priceLevel}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {data.worldDestination && (
                <div style={{ marginTop: '0.9rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textAlign: 'center' }}>
                  ✓ Destination sélectionnée : <strong>{data.worldDestination}</strong>
                </div>
              )}
            </div>
          )}

          {/* 📍 2. AUTOUR DE MOI */}
          {data.destinationType === 'around_me' && (
            <div className="fade-in" style={{ background: 'var(--border)', padding: '1.25rem', borderRadius: '18px' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
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
                  <MapPin size={18} /> Me localiser automatiquement
                </button>
              </div>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Rayon de recherche max</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{data.distanceMax} km</span>
              </label>
              <input 
                type="range" 
                min="50" max="1500" step="50"
                value={data.distanceMax} 
                onChange={e => updateData('distanceMax', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>
          )}

          {/* 🗺️ 3. UN PAYS (195 Pays du Monde) */}
          {data.destinationType === 'country' && (
            <div className="fade-in" style={{ background: 'var(--border)', padding: '1.25rem', borderRadius: '18px' }}>
              {/* Continent Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                {['Tous', ...CONTINENTS].map(cont => (
                  <button
                    key={cont}
                    type="button"
                    onClick={() => setCountryContinent(cont)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '16px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: countryContinent === cont ? 'var(--primary)' : 'transparent',
                      background: countryContinent === cont ? 'var(--primary)' : 'var(--card-bg)',
                      color: countryContinent === cont ? 'white' : 'var(--text-main)'
                    }}
                  >
                    {cont}
                  </button>
                ))}
              </div>

              {/* Search input for countries */}
              <div style={{ marginBottom: '0.85rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Filtrer parmi les 195 pays (ex: Japon, Italie, Norvège, Brésil...)"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              {/* Countries scroll list */}
              <div style={{
                maxHeight: '260px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.5rem',
                paddingRight: '4px'
              }}>
                {filteredCountries.map(c => {
                  const isSelected = data.destinationCountry === c.name;
                  return (
                    <div
                      key={c.code}
                      onClick={() => updateData('destinationCountry', c.name)}
                      style={{
                        background: isSelected ? 'rgba(20, 184, 166, 0.15)' : 'var(--card-bg)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '0.65rem 0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        {c.flag} {c.name}
                      </span>
                      {c.popular && <span style={{ fontSize: '0.65rem', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--primary)', padding: '0.15rem 0.35rem', borderRadius: '6px', fontWeight: 700 }}>Top</span>}
                    </div>
                  );
                })}
              </div>

              {data.destinationCountry && (
                <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textAlign: 'center' }}>
                  ✓ Pays sélectionné : <strong>{data.destinationCountry}</strong>
                </div>
              )}
            </div>
          )}

          {/* 🏞️ 4. UNE RÉGION */}
          {data.destinationType === 'region' && (
            <div className="fade-in" style={{ background: 'var(--border)', padding: '1.25rem', borderRadius: '18px' }}>
              {/* Select country for regions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                    1. Pays de la région
                  </label>
                  <select
                    className="form-input"
                    value={regionCountry}
                    onChange={(e) => {
                      setRegionCountry(e.target.value);
                      updateData('destinationCountry', e.target.value);
                    }}
                    style={{ fontSize: '0.9rem' }}
                  >
                    {Object.keys(REGIONS_BY_COUNTRY).map(cName => (
                      <option key={cName} value={cName}>{cName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                    2. Filtrer les régions
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Bretagne, Toscane, Algarve..."
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Regions Grid */}
              <div style={{
                maxHeight: '260px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.5rem',
                paddingRight: '4px'
              }}>
                {filteredRegions.map(r => {
                  const isSelected = data.destinationRegion === r.name;
                  return (
                    <div
                      key={r.name}
                      onClick={() => {
                        updateData('destinationRegion', r.name);
                        updateData('destinationCountry', regionCountry);
                      }}
                      style={{
                        background: isSelected ? 'rgba(20, 184, 166, 0.15)' : 'var(--card-bg)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '0.75rem 0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{r.flag}</span>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.88rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                            {r.name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Capitale / Phare : {r.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {data.destinationRegion && (
                <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textAlign: 'center' }}>
                  ✓ Région sélectionnée : <strong>{data.destinationRegion} ({regionCountry})</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

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

    let filteredResults = results.filter(item => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        if (!matchName && !matchLoc) return false;
      }
      if (item.basePricePerNight > filters.maxPrice) return false;
      if (filters.minRating > 0 && item.rating < filters.minRating) return false;
      if (filters.amenities.length > 0) {
        const itemConstraints = item.constraints || [];
        const hasAll = filters.amenities.every(a => itemConstraints.includes(a));
        if (!hasAll) return false;
      }
      return true;
    });

    let sortedResults = [...filteredResults];
    if (sortBy === 'price') {
      sortedResults.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortBy === 'distance') {
      sortedResults.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    const topResults = sortedResults;

    return (
      <div className="app-container" style={{maxWidth: '900px'}}>
        {/* Navigation / Retour Home */}
        <div 
          className="fade-in" 
          style={{display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', cursor: 'pointer', padding: '0.5rem 1rem', background: 'white', borderRadius: '50px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid var(--border)'}} 
          onClick={() => { setResults(null); setStep(-1); }}
        >
          <Compass size={20} style={{color: 'var(--primary)'}} />
          <strong style={{color: 'var(--primary)', fontSize: '1rem'}}>SmartStay Premium</strong>
          <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>— Retour à l'accueil</span>
        </div>

        {/* Real-time Filter Bar */}
        <div style={{ marginTop: '1.5rem', width: '100%' }}>
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>

        {/* Live Search Engines (Google Hotels, Booking, Airbnb, Kayak...) */}
        <LiveSearchBlock userData={data} />

        {/* Interactive Map */}
        <div className="card fade-in" style={{marginTop: '1.5rem', padding: '0', overflow: 'hidden', height: '400px', borderRadius: '12px'}}>
          <MapContainer 
            key={`map-${topResults[0]?.country || 'dest'}-${topResults[0]?.lat || '0'}`} 
            center={[topResults[0]?.lat || 46.0, topResults[0]?.lng || 2.0]} 
            zoom={topResults[0]?.lat ? 10 : 4} 
            style={{ height: '100%', width: '100%' }}
          >
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
          <h1 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>
            Voici votre Top {topResults.length} à {getEffectiveDestinationName(data)}
          </h1>
          <p>Hébergements sélectionnés sur-mesure selon vos critères et votre budget.</p>
          
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
      <div className="app-header no-print">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem'}}>
          <Compass size={24}/> {t('appTitle', lang)}
        </div>
        
        <div className="app-header-actions">
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

      <footer style={{
        textAlign: 'center', padding: '2rem', marginTop: '2rem',
        fontSize: '0.85rem', color: 'var(--text-muted)',
        display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap'
      }}>
        <span>© {new Date().getFullYear()} SmartStay Premium</span>
        <span style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => setLegalType('mentions')}>Mentions Légales</span>
        <span style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => setLegalType('cgu')}>CGU</span>
        <span style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => setLegalType('privacy')}>Confidentialité</span>
      </footer>

      {legalType && <LegalModal type={legalType} onClose={() => setLegalType(null)} />}
    </div>
  );
}

export default App;
