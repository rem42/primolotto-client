'use strict';
import { expect } from 'chai';
import 'mocha';
import {CookieExtractor} from './cookie-extractor';

describe('test cookieExtractor class', () => {
    it('when empty cookie', () => {
        const testData: string[] = [];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(false);

        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('');
    });
    it('return empty when cookie not in list', () => {
        const testData: string[] = [
            'foo=bar; bar=foo'
        ];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(false);
        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('');
    });
    it('return all cookie in list', () => {
        const testData: string[] = [
            'AWSALB=bar;',
            'laravel_session=foo;',
            'AWSALBCORS=baz;',
            'didomi_token=faa;',
        ];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(true);
        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('AWSALB=bar; laravel_session=foo; AWSALBCORS=baz; didomi_token=faa');
    });
    it('not return cookie deleted', () => {
        const testData: string[] = [
            'AWSALB=bar;',
            'uid=deleted;'
        ];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(false);
        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('AWSALB=bar');
    });
    it('return cookie with value not deleted', () => {
        const testData: string[] = [
            'AWSALB=deleted;',
            'AWSALB=bar;',
            'AWSALB=deleted;',
        ];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(false);
        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('AWSALB=bar');
    });
});
