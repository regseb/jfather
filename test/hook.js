/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import sinon from "sinon";

export const mochaHooks = {
    afterEach: () => {
        sinon.restore();
    },
};
