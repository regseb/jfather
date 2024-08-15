/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import JFather from "../mod.js";

describe("mod.js", () => {
    describe("JFather", () => {
        it("should export JFather as default", () => {
            assert.deepEqual(Object.keys(JFather), [
                "extend",
                "load",
                "merge",
                "parse",
            ]);
        });
    });
});
