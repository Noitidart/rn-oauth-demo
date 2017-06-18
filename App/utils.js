/**
 *
 *
 * @export
 * @param {integer} ms
 */
export async function wait(ms) {
  await new Promise(resolve => setTimeout(() => resolve(), ms));
}

/**
 * Last Updated: 061717 342p
 *
 * @export
 * @param {string} a
 * @param {string} b
 * @returns
 */
export function alphaSort(a, b) {
    return a.localeCompare(b);
}

/**
 * toRFC3986 + toRFC1738
 * Last Updated: 061717 342p
 *
 * @export
 * @param {string} str
 * @returns
 */
import { encode as qsEncode  } from 'qs/lib/utils'
import { formatters as qs_formatters  } from 'qs/lib/formats'
export function toRFC3986(str) {
	return qs_formatters['RFC3986'](qsEncode(str));

	// old way
	// // https://af-design.com/2008/03/14/rfc-3986-compliant-uri-encoding-in-javascript/
	// // i should test with the samples given here - https://dev.twitter.com/oauth/overview/percent-encoding-parameters
	// let tmp =  encodeURIComponent(str);
	// tmp = tmp.replace('!','%21');
	// tmp = tmp.replace('*','%2A');
	// tmp = tmp.replace('(','%28');
	// tmp = tmp.replace(')','%29');
	// tmp = tmp.replace("'",'%27');
	// return tmp;
}
export function toRFC1738(str) {
	return qs_formatters['RFC1738'](qsEncode(str));
}

/**
 * Last Updated: 061717 342p
 *
 * @export
 * @param {integer} length
 * @returns
 */
export function genNonce(length) {
	// generates a nonce
    let nonce = '';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < length; i++) {
        nonce += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return nonce;
}

/**
 *
 *
 * @export
 * @param {any} avar
 * @returns
 */
export function isObject(avar) {
  // cosntructor.name tested for `function Animal(){}; var a = new Animal(); isObject(a);` will return true otherwise as it is [Object object]
  return Object.prototype.toString.call(avar) === "[object Object]" &&
    avar.constructor.name === "Object";
}
