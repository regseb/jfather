/**
 * Prothèses pour des APIs de Node.js qui ne sont pas dans Bun.
 *
 * @license MIT
 * @author Sébastien Règne
 */

import { mock as mockNode } from "node:test";
// eslint-disable-next-line n/no-missing-import, import/no-unresolved
import { mock as mockBun, spyOn } from "bun:test";

/**
 * @import { Mock } from "node:test"
 */

/**
 * Résultat d'une fonction mockée.
 *
 * @typedef {Object} MockFunctionResult
 * @prop {string} type  Type du résultat (`"incomplete"`, `"return"` ou
 *                      `"throw"`).
 * @prop {any}    value Valeur du résultat pour le type `"return"`.
 * @see https://github.com/oven-sh/bun/blob/bun-v1.3.5/packages/bun-types/test.d.ts#L2101
 */

/**
 * Le gestionnaire du proxy pour adapter l'API de Bun à celle de Node.js.
 *
 * @type {Object}
 * @see https://bun.com/docs/runtime/nodejs-compat#node%3Atest
 * @see https://github.com/oven-sh/bun/issues/24255
 */
const handler = {
    /**
     * Modifie la propriété `mock` pour qu'elle corresponde à l'API de Node.js.
     *
     * @param {any}    target Une fonction mockée par Bun.
     * @param {string} key    Le nom de la propriété.
     * @returns {any} La valeur de la propriété.
     */
    get(target, key) {
        if ("mock" !== key) {
            return Reflect.get(target, key);
        }
        return {
            callCount: () =>
                target.mock.results.filter(
                    (/** @type {MockFunctionResult} */ r) =>
                        "incomplete" !== r.type,
                ).length,
            get calls() {
                const calls = [];
                for (let i = 0; i < target.mock.calls.length; ++i) {
                    calls.push({
                        arguments: target.mock.calls[i],
                        this: target.mock.contexts[i],
                    });
                }
                return calls;
            },
        };
    },
};

/**
 * Crée un mock de fonction.
 *
 * @param {Function} [implementation] L'implémentation de la fonction mockée.
 * @returns {Mock<Function>} La fonction mockée.
 * @see https://nodejs.org/api/test.html#mockfnoriginal-implementation-options
 */
mockNode.fn = (implementation) => {
    // @ts-expect-error
    return new Proxy(mockBun(implementation), handler);
};

/**
 * Crée un mock pour une méthode d'un objet.
 *
 * @template {Object} T Le type de l'objet.
 * @param {T}                                            object         L'objet
 *                                                                      contenant
 *                                                                      la
 *                                                                      méthode
 *                                                                      à
 *                                                                      mocker.
 * @param {keyof T}                                      methodName     Le nom
 *                                                                      de la
 *                                                                      méthode
 *                                                                      à
 *                                                                      mocker.
 * @param {Extract<T[keyof T], (...args: any[]) => any>} implementation L'implémentation
 *                                                                      de la
 *                                                                      méthode
 *                                                                      mockée.
 * @returns {Mock<Function>} La méthode mockée.
 * @see https://nodejs.org/api/test.html#mockmethodobject-methodname-implementation-options
 */
mockNode.method = (object, methodName, implementation) => {
    // @ts-expect-error
    return new Proxy(
        spyOn(object, methodName).mockImplementation(implementation),
        handler,
    );
};

/**
 * Annule les mocks.
 *
 * @see https://nodejs.org/api/test.html#mockreset
 */
mockNode.reset = () => {
    mockBun.restore();
};
