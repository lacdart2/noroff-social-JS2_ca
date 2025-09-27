export function getFormData(form) {
    const formData = new FormData(form);
    const result = {};

    for (const [key, value] of formData.entries()) {
        result[key] = typeof value === "string" ? value.trim() : value;
    }

    return result;
}
