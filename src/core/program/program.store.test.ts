import {describe, expect} from "vitest";
import {anchorProviderStore, getDnsIdl} from "#/core/program/program.store";
import literalDnsIdl from './dns.json'
import {AnchorProvider} from "@project-serum/anchor";

describe(getDnsIdl.name, () => {
    const dnsIdl = getDnsIdl();
    test("it should return an object with type of an IDL", () => {
        expect(dnsIdl).toBeDefined();
        expect(dnsIdl).toBeTruthy();
        expect(dnsIdl).toStrictEqual(literalDnsIdl);
    });
})

describe(`anchorProviderStore`, () => {
    test("it should return an object with type of an anchorProvider", () => new Promise((done) => {
        anchorProviderStore.subscribe((anchorProvider) => {
            expect(anchorProvider).toBeTruthy();
            expect(anchorProvider).toBeInstanceOf(AnchorProvider);
            done('name')
        })
    }))
})
