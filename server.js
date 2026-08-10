import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Charger les hôtels depuis le fichier JSON
const mockHotels = JSON.parse(readFileSync('./src/data/hotels.json', 'utf-8'));

// --- ROUTE: RECHERCHE D'HOTELS ---
app.post('/api/searchHotels', async (req, res) => {
  console.log('🗂️ Recherche d\'hôtels...');
  // Simuler un léger délai réseau
  setTimeout(() => {
    res.json({ source: 'local_mock', data: mockHotels });
  }, 800);
});

// --- ROUTE: CHATBOT IA (Conversation multi-tours) ---
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body; // tableau de messages [{role, content}]
  const geminiApiKey = process.env.GEMINI_API_KEY;

  try {
    if (geminiApiKey && geminiApiKey !== 'VOTRE_CLE_GEMINI_ICI') {
      console.log('🧠 Requête LLM vers Gemini...');
      const genAI = new GoogleGenerativeAI(geminiApiKey);

      const systemText = `Tu es l'assistant voyage SmartStay Premium. Tu aides les familles a trouver leur sejour ideal.

REGLES IMPORTANTES :
1. Tu dois collecter TOUTES ces informations avant de finaliser :
   - Destination souhaitee (pays, region, ou partout)
   - Dates de voyage (debut et fin)
   - Nombre d'adultes et d'enfants
   - Budget total maximum en euros
   - Priorites (plage, piscine, calme, luxe, nature, enfants, sport, spa, gastronomie)
   - Type de logement (hotel, camping, appartement, village vacances)

2. Si des informations manquent, pose UNE question claire et amicale pour les obtenir. Ne demande pas tout d'un coup.

3. Quand tu as TOUTES les infos, reponds UNIQUEMENT avec un bloc JSON sans backticks au format :
{"ready": true, "data": {"destinationType": "country", "destinationCountry": "Espagne", "destinationRegion": "", "dateStart": "2026-08-10", "dateEnd": "2026-08-17", "adults": 2, "children": 2, "budget": 2000, "stayType": ["hotel"], "priorities": {"pool": 5, "beach": 4, "clean": 5, "kids": 3, "quiet": 4, "luxury": 2, "spa": 1, "food": 3, "nature": 2, "sport": 1}}}

4. Si tu n'as PAS encore toutes les infos, reponds avec un JSON sans backticks :
{"ready": false, "question": "Ta question ici en francais"}

5. Sois chaleureux, bref et efficace. Utilise des emojis. Tutoie l'utilisateur.`;

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: { parts: [{ text: systemText }] }
      });

      // Construire l'historique de conversation pour Gemini
      const chatHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const chat = model.startChat({
        history: chatHistory.slice(0, -1)
      });

      const lastMessage = chatHistory[chatHistory.length - 1];
      const result = await chat.sendMessage(lastMessage.parts[0].text);
      const responseText = result.response.text();
      console.log('Reponse Gemini:', responseText);

      // Essayer de parser la reponse comme du JSON
      try {
        let cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, ...parsed });
      } catch {
        return res.json({ success: true, ready: false, question: responseText });
      }
    } else {
      // --- MODE SIMULATION (sans clé API) ---
      console.log('🧠 Mode simulation IA (pas de clé Gemini)');
      const lastMsg = messages[messages.length - 1].content.toLowerCase();
      const turnCount = messages.filter(m => m.role === 'user').length;

      if (turnCount === 1) {
        return res.json({
          success: true,
          ready: false,
          question: "Super projet de voyage ! 🌴 Pour te trouver le séjour parfait, j'ai besoin de quelques précisions. Combien de personnes partent (adultes et enfants) ?"
        });
      } else if (turnCount === 2) {
        return res.json({
          success: true,
          ready: false,
          question: "Parfait ! 👨‍👩‍👧‍👦 Et quel est votre budget maximum pour l'ensemble du séjour (transport + logement) ?"
        });
      } else if (turnCount === 3) {
        return res.json({
          success: true,
          ready: false,
          question: "Très bien ! 💰 Dernière question : qu'est-ce qui est le plus important pour vous ? La plage, la piscine, le calme, les activités pour enfants ?"
        });
      } else {
        // Après 4 échanges, on finalise avec des valeurs simulées
        return res.json({
          success: true,
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
        });
      }
    }
  } catch (error) {
    console.error('Erreur IA:', error.message || error);
    // En cas d'erreur Gemini, on bascule sur la simulation
    return res.json({
      success: true,
      ready: false,
      question: "Hmm, j'ai eu un petit souci technique 🤔 Peux-tu me redonner les détails de ton voyage ? (destination, dates, nombre de personnes, budget)"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur Backend démarré sur le port ${PORT}`);
  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'VOTRE_CLE_GEMINI_ICI';
  console.log(hasGemini ? '🧠 Mode IA : Gemini activé' : '🧠 Mode IA : Simulation locale');
});
