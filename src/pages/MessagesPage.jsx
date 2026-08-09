import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send } from 'lucide-react';
import '../styles/jobs.css';
export const MessagesPage = () => {
    const { addToast } = useApp();
    const [messages, setMessages] = useState([
        { sender: 'Recruiter Sarah', text: 'Hi John! We loved your profile and would love to invite you for a Round 2 technical screen.', time: '10:30 AM' },
        { sender: 'You', text: 'Thank you Sarah! I am available on Thursday morning.', time: '10:35 AM' },
    ]);
    const [input, setInput] = useState('');
    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setMessages([...messages, { sender: 'You', text: input.trim(), time: 'Just now' }]);
            setInput('');
            addToast('Message sent', 'success');
        }
    };
    return (<div className="jobs-page">
      <div className="jobs-page-header">
        <h1 className="jobs-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={24} color="var(--color-primary)"/>
          Messages
        </h1>
      </div>

      <div className="card-container" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(messages || []).map((m, idx) => (<div key={idx} style={{
                alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start',
                backgroundColor: m.sender === 'You' ? 'var(--color-primary)' : 'var(--color-bg-light)',
                color: m.sender === 'You' ? '#ffffff' : 'var(--color-text-main)',
                padding: '12px 18px',
                borderRadius: '16px',
                maxWidth: '70%',
            }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '2px' }}>{m.sender}</div>
              <div>{m.text}</div>
            </div>))}
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
          <input type="text" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
        }}/>
          <button type="submit" className="btn-primary">
            <Send size={16}/>
          </button>
        </form>
      </div>
    </div>);
};
