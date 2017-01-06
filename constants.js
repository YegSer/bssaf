/**
 * @param {string} name Constant name
 * @param {any} value Constant value
 */
function define(name, value) {
    // No need to define that it's static
    // Will be them by default
    Object.defineProperty(exports, name, {
        value:          value,
        enumerable:     true
    });
}

define('HTTP_PORT', 8080);