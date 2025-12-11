import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Import 'doc'
import { useAuth } from '../context/AuthContext';
import { validateTransaction } from '../utils/validators';
import { filterTransactionsByRegex } from '../utils/search';
import '../styles/style.css';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    
    // NEW: State for User Settings (Currency & Budget)
    const [currency, setCurrency] = useState('USD'); 
    const [budgetCap, setBudgetCap] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ description: '', amount: '', category: '', date: '' });
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [statusMsg, setStatusMsg] = useState('');

    // 1. FETCH TRANSACTIONS & SETTINGS
    useEffect(() => {
        if (!currentUser) return;
        
        // A. Listen to Transactions
        const q = query(collection(db, 'transactions'), where('uid', '==', currentUser.uid));
        const unsubTrans = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTransactions(data);
        });

        // B. Listen to User Settings (Real-time Sync!)
        const settingsRef = doc(db, 'userSettings', currentUser.uid);
        const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCurrency(data.currency || 'USD');
                setBudgetCap(data.budgetCap || 0);
            }
        });

        return () => {
            unsubTrans();
            unsubSettings();
        };
    }, [currentUser]);

    // 2. CALCULATE STATS (Using the dynamic currency/budget)
    const totalSpent = transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);
    const budgetRemaining = budgetCap - totalSpent;

    // ... (Keep existing Helper Functions: categoryTotals, handleSubmit, handleDelete, handleEdit) ...
    // Note: I am abbreviating the logic here to save space, but you should keep your existing logic for handleSubmit/Delete/Edit
    
    // --- RE-INSERT YOUR ORIGINAL LOGIC FUNCTIONS HERE ---
    const categoryTotals = transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
        return acc;
    }, {});
    const topCategory = Object.keys(categoryTotals).sort((a,b) => categoryTotals[b] - categoryTotals[a])[0] || 'N/A';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateTransaction(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            try {
                if (editingId) {
                    await updateDoc(doc(db, 'transactions', editingId), { ...formData, amount: parseFloat(formData.amount) });
                    setStatusMsg('Updated!'); setEditingId(null);
                } else {
                    await addDoc(collection(db, 'transactions'), { ...formData, amount: parseFloat(formData.amount), uid: currentUser.uid, createdAt: new Date().toISOString() });
                    setStatusMsg('Saved!');
                }
                setFormData({ description: '', amount: '', category: '', date: '' });
                setTimeout(() => setStatusMsg(''), 3000);
            } catch (err) { setStatusMsg('Error saving.'); }
        }
    };

    const handleDelete = async (id) => { if (confirm('Delete?')) await deleteDoc(doc(db, 'transactions', id)); };
    
    const handleEdit = (t) => {
        setFormData({ description: t.description, amount: t.amount, category: t.category, date: t.date });
        setEditingId(t.id);
        window.location.href = '#add-transaction-heading';
    };
    
    const filteredData = filterTransactionsByRegex(transactions, searchTerm);

    return (
        <div className="container">
            {/* DASHBOARD STATS */}
            <section id="dashboard" className="content-section">
                <h2>Financial Snapshot</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <p className="stat-label">Total Spent</p>
                        {/* DYNAMIC CURRENCY */}
                        <p className="stat-value">{currency} {totalSpent.toFixed(2)}</p>
                    </div>
                    <div className={`stat-card ${budgetRemaining < 0 ? 'bg-red' : 'bg-green'}`}>
                        <p className="stat-label">Budget Remaining</p>
                        {/* DYNAMIC CURRENCY */}
                        <p className="stat-value">{currency} {budgetRemaining.toFixed(2)}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Top Category</p>
                        <p className="stat-value">{topCategory}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Total Records</p>
                        <p className="stat-value">{transactions.length}</p>
                    </div>
                </div>

                <h2 style={{ marginTop: '40px' }}>Transaction Records</h2>
                <div className="controls-section">
                    <div className="search-box">
                        <label>Search Description:</label>
                        <input type="text" placeholder="Filter..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table id="records-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(t => (
                                <tr key={t.id}>
                                    <td data-label="Date">{t.date}</td>
                                    {/* DYNAMIC CURRENCY IN TABLE */}
                                    <td data-label="Amount" style={{fontWeight:'bold'}}>{currency} {parseFloat(t.amount).toFixed(2)}</td>
                                    <td data-label="Category">{t.category}</td>
                                    <td data-label="Description">{t.description}</td>
                                    <td data-label="Actions">
                                        <button onClick={() => handleEdit(t)} className="btn-icon">✎</button>
                                        <button onClick={() => handleDelete(t.id)} className="btn-icon" style={{color:'red'}}>✕</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>No records found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FORM SECTION */}
            <section id="add-new-transaction" className="form-section">
                <h2 id="add-transaction-heading">{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                <form onSubmit={handleSubmit}>
                     {/* ... KEEP YOUR FORM INPUTS HERE EXACTLY AS BEFORE ... */}
                     <div className="form-group">
                        <label>Description</label>
                        <input type="text" value={formData.description} onChange={(e)=>setFormData({...formData, description:e.target.value})} />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                     </div>
                     <div className="form-group">
                        <label>Amount</label>
                        <input type="number" step="0.01" value={formData.amount} onChange={(e)=>setFormData({...formData, amount:e.target.value})} />
                        {errors.amount && <span className="error-message">{errors.amount}</span>}
                     </div>
                     <div className="form-group">
                        <label>Category</label>
                        <select value={formData.category} onChange={(e)=>setFormData({...formData, category:e.target.value})}>
                            <option value="">-- Select --</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Other">Other</option>
                        </select>
                         {errors.category && <span className="error-message">{errors.category}</span>}
                     </div>
                     <div className="form-group">
                        <label>Date</label>
                        <input type="date" value={formData.date} onChange={(e)=>setFormData({...formData, date:e.target.value})} />
                         {errors.date && <span className="error-message">{errors.date}</span>}
                     </div>
                     <div className="form-actions">
                        <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Save'}</button>
                     </div>
                     {statusMsg && <div className="status-message success">{statusMsg}</div>}
                </form>
            </section>
        </div>
    );
}