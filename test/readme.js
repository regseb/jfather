/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import JFather from "../src/index.js";

// Tester les exemples présents dans le README.
describe("README.md", function () {
    describe("Overview", function () {
        it("Merge", function () {
            const merged = JFather.merge(
                { foo: "a", bar: "alpha" },
                { foo: "b", baz: "beta" },
            );

            assert.deepEqual(merged, { foo: "b", bar: "alpha", baz: "beta" });
        });

        it("Extend", async function () {
            const extended = await JFather.extend({
                $extends:
                    "https://mdn.github.io/learning-area/javascript/oojs/json" +
                    "/superheroes.json#members[1]",
                age: 34,
                quote: "With great fist comes great KO",
            });

            assert.deepEqual(extended, {
                name: "Madame Uppercut",
                age: 34,
                secretIdentity: "Jane Wilson",
                powers: [
                    "Million tonne punch",
                    "Damage resistance",
                    "Superhuman reflexes",
                ],
                quote: "With great fist comes great KO",
            });
        });

        it("Override", async function () {
            const overridden = await JFather.merge(
                { foo: ["a", "alpha"] },
                { "$foo[0]": "A", "$foo[]": ["BETA"] },
            );

            assert.deepEqual(overridden, {
                foo: ["A", "alpha", "BETA"],
            });
        });

        it("All-in", async function () {
            const allIn = await JFather.extend({
                $extends:
                    "https://mdn.github.io/learning-area/javascript/oojs/json" +
                    "/superheroes.json#members[0]",
                age: 27,
                "$powers[2]": "Atomic breath",
                "$powers[]": ["Matter Creation", "Reality Warping"],
                quote: "I'm no God. I'm not even a man. I'm just Molecule Man.",
            });

            assert.deepEqual(allIn, {
                name: "Molecule Man",
                age: 27,
                secretIdentity: "Dan Jukes",
                powers: [
                    "Radiation resistance",
                    "Turning tiny",
                    "Atomic breath",
                    "Matter Creation",
                    "Reality Warping",
                ],
                quote: "I'm no God. I'm not even a man. I'm just Molecule Man.",
            });
        });
    });

    describe("Features", function () {
        describe("Merge", function () {
            it("Numbers", function () {
                const merged = JFather.merge(1, 2);

                assert.deepEqual(merged, 2);
            });

            it("Objects", function () {
                const merged = JFather.merge(
                    { foo: "alpha", bar: "ALPHA" },
                    { foo: "beta", baz: "BETA" },
                );

                assert.deepEqual(merged, {
                    foo: "beta",
                    bar: "ALPHA",
                    baz: "BETA",
                });
            });

            it("Arrays", function () {
                const merged = JFather.merge(
                    { foo: [1, 10, 11] },
                    { foo: [2, 20, 22] },
                );

                assert.deepEqual(merged, { foo: [2, 20, 22] });
            });
        });

        describe("Extend", function () {
            it("Empty", async function () {
                const stub = sinon
                    .stub(globalThis, "fetch")
                    .resolves(Response.json({ baz: "qux" }));

                const extended = await JFather.extend({
                    $extends: "https://foo.bar/parent.json",
                });

                assert.deepEqual(extended, { baz: "qux" });

                assert.equal(stub.callCount, 1);
                assert.deepEqual(stub.firstCall.args, [
                    "https://foo.bar/parent.json",
                ]);
            });

            it("Replace", async function () {
                const stub = sinon
                    .stub(globalThis, "fetch")
                    .resolves(Response.json({ baz: "qux" }));

                const extended = await JFather.extend({
                    $extends: "https://foo.bar/parent.json",
                    baz: "quux",
                });

                assert.deepEqual(extended, { baz: "quux" });

                assert.equal(stub.callCount, 1);
                assert.deepEqual(stub.firstCall.args, [
                    "https://foo.bar/parent.json",
                ]);
            });

            it("Add", async function () {
                const stub = sinon
                    .stub(globalThis, "fetch")
                    .resolves(Response.json({ baz: "qux" }));

                const extended = await JFather.extend({
                    $extends: "https://foo.bar/parent.json",
                    quux: "corge",
                });

                assert.deepEqual(extended, { baz: "qux", quux: "corge" });

                assert.equal(stub.callCount, 1);
                assert.deepEqual(stub.firstCall.args, [
                    "https://foo.bar/parent.json",
                ]);
            });

            it("Child", async function () {
                const stub = sinon
                    .stub(globalThis, "fetch")
                    .resolves(Response.json({ baz: "qux" }));

                const extended = await JFather.extend({
                    quux: {
                        $extends: "https://foo.bar/parent.json",
                        corge: "grault",
                    },
                });

                assert.deepEqual(extended, {
                    quux: { baz: "qux", corge: "grault" },
                });

                assert.equal(stub.callCount, 1);
                assert.deepEqual(stub.firstCall.args, [
                    "https://foo.bar/parent.json",
                ]);
            });

            it("Query", async function () {
                const stub = sinon.stub(globalThis, "fetch").resolves(
                    Response.json({
                        baz: { qux: [1, 2], quux: "a" },
                        corge: true,
                    }),
                );

                const extended = await JFather.extend({
                    $extends: "https://foo.bar/parent.json#baz",
                });

                assert.deepEqual(extended, { qux: [1, 2], quux: "a" });

                assert.equal(stub.callCount, 1);
                assert.deepEqual(stub.firstCall.args, [
                    "https://foo.bar/parent.json#baz",
                ]);
            });
        });

        describe("Override", function () {
            it("Add", function () {
                const merged = JFather.merge(
                    { foo: ["a", "Alpha"] },
                    { "$foo[]": ["b", "Beta"] },
                );

                assert.deepEqual(merged, { foo: ["a", "Alpha", "b", "Beta"] });
            });

            it("Replace", function () {
                const merged = JFather.merge(
                    { foo: ["a", "Alpha"] },
                    { "$foo[0]": "A" },
                );

                assert.deepEqual(merged, { foo: ["A", "Alpha"] });
            });

            it("All-in", function () {
                const merged = JFather.merge(
                    { foo: [{ bar: ["a"] }] },
                    { "$foo[0]": { "$bar[]": ["b", "c"] } },
                );

                assert.deepEqual(merged, {
                    foo: [{ bar: ["a", "b", "c"] }],
                });
            });
        });
    });
});
