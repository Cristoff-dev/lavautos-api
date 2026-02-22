const formatEmailInvalid = (email) => !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const formatPasswordInvalid = (password) => !/^[a-zA-Z0-9!@#$%&*()_+\-=\[\]{}|;:',.]+$/.test(password);
const formatNamesInvalid = (data) => !/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/.test(data);
const formatNumberInvalid = (data) => !/^[0-9]+$/.test(data);
const formatMoneyInvalid = (data) => !/^[0-9.]+$/.test(data);
const formatDateInvalid = (data) => !/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/.test(data);

// Específicos para Lavautos
const formatPlacaInvalid = (placa) => {
    // Acepta formatos comunes: ABC1234, ABC-123, etc (5 a 10 caracteres)
    const expression = /^[A-Z0-9-]{5,10}$/i;
    return !expression.test(placa);
}

const formatDescriptionInvalid = (data) => !/^[A-Za-z0-9\s().,áéíóúÁÉÍÓÚüÜ]+$/.test(data);

export default {
    formatEmailInvalid, formatPasswordInvalid, formatNamesInvalid,
    formatNumberInvalid, formatMoneyInvalid, formatDateInvalid, 
    formatPlacaInvalid, formatDescriptionInvalid
};