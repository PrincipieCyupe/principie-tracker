// src/utils/validators.js
export const validateTransaction = (formData) => {
    const errors = {};
    const { description, amount, category, date } = formData;
    const REGEX = {
        DESCRIPTION_CLEAN: /^\S(?:.*\S)?$/,
        AMOUNT: /^-?(0|[1-9]\d*)(\.\d{1,2})?$/,
        CATEGORY: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
        DATE: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
    };

    if (!description || !description.trim()) errors.description = "Description is required.";
    else if (!REGEX.DESCRIPTION_CLEAN.test(description.trim())) errors.description = "No leading/trailing spaces.";

    if (!amount || !REGEX.AMOUNT.test(amount)) errors.amount = "Invalid amount (e.g., 10.50).";

    if (!category) errors.category = "Category is required.";

    if (!date || !REGEX.DATE.test(date)) errors.date = "Invalid date format.";

    return errors;
};