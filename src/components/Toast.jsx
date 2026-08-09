import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import '../styles/toast.css';
export const Toast = () => {
    const { toasts, removeToast } = useApp();
    if (toasts.length === 0)
        return null;
    return (<div className="toast-container">
      {toasts.map((toast) => (<div key={toast.id} className={`toast-item ${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981"/>}
          {toast.type === 'info' && <Info size={18} color="#6366f1"/>}
          {toast.type === 'error' && <AlertCircle size={18} color="#ef4444"/>}
          <span>{toast.text}</span>
          <button onClick={() => removeToast(toast.id)} style={{ color: '#94a3b8', marginLeft: 'auto' }}>
            <X size={14}/>
          </button>
        </div>))}
    </div>);
};
