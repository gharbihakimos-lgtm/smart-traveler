import React, { useState } from 'react';
import { X, Check, Bed, Utensils, Calendar, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function BookingModal({ hotel, nightsCount = 5, formatPrice, onClose }) {
  const roomTypes = hotel.roomTypes || [
    { id: 'std', name: 'Chambre Standard Confort', priceMultiplier: 1, beds: '1 Lit Double', size: '24 m²' },
    { id: 'sup', name: 'Chambre Supérieure Vue Mer', priceMultiplier: 1.25, beds: '1 Lit King-Size', size: '32 m²' }
  ];

  const mealPlans = [
    { id: 'none', name: 'Hébergement seul', extraPerNight: 0, desc: 'Sans repas inclus' },
    { id: 'bf', name: 'Petit-déjeuner inclus ☕', extraPerNight: 15, desc: 'Buffet gourmand chaque matin' },
    { id: 'half', name: 'Demi-Pension 🍽️', extraPerNight: 35, desc: 'Petit-déjeuner + Dîner' },
    { id: 'all', name: 'Tout Inclus (All-Inclusive) 🍹', extraPerNight: 60, desc: 'Repas + Boissons illimitées' }
  ];

  const [selectedRoom, setSelectedRoom] = useState(roomTypes[0]);
  const [selectedMeal, setSelectedMeal] = useState(mealPlans[1]); // Breakfast default
  const [guestName, setGuestName] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Calculations
  const roomNightPrice = Math.round(hotel.basePricePerNight * selectedRoom.priceMultiplier);
  const mealNightPrice = selectedMeal.extraPerNight;
  const totalPricePerNight = roomNightPrice + mealNightPrice;
  const grandTotal = totalPricePerNight * nightsCount;
  const touristTax = Math.round(nightsCount * 2.5);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error("Veuillez saisir le nom du voyageur principal.");
      return;
    }

    const ref = 'SMART-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(ref);
    setIsBooked(true);
    toast.success("Réservation confirmée avec succès !");
  };

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

        {!isBooked ? (
          <form onSubmit={handleConfirm}>
            <div style={{ paddingRight: '2.5rem', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Options de réservation sur mesure
              </span>
              <h2 style={{ fontSize: '1.5rem', margin: '0.2rem 0' }}>{hotel.name}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                📍 {hotel.location} • Séjour de {nightsCount} nuits
              </p>
            </div>

            {/* 1. Room Type Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <Bed size={18} style={{ color: 'var(--primary)' }} /> 1. Choisissez votre hébergement
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {roomTypes.map(room => {
                  const isSelected = selectedRoom.id === room.id;
                  const price = Math.round(hotel.basePricePerNight * room.priceMultiplier);
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      style={{
                        background: isSelected ? 'rgba(20, 184, 166, 0.06)' : 'var(--border)',
                        border: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                        borderRadius: '16px', padding: '1rem', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '1rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                          {room.name}
                        </strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          🛏️ {room.beds} • 📐 {room.size}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                          {formatPrice(price)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>/ nuit</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Meal Plan Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <Utensils size={18} style={{ color: 'var(--primary)' }} /> 2. Formule Repas
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {mealPlans.map(meal => {
                  const isSelected = selectedMeal.id === meal.id;
                  return (
                    <div
                      key={meal.id}
                      onClick={() => setSelectedMeal(meal)}
                      style={{
                        background: isSelected ? 'rgba(20, 184, 166, 0.06)' : 'var(--border)',
                        border: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                        borderRadius: '14px', padding: '0.85rem', cursor: 'pointer', textAlign: 'center'
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        {meal.name}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>
                        {meal.extraPerNight === 0 ? 'Inclus' : `+${meal.extraPerNight}€ / nuit`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Traveler Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Nom & Prénom du voyageur principal *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Jean Dupont"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                required
                style={{ padding: '0.75rem 1rem' }}
              />
            </div>

            {/* 4. Price Calculation Breakdown Box */}
            <div style={{
              background: 'var(--border)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span>{selectedRoom.name} ({nightsCount} nuits × {formatPrice(roomNightPrice)})</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(roomNightPrice * nightsCount)}</span>
              </div>
              {selectedMeal.extraPerNight > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span>Formule {selectedMeal.name} ({nightsCount} nuits)</span>
                  <span style={{ fontWeight: 600 }}>+{formatPrice(mealNightPrice * nightsCount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <span>Taxes de séjour & frais</span>
                <span>{formatPrice(touristTax)}</span>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '0.75rem', borderTop: '2px dashed rgba(0,0,0,0.1)'
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Estimé du Séjour</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatPrice(grandTotal + touristTax)}
                </span>
              </div>
            </div>

            <button className="btn" type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              <ShieldCheck size={20} /> Confirmer la réservation
            </button>
          </form>
        ) : (
          /* Confirmation Receipt View */
          <div className="fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Check size={36} />
            </div>

            <span style={{ color: 'var(--success)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>
              Réservation Confirmée !
            </span>
            <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>Merci, {guestName} !</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Votre demande a bien été enregistrée pour <strong>{hotel.name}</strong>.
            </p>

            <div style={{
              background: 'var(--border)', padding: '1.25rem', borderRadius: '16px',
              textAlign: 'left', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>N° de référence :</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{bookingRef}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hébergement :</span>
                <span style={{ fontWeight: 600 }}>{selectedRoom.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Formule Repas :</span>
                <span style={{ fontWeight: 600 }}>{selectedMeal.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <span style={{ fontWeight: 700 }}>Total Règlement :</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>
                  {formatPrice(grandTotal + touristTax)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }} onClick={() => window.print()}>
                <Download size={18} /> Imprimer reçu
              </button>
              <button className="btn" style={{ flex: 1 }} onClick={onClose}>
                Terminer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
