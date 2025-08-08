// ==UserScript==
// @name         Fix Hangul Blur Bug
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent nickname input loss due to Hangul composition + blur
// @match        http://ygmajang.interdaim.com/insertgameinput.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        document.querySelectorAll('input[name="memnick[]"]').forEach(input => {
            let composing = false;

            input.addEventListener('compositionstart', () => composing = true);
            input.addEventListener('compositionend', () => composing = false);

            input.addEventListener('blur', (e) => {
                if (composing) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    input.focus();  // prevent Chrome from dropping Hangul
                }
            });
        });
    });
})();
