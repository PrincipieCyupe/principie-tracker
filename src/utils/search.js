// src/utils/search.js
export function filterTransactionsByRegex(transactions, searchPattern) {
    if (!searchPattern || searchPattern.trim() === '') return transactions;
    try {
        // Check if user typed a regex like /abc/i
        const match = searchPattern.match(/^\/(.*)\/([gimsuy]*)$/);
        let regex;
        if (match) {
            regex = new RegExp(match[1], match[2] || 'i');
        } else {
            regex = new RegExp(searchPattern, 'i');
        }
        return transactions.filter(t => regex.test(t.description));
    } catch (e) {
        return transactions; // Return all if regex is invalid
    }
}
