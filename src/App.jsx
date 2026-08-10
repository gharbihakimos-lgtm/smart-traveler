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
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
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
      alert("La connexion a échoué.");
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
      alert("Erreur de connexion au serveur backend (Vérifiez qu'il est bien lancé).");
    } finally {
      setLoading(false);
    }
  };

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // --- Components for Steps ---
  
  const Intro = () => (
    <div className="card fade-in" style={{textAlign: 'center', backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', padding: '4rem 2rem', borderRadius: '16px'}}>
      <div style={{marginBottom: '2rem', color: 'white', background: 'rgba(0,0,0,0.3)', display: 'inline-block', padding: '1rem', borderRadius: '50%'}}>
        <Compass size={64} />
      </div>
      <h1 style={{fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>SmartStay Premium</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '2rem', textShadow: '0 1px 3px rgba(0,0,0,0.5)', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
        L'excellence du voyage sur mesure. Définissez vos critères, nous trouvons l'exceptionnel.
      </p>
      <button className="btn" onClick={() => setStep(1)} style={{fontSize: '1.2rem', padding: '1rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'}}>
        Commencer l'expérience <ArrowRight size={20}/>
      </button>
    </div>
  );

  const Step0 = () => {
    const [chatMessages, setChatMessages] = useState([
      { role: 'assistant', content: "Bonjour ! 👋 Je suis votre assistant voyage. Décrivez-moi le séjour de vos rêves et je m'occupe de tout configurer pour vous !" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const sendMessage = async () => {
      if (!userInput.trim() || isThinking) return;
      
      const newMessages = [...chatMessages, { role: 'user', content: userInput }];
      setChatMessages(newMessages);
      setUserInput('');
      setIsThinking(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userMessages = newMessages.filter(m => m.role === 'user');
        const turnCount = userMessages.length;
        const lastMsg = userMessages[turnCount - 1].content.toLowerCase();
        
        let result = {};
        if (turnCount === 1) {
          result = { ready: false, question: "Super projet de voyage ! 🌴 Pour te trouver le séjour parfait, j'ai besoin de quelques précisions. Combien de personnes partent (adultes et enfants) ?" };
        } else if (turnCount === 2) {
          result = { ready: false, question: "Parfait ! 👨‍👩‍👧‍👦 Et quel est votre budget maximum pour l'ensemble du séjour (transport + logement) ?" };
        } else if (turnCount === 3) {
          result = { ready: false, question: "Très bien ! 💰 Dernière question : qu'est-ce qui est le plus important pour vous ? La plage, la piscine, le calme, les activités pour enfants ?" };
        } else {
          result = {
            ready: true,
            data: {
              destinationType: 'country',
              destinationCountry: lastMsg.includes('espagne') ? 'Espagne' : 'France',
              dateStart: '2026-08-10',
              dateEnd: '2026-08-17',
              adults: 2,
              children: 2,
              budget: 2000,
              stayType: ['hotel', 'camping'],
              priorities: { pool: 5, beach: 4, clean: 5, kids: 4, quiet: 3, luxury: 2, spa: 2, food: 3, nature: 3, sport: 2 }
            }
          };
        }

        if (result.ready && result.data) {
          // L'IA a toutes les infos, on pré-remplit le formulaire
          setChatMessages(prev => [...prev, { role: 'assistant', content: "Parfait, j'ai tout ce qu'il me faut ! 🎉 Je configure votre recherche..." }]);
          setTimeout(() => {
            setData(prev => ({ ...prev, ...result.data }));
            setStep(2); // Passer directement au formulaire pré-rempli
          }, 1500);
        } else if (result.question) {
          // L'IA pose une question de suivi
          setChatMessages(prev => [...prev, { role: 'assistant', content: result.question }]);
        }
      } catch (err) {
        console.error(err);
        setChatMessages(prev => [...prev, { role: 'assistant', content: "Oups, je n'arrive pas à joindre le serveur. Vérifiez qu'il est lancé ! 🔧" }]);
      } finally {
        setIsThinking(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    return (
      <div className="fade-in">
        <h2 style={{color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <MessageCircle size={24}/> Assistant Voyage
        </h2>
        <p style={{marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-muted)'}}>
          Décrivez votre séjour idéal, l'assistant vous posera les bonnes questions.
        </p>
        
        {/* Zone de chat */}
        <div style={{
          background: '#f1f5f9', 
          borderRadius: '16px', 
          padding: '1rem',
          maxHeight: '350px',
          overflowY: 'auto',
          marginBottom: '1rem'
        }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '1rem'
            }}>
              <div className={msg.role === 'user' ? 'chat-message-user' : 'chat-message-bot'}>
                {msg.content}
              </div>
            </div>
          ))}
          {isThinking && (
            <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem'}}>
              <div className="chat-message-bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Barre de saisie */}
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <input 
            type="text"
            className="form-input"
            placeholder="Ex: On veut partir en Espagne avec nos 2 enfants..."
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isThinking}
            style={{flex: 1, marginBottom: 0}}
          />
          <button 
            className="btn" 
            onClick={sendMessage} 
            disabled={!userInput.trim() || isThinking}
            style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center'}}
          >
            <Send size={18}/>
          </button>
        </div>

        <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
          <button className="btn-secondary" onClick={() => setStep(2)} style={{fontSize: '0.9rem'}}>
            Passer et remplir manuellement →
          </button>
        </div>
      </div>
    );
  };

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
                    }, () => alert("Impossible d'obtenir votre position."));
                  } else alert("Géolocalisation non supportée.");
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
                    alert(`Localisation OK ! Lat: ${pos.coords.latitude.toFixed(2)}, Lng: ${pos.coords.longitude.toFixed(2)}`);
                    updateData('lat', pos.coords.latitude);
                    updateData('lng', pos.coords.longitude);
                    updateData('departure', 'Ma position');
                  }, () => alert("Impossible d'obtenir votre position."));
                } else {
                  alert("Géolocalisation non supportée.");
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

    const topResults = results.slice(0, 3);

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
                    <strong>#{index + 1} {res.name}</strong><br />
                    {res.basePricePerNight}€ / nuit
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>

        <div style={{marginTop: '2rem', textAlign: 'center'}}>
          <h1 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Voici votre Top {topResults.length}</h1>
          <p>Classé selon votre affinité avec vos critères (Score sur 100).</p>
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
              alert('Partage non supporté');
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
    <Intro key="intro" />,
    <Step0 key="s0" />,
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

      {step > 0 && (
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
        {steps[step]}
        
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
