/**
 * @module jfather
 * @license MIT
 * @author Sébastien Règne
 */

/* @ts-self-types="../types/index.d.ts" */

import { extend, load, merge, parse } from "./jfather.js";

/**
 * @typedef {import('./jfather.js').Options} Options
 */

/**
 * Namespace par défaut de JFather.
 *
 * @namespace
 */
const JFather = { extend, load, merge, parse };

export default JFather;
