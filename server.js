import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mockHotels from './src/data/hotels.json' with { type: 'json' };

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Route pour chercher les hôtels
app.post('/api/searchHotels', async (req, res) => {
  const userData = req.body;
  
  try {
    // ÉTAPE 1 : Si on a une clé API Amadeus, on fait une vraie requête ici.
    const amadeusApiKey = process.env.AMADEUS_API_KEY;
    
    if (amadeusApiKey && amadeusApiKey !== 'VOTRE_CLE_API_ICI') {
      console.log('📡 Vraie requête API Amadeus détectée !');
      // Exemple de ce qui serait fait avec Amadeus :
      /*
      const response = await fetch(`https://test.api.amadeus.com/v3/shopping/hotel-offers?cityCode=${userData.destinationCode}&adults=${userData.adults}`, {
        headers: { 'Authorization': `Bearer ${amadeusApiKey}` }
      });
      const data = await response.json();
      return res.json(data);
      */
      
      // En attendant l'implémentation complète Amadeus, on renvoie les mocks
      return res.json({ source: 'amadeus_simulation', data: mockHotels });
    }

    // ÉTAPE 2 : Si on n'a pas de clé API, on renvoie notre base de données mockée
    console.log('🗂️ Aucune clé API valide, utilisation de la base de données locale (Mock)');
    
    // On simule une latence réseau de 1.5 seconde
    setTimeout(() => {
      res.json({ source: 'local_mock', data: mockHotels });
    }, 1500);

  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la recherche des hôtels' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur Backend démarré sur le port ${PORT}`);
  console.log(`🔧 Pour activer la vraie recherche, ajoutez votre clé dans le fichier .env`);
});
