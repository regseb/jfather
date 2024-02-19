/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import JFather from "../mod.js";

describe("mod.js", function () {
    describe("JFather", function () {
        it("should export JFather as default", function () {
            assert.deepEqual(Object.keys(JFather), [
                "extend",
                "load",
                "merge",
                "parse",
            ]);
        });
    });
});
