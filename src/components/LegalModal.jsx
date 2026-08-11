import React from 'react';
import { X } from 'lucide-react';

export default function LegalModal({ type, onClose }) {
  const content = {
    mentions: {
      title: "Mentions Légales",
      text: (
        <>
          <p><strong>Éditeur du site :</strong> SmartStay Premium, démonstrateur technologique.</p>
          <p><strong>Hébergement :</strong> Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.</p>
          <p><strong>Contact :</strong> hello@smartstay-premium.com</p>
        </>
      )
    },
    cgu: {
      title: "Conditions Générales d'Utilisation",
      text: (
        <>
          <p>En utilisant SmartStay Premium, vous acceptez de ne pas utiliser le service à des fins frauduleuses ou illégales.</p>
          <p>Les résultats générés (hôtels, prix, scores) sont fournis à titre indicatif via des algorithmes démonstratifs et ne constituent en aucun cas une offre contractuelle de voyage.</p>
        </>
      )
    },
    privacy: {
      title: "Politique de Confidentialité",
      text: (
        <>
          <p><strong>1. Données collectées :</strong> Nous pouvons demander l'accès à votre géolocalisation pour calculer les distances. Cette position est traitée localement et n'est jamais sauvegardée sur nos serveurs.</p>
          <p><strong>2. Cookies et Stockage Local :</strong> Nous utilisons le stockage local de votre appareil (localStorage) uniquement pour conserver vos préférences (thème sombre, favoris).</p>
          <p><strong>3. Partage de données :</strong> Vos données ne sont ni revendues, ni partagées avec des tiers à des fins publicitaires.</p>
        </>
      )
    }
  };

  const current = content[type];
  if (!current) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.6)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="card fade-in" style={{
        background: 'var(--bg-main)', color: 'var(--text-main)',
        maxWidth: '600px', width: '100%', borderRadius: '12px',
        maxHeight: '85vh', overflowY: 'auto', position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'var(--surface)', border: 'none', color: 'var(--text-main)', 
          cursor: 'pointer', borderRadius: '50%', padding: '0.5rem', display: 'flex'
        }}>
          <X size={20} />
        </button>
        <h2 style={{marginBottom: '1.5rem', color: 'var(--primary)', paddingRight: '2rem'}}>{current.title}</h2>
        <div style={{lineHeight: '1.6', fontSize: '0.95rem'}}>
          {current.text}
        </div>
        <div style={{marginTop: '2rem', textAlign: 'center'}}>
           <button className="btn" onClick={onClose} style={{width: '100%'}}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
