
/**
 * Converte 'true' ou 'false' strings para Boolean
 * @param {string} str String com o valor esperado 'true' ou 'false'
 * @returns {boolean}
 */
export const stringToBool = (str) => {
    if (!str || str === undefined) throw new Error('Não foi possível converter para boolean, valor indefinido.');

    const allowedStrings = ['true', 'false'];
    if (allowedStrings.includes(str.toLowerCase())){
        if (str === 'true') return true;
        if (str === 'false') return false;
    }
    else {
        throw new Error('Valor esperado: "true" ou "false". Valor recebido: ', str);
    }
}