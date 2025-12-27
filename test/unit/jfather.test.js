/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as jfather from "../../src/jfather.js";

describe("jfather.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("walk()", () => {
        it("should apply on object", () => {
            const obj = { foo: "bar" };
            const result = jfather.walk(
                obj,
                (/** @type {Record<string, any>} */ o) => ({ ...o, baz: 42 }),
            );
            assert.deepEqual(result, { foo: "bar", baz: 42 });
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.deepEqual(obj, { foo: "bar" });
        });

        it("should apply on all elements of array", () => {
            const obj = [{ foo: "bar" }, { baz: "qux", quux: "corge" }];
            const result = jfather.walk(
                obj,
                (/** @type {Record<string, any>} */ o) => Object.keys(o),
            );
            assert.deepEqual(result, [["foo"], ["baz", "quux"]]);
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.deepEqual(obj, [
                { foo: "bar" },
                { baz: "qux", quux: "corge" },
            ]);
        });

        it("should ignore others types", () => {
            const obj = "foo";
            const result = jfather.walk("foo", () => 42);
            assert.equal(result, "foo");
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.equal(obj, "foo");
        });

        it("should apply on sub-object", () => {
            const obj = { foo: { bar: "baz" } };
            const result = jfather.walk(
                obj,
                (/** @type {Record<string, any>} */ o) => ({ ...o, qux: 42 }),
            );
            assert.deepEqual(result, { foo: { bar: "baz", qux: 42 }, qux: 42 });
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.deepEqual(obj, { foo: { bar: "baz" } });
        });

        it("should apply on all elements of array of array", () => {
            const obj = [[{ foo: "bar" }], { baz: ["qux"], quux: "corge" }];
            const result = jfather.walk(
                obj,
                (/** @type {Record<string, any>} */ o) => Object.values(o),
            );
            assert.deepEqual(result, [[["bar"]], [["qux"], "corge"]]);
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.deepEqual(obj, [
                [{ foo: "bar" }],
                { baz: ["qux"], quux: "corge" },
            ]);
        });

        it("should ignore undefined", () => {
            const obj = undefined;
            const result = jfather.walk(
                obj,
                (/** @type {Record<string, any>} */ _o) => "foo",
            );
            assert.equal(result, undefined);
        });

        it("should ignore null", () => {
            const obj = null;
            const result = jfather.walk(
                obj,
                (/** @type {Record<string, any>} */ _o) => "foo",
            );
            assert.equal(result, null);
        });
    });

    describe("walkAsync()", () => {
        it("should apply on object", async () => {
            const obj = { foo: "bar" };
            const result = await jfather.walkAsync(
                obj,
                (/** @type {Record<string, any>} */ o) =>
                    Promise.resolve({ ...o, baz: 42 }),
            );
            assert.deepEqual(result, { foo: "bar", baz: 42 });
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.deepEqual(obj, { foo: "bar" });
        });

        it("should apply on all elements of array", async () => {
            const obj = [{ foo: "bar" }, { baz: "qux", quux: "corge" }];
            const result = await jfather.walkAsync(
                obj,
                (/** @type {Record<string, any>} */ o) =>
                    Promise.resolve(Object.keys(o)),
            );
            assert.deepEqual(result, [["foo"], ["baz", "quux"]]);
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.deepEqual(obj, [
                { foo: "bar" },
                { baz: "qux", quux: "corge" },
            ]);
        });

        it("should ignore others types", async () => {
            const obj = "foo";
            const result = await jfather.walkAsync("foo", () =>
                Promise.resolve(42),
            );
            assert.equal(result, "foo");
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.equal(obj, "foo");
        });

        it("should apply on sub-object", async () => {
            const obj = { foo: { bar: "baz" } };
            const result = await jfather.walkAsync(
                obj,
                (/** @type {Record<string, any>} */ o) =>
                    Promise.resolve({ ...o, qux: 42 }),
            );
            assert.deepEqual(result, { foo: { bar: "baz", qux: 42 }, qux: 42 });
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.deepEqual(obj, { foo: { bar: "baz" } });
        });

        it("should apply on all elements of array of array", async () => {
            const obj = [[{ foo: "bar" }], { baz: ["qux"], quux: "corge" }];
            const result = await jfather.walkAsync(
                obj,
                (/** @type {Record<string, any>} */ o) =>
                    Promise.resolve(Object.values(o)),
            );
            assert.deepEqual(result, [[["bar"]], [["qux"], "corge"]]);
            // Vérifier que l'objet d'entrée n'a pas été modifié.
            assert.deepEqual(obj, [
                [{ foo: "bar" }],
                { baz: ["qux"], quux: "corge" },
            ]);
        });

        it("should ignore undefined", async () => {
            const obj = undefined;
            const result = await jfather.walkAsync(
                obj,
                (/** @type {Record<string, any>} */ _o) =>
                    Promise.resolve("foo"),
            );
            assert.equal(result, undefined);
        });

        it("should ignore null", async () => {
            const obj = null;
            const result = await jfather.walkAsync(
                obj,
                (/** @type {Record<string, any>} */ _o) =>
                    Promise.resolve("foo"),
            );
            assert.equal(result, null);
        });
    });

    describe("clone()", () => {
        it("should clone on object", () => {
            const obj = { foo: "bar" };
            const result = jfather.clone(obj);
            obj.foo = "baz";
            assert.deepEqual(result, { foo: "bar" });
        });

        it("should clone all elements of array", () => {
            const obj = [{ foo: "bar" }, { baz: "qux" }];
            const result = jfather.clone(obj);
            obj[0].foo = "quux";
            obj[1].baz = "corge";
            assert.deepEqual(result, [{ foo: "bar" }, { baz: "qux" }]);
        });
    });

    describe("query()", () => {
        it("should support empty chain", () => {
            const result = jfather.query({ foo: "bar" }, "");
            assert.deepEqual(result, { foo: "bar" });
        });

        it("should prefix by dot", () => {
            const result = jfather.query({ foo: "bar" }, "foo");
            assert.equal(result, "bar");
        });

        it("should get by property name", () => {
            const result = jfather.query({ foo: "bar" }, ".foo");
            assert.equal(result, "bar");
        });

        it("should get by index", () => {
            const result = jfather.query(["foo", "bar"], "[1]");
            assert.equal(result, "bar");
        });

        it("should get by index with two digits", () => {
            const result = jfather.query(
                [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                ],
                "[11]",
            );
            assert.equal(result, "l");
        });

        it("should get by property name and index", () => {
            const result = jfather.query({ foo: ["bar", "baz"] }, ".foo[1]");
            assert.equal(result, "baz");
        });

        it("should get by sub-property name", () => {
            const result = jfather.query({ foo: { bar: "baz" } }, ".foo.bar");
            assert.equal(result, "baz");
        });

        it("should get reject invalid chain", () => {
            assert.throws(
                () => jfather.query({ foo: { bar: "baz" } }, ".qux.quux"),
                {
                    name: "TypeError",
                    message: new RegExp(
                        "^(" +
                            // Vérifier le message d'erreur de Node.js.
                            RegExp.escape(
                                "Cannot read properties of undefined (reading" +
                                    " 'quux')",
                            ) +
                            ")|(" +
                            // Vérifier le message d'erreur de Bun.
                            RegExp.escape(
                                "undefined is not an object (evaluating" +
                                    " 'sub.obj[result.groups.prop]')",
                            ) +
                            ")$",
                        "v",
                    ),
                },
            );
        });

        it("should get reject unsupported chain", () => {
            assert.throws(() => jfather.query({ foo: "bar" }, ".?foo"), {
                name: "TypeError",
                message: "Invalid chain: .?foo",
            });
        });
    });

    describe("merge()", () => {
        it("should return object when two objets are same", () => {
            const obj = { foo: "bar" };
            const result = jfather.merge(obj, obj);
            assert.deepEqual(result, { foo: "bar" });
        });

        it("should return second when first isn't object", () => {
            const result = jfather.merge("foo", { bar: "baz" });
            assert.deepEqual(result, { bar: "baz" });
        });

        it("should return second when second isn't object", () => {
            const result = jfather.merge({ foo: "bar" }, "baz");
            assert.equal(result, "baz");
        });

        it("should return second when both aren't object", () => {
            const result = jfather.merge("foo", "bar");
            assert.equal(result, "bar");
        });

        it("should return second when first is undefined", () => {
            const result = jfather.merge(undefined, { foo: "bar" });
            assert.deepEqual(result, { foo: "bar" });
        });

        it("should return undefined when second is undefined", () => {
            const result = jfather.merge({ foo: "bar" }, undefined);
            assert.equal(result, undefined);
        });

        it("should merge two objects", () => {
            const result = jfather.merge(
                { foo: "bar", baz: "qux" },
                { foo: "quux", corge: "grault" },
            );
            assert.deepEqual(result, {
                foo: "quux",
                baz: "qux",
                corge: "grault",
            });
        });

        it("should override", () => {
            const result = jfather.merge(
                { foo: ["bar", "baz"] },
                { "$foo[0]": "qux", "$foo[]": ["quux", "corge"] },
            );
            assert.deepEqual(result, {
                foo: ["qux", "baz", "quux", "corge"],
            });
        });

        it("should ignore override of non-array", () => {
            const result = jfather.merge({ foo: "bar" }, { "$foo[]": "baz" });
            assert.deepEqual(result, { foo: "bar" });
        });

        it("should override in sub-object", () => {
            const result = jfather.merge(
                { foo: ["bar", "baz"], qux: { quux: ["corge", "grault"] } },
                {
                    "$foo[0]": "garply",
                    "$foo[]": ["waldo"],
                    qux: { fred: "plugh", "$quux[1]": "xyzzy" },
                },
            );
            assert.deepEqual(result, {
                foo: ["garply", "baz", "waldo"],
                qux: { quux: ["corge", "xyzzy"], fred: "plugh" },
            });
        });

        it("should override in depth", () => {
            const result = jfather.merge(
                { foo: [{ bar: "baz" }, { qux: "quux" }, "corge"] },
                {
                    "$foo[0]": "grault",
                    "$foo[1]": { garply: "waldo" },
                    "$foo[2]": { fred: "plugh" },
                },
            );
            assert.deepEqual(result, {
                foo: [
                    "grault",
                    { qux: "quux", garply: "waldo" },
                    { fred: "plugh" },
                ],
            });
        });
    });

    describe("load()", () => {
        it("should return object", async () => {
            const stub = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({ foo: "bar" })),
            );

            const result = await jfather.load("https://baz.com/qux.json");
            assert.deepEqual(result, { foo: "bar" });

            assert.equal(stub.mock.callCount(), 1);
            assert.deepEqual(stub.mock.calls[0].arguments, [
                "https://baz.com/qux.json",
            ]);
        });

        it("should return sub-object", async () => {
            const stub = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ foo: { bar: "baz" }, qux: "quux" }),
                ),
            );

            const result = await jfather.load(
                "https://corge.org/grault.json#foo",
            );
            assert.deepEqual(result, { bar: "baz" });

            assert.equal(stub.mock.callCount(), 1);
            assert.deepEqual(stub.mock.calls[0].arguments, [
                "https://corge.org/grault.json#foo",
            ]);
        });

        it("should use 'request' option", async () => {
            const fake = mock.fn(() => Promise.resolve({ foo: "bar" }));
            const options = { request: fake };

            const result = await jfather.load(
                "https://baz.com/qux.json",
                options,
            );
            assert.deepEqual(result, { foo: "bar" });

            assert.equal(fake.mock.callCount(), 1);
            assert.deepEqual(fake.mock.calls[0].arguments, [
                "https://baz.com/qux.json",
            ]);
        });
    });

    describe("parse()", () => {
        it("should return object", async () => {
            const result = await jfather.parse('{ "foo": "bar" }');
            assert.deepEqual(result, { foo: "bar" });
        });

        it("should return extended object", async () => {
            const stub = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({ foo: "bar" })),
            );

            const result = await jfather.parse(
                `{
                    "$extends": "https://baz.com/qux.json",
                    "quux": "corge"
                 }`,
            );
            assert.deepEqual(result, { foo: "bar", quux: "corge" });

            assert.equal(stub.mock.callCount(), 1);
            assert.deepEqual(stub.mock.calls[0].arguments, [
                "https://baz.com/qux.json",
            ]);
        });

        it("should use 'request' option", async () => {
            const fake = mock.fn(() => Promise.resolve({ foo: "bar" }));
            const options = { request: fake };

            const result = await jfather.parse(
                `{
                    "$extends": "https://baz.com/qux.json",
                    "quux": "corge"
                 }`,
                options,
            );
            assert.deepEqual(result, { foo: "bar", quux: "corge" });

            assert.equal(fake.mock.callCount(), 1);
            assert.deepEqual(fake.mock.calls[0].arguments, [
                "https://baz.com/qux.json",
            ]);
        });
    });
});
