import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import '../styles/style.css';

export default function Settings() {
    const { currentUser } = useAuth();
    const [currency, setCurrency] = useState('USD');
    const [budgetCap, setBudgetCap] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        if (!currentUser) return;
        const loadSettings = async () => {
            const docRef = doc(db, 'userSettings', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCurrency(data.currency || 'USD');
                setBudgetCap(data.budgetCap || '');
            }
        };
        loadSettings();
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'userSettings', currentUser.uid), {
                currency,
                budgetCap: parseFloat(budgetCap)
            });
            setStatusMsg('Settings Saved Successfully!');
            setTimeout(() => setStatusMsg(''), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            setStatusMsg('Error saving settings.');
        }
    };

    return (
        <div className="container">
            <section className="content-section">
                <h2>Settings & Data Management</h2>
                
                <form onSubmit={handleSave}>
                    <div className="settings-group">
                        <h3>Currency Settings</h3>
                        <p>Choose your main currency for all totals and calculations.</p>
                        <div className="form-group">
                            <label>Base Currency:</label>
                            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                <option value="USD">USD - US Dollar</option>
                                <option value="RWF">RWF - Rwandan Franc</option>
                                <option value="EUR">EUR - Euro</option>
                            </select>
                        </div>
                    </div>

                    <div className="settings-group" style={{ marginTop: '30px' }}>
                        <h3>Monthly Budget Cap</h3>
                        <p className="budget-status" style={{color: 'green', fontWeight: 'bold'}}>
                            Current Budget: {currency} {budgetCap || '0.00'}
                        </p>
                        <div className="form-group">
                            <label>Set Your Budget:</label>
                            <input 
                                type="number" min="0" step="0.01" 
                                value={budgetCap}
                                onChange={(e) => setBudgetCap(e.target.value)}
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Save All Settings</button>
                    </div>
                    {statusMsg && <div className="status-message success" style={{marginTop:'10px'}}>{statusMsg}</div>}
                </form>

                <div className="settings-group" style={{ marginTop: '40px' }}>
                    <h3>Data Management (Backup & Restore)</h3>
                    <p>Your data is saved securely in the cloud. Use these tools to manage local data.</p>
                    <div className="data-actions" style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                        <button className="btn btn-secondary" onClick={() => alert("Export coming soon")}>Export Data (JSON)</button>
                        <button className="btn btn-danger" onClick={() => window.location.reload()}>Refresh App</button>
                    </div>
                </div>
            </section>
        </div>
    );
}