/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import JFather from "../src/index.js";

// Tester les exemples présents dans le README.
describe("README.md", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("Overview", () => {
        it("Merge", () => {
            const merged = JFather.merge(
                { foo: "a", bar: "alpha" },
                { foo: "b", baz: "beta" },
            );

            assert.deepEqual(merged, { foo: "b", bar: "alpha", baz: "beta" });
        });

        it("Extend", async () => {
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

        it("Override", () => {
            const overridden = JFather.merge(
                { foo: ["a", "alpha"] },
                { "$foo[0]": "A", "$foo[]": ["BETA"] },
            );

            assert.deepEqual(overridden, {
                foo: ["A", "alpha", "BETA"],
            });
        });

        it("All-in", async () => {
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

    describe("Features", () => {
        describe("Merge", () => {
            it("Numbers", () => {
                const merged = JFather.merge(1, 2);

                assert.equal(merged, 2);
            });

            it("Objects", () => {
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

            it("Sub-objects", () => {
                const merged = JFather.merge(
                    { foo: { bar: 1, baz: 2 }, qux: "a" },
                    { foo: { bar: 10, quux: 20 }, corge: "b" },
                );

                assert.deepEqual(merged, {
                    foo: { bar: 10, baz: 2, quux: 20 },
                    qux: "a",
                    corge: "b",
                });
            });

            it("Arrays", () => {
                const merged = JFather.merge(
                    { foo: [1, 10, 11] },
                    { foo: [2, 20, 22] },
                );

                assert.deepEqual(merged, { foo: [2, 20, 22] });
            });
        });

        describe("Extend", () => {
            it("Empty", async () => {
                const stub = mock.method(globalThis, "fetch", () =>
                    Promise.resolve(Response.json({ foo: 42 })),
                );

                const extended = await JFather.extend({
                    $extends: "https://example.com/parent.json",
                });

                assert.deepEqual(extended, { foo: 42 });

                assert.equal(stub.mock.callCount(), 1);
                assert.deepEqual(stub.mock.calls[0].arguments, [
                    "https://example.com/parent.json",
                ]);
            });

            it("Merge", async () => {
                const stub = mock.method(globalThis, "fetch", () =>
                    Promise.resolve(Response.json({ foo: "A", bar: "Alpha" })),
                );

                const extended = await JFather.extend({
                    $extends: "https://example.com/parent.json",
                    foo: "B",
                    baz: "Beta",
                });

                assert.deepEqual(extended, {
                    foo: "B",
                    bar: "Alpha",
                    baz: "Beta",
                });

                assert.equal(stub.mock.callCount(), 1);
                assert.deepEqual(stub.mock.calls[0].arguments, [
                    "https://example.com/parent.json",
                ]);
            });

            it("Sub-object", async () => {
                const stub = mock.method(globalThis, "fetch", () =>
                    Promise.resolve(Response.json({ foo: 42 })),
                );

                const extended = await JFather.extend({
                    bar: {
                        $extends: "https://example.com/parent.json",
                        baz: 3.14,
                    },
                });

                assert.deepEqual(extended, {
                    bar: { foo: 42, baz: 3.14 },
                });

                assert.equal(stub.mock.callCount(), 1);
                assert.deepEqual(stub.mock.calls[0].arguments, [
                    "https://example.com/parent.json",
                ]);
            });

            it("Query", async () => {
                const stub = mock.method(globalThis, "fetch", () =>
                    Promise.resolve(
                        Response.json({
                            foo: { bar: [1, 2], baz: "a" },
                            qux: true,
                        }),
                    ),
                );

                const extended = await JFather.extend({
                    $extends: "https://example.com/parent.json#foo",
                });

                assert.deepEqual(extended, { bar: [1, 2], baz: "a" });

                assert.equal(stub.mock.callCount(), 1);
                assert.deepEqual(stub.mock.calls[0].arguments, [
                    "https://example.com/parent.json#foo",
                ]);
            });
        });

        describe("Override", () => {
            it("Replace", () => {
                const merged = JFather.merge(
                    { foo: ["a", "Alpha"] },
                    { "$foo[0]": "B" },
                );

                assert.deepEqual(merged, { foo: ["B", "Alpha"] });
            });

            it("Add", () => {
                const merged = JFather.merge(
                    { foo: ["a", "Alpha"] },
                    { "$foo[]": ["b", "Beta"] },
                );

                assert.deepEqual(merged, { foo: ["a", "Alpha", "b", "Beta"] });
            });

            it("All-in", () => {
                const merged = JFather.merge(
                    { foo: [{ bar: ["a"] }] },
                    { "$foo[0]": { "$bar[]": ["b", "c"] } },
                );

                assert.deepEqual(merged, {
                    foo: [{ bar: ["a", "b", "c"] }],
                });
            });

            it("Ignore", () => {
                const merged = JFather.merge(
                    { foo: ["a", "A"], bar: 42 },
                    { "$bar[0]": 3.14, "$baz[]": ["beta"] },
                );

                assert.deepEqual(merged, { foo: ["a", "A"], bar: 42 });
            });
        });
    });
});
