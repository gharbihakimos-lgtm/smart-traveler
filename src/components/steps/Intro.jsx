import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export const Intro = ({ setStep }) => (
  <div className="fade-in" style={{textAlign: 'center', backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', padding: '4rem 2rem', borderRadius: '24px'}}>
    <div style={{marginBottom: '2rem', color: 'white', background: 'rgba(0,0,0,0.3)', display: 'inline-block', padding: '1rem', borderRadius: '50%'}}>
      <Compass size={64} />
    </div>
    <h1 style={{fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>SmartStay Premium</h1>
    <p style={{fontSize: '1.2rem', marginBottom: '2rem', textShadow: '0 1px 3px rgba(0,0,0,0.5)', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
      L'excellence du voyage sur mesure. Définissez vos critères, nous trouvons l'exceptionnel.
    </p>
    <button className="btn" onClick={() => setStep(0)} style={{fontSize: '1.2rem', padding: '1rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'}}>
      Commencer l'expérience <ArrowRight size={20}/>
    </button>
  </div>
);
