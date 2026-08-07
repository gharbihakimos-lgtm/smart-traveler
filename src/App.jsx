import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Users, Wallet, Home, Star, CheckSquare, 
  Sparkles, ArrowRight, ArrowLeft, Check, Palmtree, Map, ShieldCheck, ThumbsUp 
} from 'lucide-react';
import { calculateScores } from './utils/scoring';

const TOTAL_STEPS = 8;

function App() {
  const [step, setStep] = useState(0); // 0 is Intro
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

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
    constraints: ['parking', 'breakfast']
  });

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
      // 1. Fetch raw hotels from our backend proxy (simulating an external API)
      const response = await fetch('http://localhost:3001/api/searchHotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      const rawHotels = result.data; // The raw list of hotels

      // 2. Score them with our AI algorithm
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
    <div className="card fade-in" style={{textAlign: 'center'}}>
      <div style={{marginBottom: '2rem', color: 'var(--primary)'}}>
        <Sparkles size={64} />
      </div>
      <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>SmartStay AI</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
        "Dites-moi vos envies, l'IA trouve votre séjour idéal."
      </p>
      <button className="btn" onClick={() => setStep(1)} style={{fontSize: '1.2rem', padding: '1rem 2rem'}}>
        Commencer <ArrowRight size={20}/>
      </button>
    </div>
  );

  const Step0 = () => {
    const [prompt, setPrompt] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    const handleMagicSearch = () => {
      setAnalyzing(true);
      // Simuler l'appel à l'API LLM
      setTimeout(() => {
        setAnalyzing(false);
        // Simulation d'une compréhension de langage naturel
        if(prompt.toLowerCase().includes('espagne')) {
           setData(prev => ({...prev, destinationType: 'country', destinationCountry: 'Espagne', budget: 2000, adults: 2, children: 2, sameRoom: false, priorities: {...prev.priorities, beach: 5}}));
        }
        setStep(2); // On passe directement au formulaire pré-rempli (Etape 1 d'origine)
      }, 2500);
    };

    return (
      <div className="fade-in" style={{textAlign: 'center'}}>
        <h2 style={{color: 'var(--primary)', marginBottom: '1rem'}}><Sparkles size={28} style={{verticalAlign:'middle'}}/> Pilote Auto IA</h2>
        <p style={{marginBottom: '2rem', fontSize: '1.1rem'}}>Décrivez votre séjour idéal en langage naturel, ou remplissez le formulaire manuellement.</p>
        
        <textarea 
          className="form-input" 
          rows="4" 
          placeholder="Ex: Je veux partir au soleil en Espagne avec ma femme et mes 2 ados. Budget max 2000€. Idéalement proche de la mer."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          style={{resize: 'none', marginBottom: '1.5rem', fontSize: '1rem'}}
        ></textarea>

        {analyzing ? (
           <div style={{color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem'}} className="fade-in">🧠 L'IA analyse et configure votre recherche...</div>
        ) : (
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button className="btn" onClick={handleMagicSearch} disabled={prompt.length < 10}>
              Recherche Magique IA
            </button>
            <button className="btn-secondary" onClick={() => setStep(2)}>
              Remplir manuellement
            </button>
          </div>
        )}
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
          {['Rennes', 'Nantes', 'Paris', 'Autre'].map(city => (
            <div 
              key={city}
              className={`radio-card ${data.departure === city ? 'selected' : ''}`}
              onClick={() => updateData('departure', city)}
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
        <h2><Star size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Vos priorités</h2>
        <p style={{marginBottom: '1rem'}}>Qu'est-ce qui est le plus important pour vous ? (1 à 5 étoiles)</p>
        
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
        <h2><CheckSquare size={24} style={{verticalAlign:'middle', marginRight:'8px', color:'var(--primary)'}}/> Contraintes</h2>
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
          <Sparkles className="magic-icon" />
          <h2 style={{marginBottom: '1rem'}}>L'IA analyse 1000+ séjours...</h2>
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
        <div style={{marginBottom: '2rem', textAlign: 'center'}}>
          <h1 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Voici votre Top {topResults.length}</h1>
          <p>Classé selon votre affinité avec vos critères (Score sur 100).</p>
        </div>
        
        {topResults.map((res, index) => (
          <div key={index} className="card fade-in" style={{maxWidth: '100%', padding: '0', overflow: 'hidden', marginBottom: '2rem'}}>
            <div className="result-header" style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${res.imageUrl || 'https://images.unsplash.com/photo-1542314831-c6a4d142104d'}) center/cover`, 
              padding: '2rem',
              minHeight: index === 0 ? '250px' : '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}>
              {index === 0 && (
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
                  <Sparkles size={20} color="var(--secondary)"/> <span style={{fontWeight:600, color: 'white', textTransform:'uppercase', letterSpacing:'0.05em'}}>Recommandation #1 IA</span>
                </div>
              )}
              <h1 style={{color: 'white', fontSize: index === 0 ? '2rem' : '1.5rem', margin: '0'}}>{res.name}</h1>
              <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginTop: '0.2rem'}}><MapPin size={18} style={{verticalAlign:'text-bottom'}}/> {res.location}</p>
              
              <div className="score-badge" style={{top: '1.5rem', right: '1.5rem', fontSize: index === 0 ? '1.25rem' : '1rem', background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.2)'}}>
                Score IA: <span style={{color: 'var(--success)'}}>{res.score}/100</span>
              </div>
            </div>
            
            <div className="result-card-body" style={{padding: '2rem'}}>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem'}}>
                <div style={{flex: '1 1 150px'}}>
                  <h3 style={{color: 'var(--text-main)', marginBottom:'1rem'}}>💰 Prix estimé</h3>
                  <div style={{fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1}}>
                    {res.totalPrice} € <span style={{fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400}}>/{res.nights} nuits</span>
                  </div>
                  <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>Trajet inclus depuis {data.departure}</p>
                </div>
                <div style={{flex: '2 1 300px'}}>
                  <h3 style={{color: 'var(--text-main)', marginBottom:'1rem'}}><ThumbsUp size={20} style={{verticalAlign:'text-bottom', color:'var(--success)'}}/> Pourquoi ce choix ?</h3>
                  <p style={{background: '#f8fafc', padding: '1rem', borderRadius: '12px', borderLeft: `4px solid ${index===0 ? 'var(--primary)' : '#64748b'}`}}>
                    {res.why}
                  </p>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: index === 0 ? '2rem' : '0'}}>
                <div>
                  <h4 style={{color: 'var(--success)', display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}><Check size={18}/> Points Forts</h4>
                  <ul className="pro-con-list" style={{marginTop:0}}>
                    {res.pros && res.pros.map((p, i) => <li key={i}><span style={{color:'var(--success)'}}>✓</span> {p}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 style={{color: 'var(--warning)', display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}><ShieldCheck size={18}/> À prendre en compte</h4>
                  <ul className="pro-con-list" style={{marginTop:0}}>
                    {res.cons && res.cons.map((c, i) => <li key={i}><span style={{color:'var(--warning)'}}>!</span> {c}</li>)}
                  </ul>
                </div>
              </div>
              
              {index === 0 && (
                <div style={{textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)'}}>
                  <a 
                    href={`https://www.booking.com/searchresults.html?ss=${res.location}&checkin=${data.dateStart}&checkout=${data.dateEnd}&group_adults=${data.adults}&group_children=${data.children}&aid=1234567`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn fade-in" 
                    style={{display: 'inline-block', textDecoration: 'none', padding: '0.75rem 2rem', fontSize: '1rem', background: '#003580'}}
                  >
                    Réserver sur Booking.com
                  </a>
                  <p style={{fontSize: '0.8rem', marginTop: '0.75rem', color: 'var(--text-muted)'}}>*Lien d'affiliation simulé pour générer des revenus (Pilier 4)</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <div style={{textAlign: 'center', marginTop: '1rem', marginBottom: '3rem'}}>
          <button className="btn-secondary" style={{padding: '0.75rem 2rem'}} onClick={() => {setResults(null); setStep(1);}}>
            Refaire une recherche
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
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div style={{fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <Sparkles size={20}/> SmartStay AI
        </div>
        {user ? (
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{fontWeight: 500}}>👋 Bonjour, Utilisateur Test</span>
            <button className="btn-secondary" style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}} onClick={() => setUser(null)}>Déconnexion</button>
          </div>
        ) : (
          <button className="btn-secondary" style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}} onClick={() => setShowLogin(true)}>Se connecter</button>
        )}
      </div>

      {showLogin && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card fade-in" style={{width: '400px', textAlign: 'center'}}>
            <h2 style={{marginBottom: '1rem'}}>Connexion Firebase</h2>
            <p style={{marginBottom: '2rem'}}>Simulez une connexion utilisateur pour débloquer les favoris.</p>
            <button className="btn" style={{width: '100%', marginBottom: '1rem'}} onClick={() => {setUser({name: 'Test'}); setShowLogin(false);}}>
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
            <span>SmartStay AI</span>
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
