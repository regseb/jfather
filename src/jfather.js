/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Les options des fonctions de JFather.
 *
 * @typedef {Object} Options
 * @prop {Function} [request] La fonction pour récupérer un objet JSON à
 *                            distance. Par défaut, l'objet est récupéré avec
 *                            `fetch()` et `Response.json()`.
 */

/**
 * Exécute une fonction sur un objet et tous ses sous-objets (en partant des
 * objets les plus profonds).
 *
 * @param {any}      obj Une variable quelconque.
 * @param {Function} fn  La fonction appliquée sur tous les objets.
 * @returns {any} Le retour de la fonction.
 */
export const walk = function (obj, fn) {
    if (Object === obj?.constructor) {
        return fn(
            Object.fromEntries(
                Object.entries(obj).map(([k, v]) => [k, walk(v, fn)]),
            ),
        );
    }

    if (Array.isArray(obj)) {
        return obj.map((v) => walk(v, fn));
    }

    return obj;
};

/**
 * Exécute une fonction asynchrone sur un objet et tous ses sous-objets (en
 * partant des objets les plus profonds).
 *
 * @param {any}      obj Une variable quelconque.
 * @param {Function} fn  La fonction asynchrone appliquée sur tous les objets.
 * @returns {Promise<any>} Une promesse contenant le retour de la fonction.
 */
export const walkAsync = async function (obj, fn) {
    if (Object === obj?.constructor) {
        return await fn(
            Object.fromEntries(
                await Promise.all(
                    Object.entries(obj).map(async ([key, value]) => [
                        key,
                        await walkAsync(value, fn),
                    ]),
                ),
            ),
        );
    }

    if (Array.isArray(obj)) {
        return await Promise.all(obj.map((v) => walkAsync(v, fn)));
    }

    return obj;
};

/**
 * Clone récursivement un objet.
 *
 * @param {any} obj Une variable quelconque.
 * @returns {any} Le clone de la variable d'entrée.
 */
export const clone = function (obj) {
    return walk(obj, (/** @type {any} */ v) => v);
};

/**
 * Extrait un élément d'un objet.
 *
 * @param {Record<string, any>} obj   L'objet où sera extrait l'élément.
 * @param {string}              chain Le chemin de l'élément.
 * @returns {any} L'élément extrait.
 * @throws {TypeError} Si le chemin est invalide.
 */
export const query = function (obj, chain) {
    if ("" === chain) {
        return obj;
    }

    const re = /^\.(?<prop>\w+)|^\[(?<index>\d+)\]/u;
    const sub = {
        obj,
        // Préfixer le chemin avec un point si nécessaire.
        chain: /^[.[]/u.test(chain) ? chain : "." + chain,
    };
    while (0 !== sub.chain.length) {
        const result = re.exec(sub.chain);
        if (undefined !== result?.groups?.prop) {
            sub.obj = sub.obj[result.groups.prop];
            // eslint-disable-next-line no-negated-condition
        } else if (undefined !== result?.groups?.index) {
            sub.obj = sub.obj[Number(result.groups.index)];
        } else {
            throw new TypeError(`Invalid chain: ${chain}`);
        }
        sub.chain = sub.chain.slice(result[0].length);
    }
    return sub.obj;
};

/**
 * Fusionne deux objets récursivement.
 *
 * @param {any} parent L'objet parent.
 * @param {any} child  L'objet enfant.
 * @returns {any} La fusion des deux objets.
 */
export const merge = function (parent, child) {
    if (Object !== parent?.constructor || Object !== child?.constructor) {
        return clone(child);
    }

    const overridden = /** @type {Record<string, any>} */ ({});
    for (const key of new Set([
        ...Object.keys(parent),
        ...Object.keys(child),
    ])) {
        // Ne pas copier les surcharges d'éléments.
        if (key.startsWith("$")) {
            continue;
        }

        // Si la propriété est dans les deux objets : fusionner les deux
        // valeurs.
        if (key in parent && key in child) {
            overridden[key] = merge(parent[key], child[key]);
            // Si la propriété est seulement dans l'objet parent.
        } else if (key in parent) {
            overridden[key] = clone(parent[key]);
            // Si la propriété est seulement dans l'objet enfant.
        } else {
            overridden[key] = clone(child[key]);
        }

        // Si la valeur est un tableau : chercher si l'objet enfant a des
        // surcharges d'éléments.
        if (Array.isArray(overridden[key])) {
            const overelemRegex = new RegExp(
                `^\\$${key}\\[(?<index>\\d*)\\]$`,
                "u",
            );
            const overelems = Object.entries(child)
                .map(([k, v]) => [overelemRegex.exec(k)?.groups?.index, v])
                .filter(([i]) => undefined !== i);
            for (const [index, value] of overelems) {
                if ("" === index) {
                    overridden[key].push(...clone(value));
                } else {
                    overridden[key][Number(index)] = merge(
                        overridden[key][Number(index)],
                        value,
                    );
                }
            }
        }
    }
    return overridden;
};

/**
 * Étendre un objet JSON en utilisant la propriété `"$extends"`.
 *
 * @param {Record<string, any>} obj       L'objet qui sera étendu.
 * @param {Options}             [options] Les options.
 * @returns {Promise<Record<string, any>>} Une promesse contenant l'objet
 *                                         étendu.
 */
export const inherit = async function (obj, options) {
    if (undefined === obj.$extends) {
        return obj;
    }

    // eslint-disable-next-line no-use-before-define
    return merge(await load(obj.$extends, options), obj);
};

/**
 * Étendre un objet récursivement.
 *
 * @param {any}     obj       L'objet qui sera étendu.
 * @param {Options} [options] Les options.
 * @returns {Promise<any>} Une promesse contenant l'objet étendu.
 */
export const extend = function (obj, options) {
    return walkAsync(obj, (/** @type {any} */ v) => inherit(v, options));
};

/**
 * Charge un objet JSON depuis une URL.
 *
 * @param {string|URL} url       L'URL du fichier JSON.
 * @param {Options}    [options] Les options.
 * @returns {Promise<any>} Une promesse contenant l'objet.
 */
export const load = async function (url, options) {
    let json;
    if (undefined === options?.request) {
        const response = await fetch(url);
        json = await response.json();
    } else {
        json = await options.request(url);
    }
    // Enlever le "#" dans le hash de l'URL.
    return await extend(query(json, new URL(url).hash.slice(1)), options);
};

/**
 * Parse une chaine de caractères.
 *
 * @param {string}  text      La chaine de caractères qui sera parsée.
 * @param {Options} [options] Les options.
 * @returns {Promise<any>} L'objet.
 */
export const parse = function (text, options) {
    return extend(JSON.parse(text), options);
};
