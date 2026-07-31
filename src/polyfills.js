/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/* @ts-self-types="../types/polyfills.d.ts" */

if (!("escape" in RegExp)) {
    /**
     * Échappe les caractères spéciaux d'une chaîne de caractères pour
     * l'utiliser dans une expression régulière.
     *
     * @param {string} str La chaîne de caractères à échapper.
     * @returns {string} La chaîne de caractères échappée.
     * @see https://developer.mozilla.org/Web/JavaScript/Reference/Global_Objects/RegExp/escape
     */
    // @ts-expect-error -- Ajouter une prothèse dans la classe RegExp.
    RegExp.escape = (str) => {
        return str
            .replaceAll(/[$\(\)*+.?\[\\\]^\{\|\}]/gv, String.raw`\$&`)
            .replaceAll(",", String.raw`\x2c`);
    };
}

if (!("concat" in Iterator)) {
    /**
     * Concatène les valeurs de plusieurs itérateurs.
     *
     * @param {...Iterable<any>} its Liste des itérateurs à concaténer.
     * @returns {IteratorObject<any>} Itérateur contenant les valeurs des
     *                                itérateurs.
     * @see https://developer.mozilla.org/Web/JavaScript/Reference/Global_Objects/Iterator/concat
     */
    // @ts-expect-error -- Ajouter une prothèse dans la classe Iterator.
    Iterator.concat = (...its) => {
        return Iterator.from(its.flat());
    };
}
