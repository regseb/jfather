/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import JFather from "../src/index.js";

describe("index.js", function () {
    describe("JFather", function () {
        it("should export JFather as default", function () {
            assert.deepEqual(Object.keys(JFather), ["load", "merge", "parse"]);
        });
    });
});
