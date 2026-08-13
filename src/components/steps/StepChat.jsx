import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';
import { analyzeTravelRequest } from '../../utils/nlp';

export const StepChat = ({ setStep, setData }) => {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Bonjour ! 👋 Je suis votre assistant voyage. Dites-moi en une phrase où vous voulez aller, avec qui (adultes/enfants) et votre budget !" }
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
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking
      
      const userHistory = newMessages.filter(m => m.role === 'user');
      const { extractedData, hasEnoughInfo } = analyzeTravelRequest(userInput, userHistory);
      
      if (hasEnoughInfo || userHistory.length >= 3) {
        // We have enough data OR user has chatted 3 times, let's move on
        setChatMessages(prev => [...prev, { role: 'assistant', content: "Parfait, j'ai tout compris ! 🚀 Je prépare votre recherche..." }]);
        setTimeout(() => {
          setData(prev => {
            const newData = { ...prev, ...extractedData };
            // Ensure priorities object exists
            if (!newData.priorities) newData.priorities = {};
            if (extractedData.priorities) {
              newData.priorities = { ...prev.priorities, ...extractedData.priorities };
            }
            return newData;
          });
          setStep(2);
        }, 1200);
      } else {
        // Missing info, ask generic follow up based on what's missing
        let q = "Super projet ! ";
        if (!extractedData.budget) q += "Quel serait votre budget approximatif ? ";
        else if (!extractedData.adults) q += "Combien de personnes partent ? ";
        else q += "Qu'est-ce qui est le plus important pour vous (plage, calme, piscine...) ? ";
        
        // Save partial data silently
        setData(prev => {
          const newData = { ...prev, ...extractedData };
          if (extractedData.priorities) {
            newData.priorities = { ...prev.priorities, ...extractedData.priorities };
          }
          return newData;
        });

        setChatMessages(prev => [...prev, { role: 'assistant', content: q }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Oups, je réfléchis trop fort. On passe au manuel ?" }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="fade-in" style={{maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '60vh', maxHeight: '600px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
        <div style={{background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '50%'}}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{margin: 0, fontSize: '1.25rem'}}>Assistant IA</h2>
          <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem'}}>Je comprends le langage naturel</p>
        </div>
      </div>

      <div style={{flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        {chatMessages.map((msg, i) => (
          <div key={i} className="fade-in" style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? 'var(--gradient-main)' : 'var(--border)',
            color: msg.role === 'user' ? 'white' : 'var(--text-main)',
            padding: '1rem',
            borderRadius: '16px',
            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
            borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
            maxWidth: '85%',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            {msg.content}
          </div>
        ))}
        {isThinking && (
          <div className="fade-in" style={{alignSelf: 'flex-start', background: 'var(--border)', color: 'var(--text-main)', padding: '1rem', borderRadius: '16px', borderBottomLeftRadius: '4px'}}>
            <span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{marginTop: '1rem'}}>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <input 
            type="text" 
            className="form-input"
            placeholder="Ex: On veut partir en Espagne pour 1000€..."
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isThinking}
            style={{flex: 1, marginBottom: 0}}
          />
          <button className="btn" onClick={sendMessage} disabled={!userInput.trim() || isThinking} style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center'}}>
            <Send size={18}/>
          </button>
        </div>
        <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
          <button className="btn-secondary" onClick={() => setStep(1)} style={{fontSize: '0.9rem'}}>
            Passer au formulaire classique →
          </button>
        </div>
      </div>
    </div>
  );
};
