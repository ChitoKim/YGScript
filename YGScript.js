// ==UserScript==
// @name         Override Button Click and Access Text Boxes
// @namespace    http://tampermonkey.net/
// @version      2024-07-21
// @description  Override the onClick event of a specific button and access text boxes
// @author       You
// @match        http://ygmajang.interdaim.com/insertgameinput.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=interdaim.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Custom verifyScore function
    function verifyScore() {
        // Access the text boxes with name="score[]"
        const scoreInputs = document.querySelectorAll('input[name="score[]"]');
        const scores = Array.from(scoreInputs).map(input => parseInt(input.value, 10));

        console.log("Original Scores:", scores);

        // Check if scores are in 3-digit format (sum to 1000) or 5-digit format (sum to 100000)
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const areScoresValid = totalScore === 1000 || totalScore === 100000;
        const areScoresLegacyValid = totalScore === 0;
        
        if (areScoresLegacyValid) {
        // Retain the score strings if the scores are legacy-formatted and valid(sum 0).
            alert("+/- 점수형식은 사용이 권장되지 않습니다.\n"
            + "다음부터는 원점수만을 입력해주십시오.\n"
            + "(예시)\n"
            + "작사1  330\n"
            + "작사2  240\n"
            + "작사3  240\n"
            + "작사4  190\n"
            + "확인 버튼을 누르시면 등록이 진행됩니다.\n"
            + "치토 올림");
            return true;
        }

        if (areScoresValid) {
            // Convert 3-digit scores to 5-digit if necessary
            const scaledScores = totalScore === 1000 ? scores.map(score => score * 100) : scores;
            // Convert scores by subtracting 25,000
            const convertedScores = scaledScores.map(score => score - 25000);
            console.log("Converted Scores:", convertedScores);

            // Refeed the text boxes with the converted scores
            convertedScores.forEach((score, index) => {
                scoreInputs[index].value = score.toString();
            });

            return true; // Verification passed
        } else {
            alert(`합계가 맞지 않습니다.\n합계 ${totalScore}.`);
            return false; // Verification failed
        }
    }

    // Override the button click
    function overrideButtonClick() {
        const button = document.querySelector('input[type="button"][value="입력완료"]');
        if (button) {
            console.log("Button found, overriding onClick");

            // Save the original onclick function
            const originalOnClick = button.onclick;

            // Override the onclick function
            button.onclick = function(event) {
                if (verifyScore()) {
                    if (originalOnClick) {
                        originalOnClick.call(button, event); // Call the original function if verification passes
                    }
                } else {
                    console.log("Verification failed. Submission stopped.");
                }
            };
        } else {
            console.log("Button not found");
        }
    }

    // Ensure the script runs after the DOM is fully loaded
    window.addEventListener('DOMContentLoaded', (event) => {
        console.log("DOM fully loaded and parsed");
        overrideButtonClick();
    });

    // If other scripts are overriding the click event, retry after a delay
    setTimeout(overrideButtonClick, 3000);
})();
