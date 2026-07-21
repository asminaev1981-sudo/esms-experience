/* ==========================================
   ESMS Experience
   Build 0.1
   app.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("ESMS Experience Build 0.1 loaded");

    // Hero animation
    const hero = document.querySelector(".hero-content");

    hero.style.opacity = 0;
    hero.style.transform = "translateY(40px)";

    setTimeout(() => {

        hero.style.transition =
            "all 1s cubic-bezier(.22,.61,.36,1)";

        hero.style.opacity = 1;
        hero.style.transform = "translateY(0)";

    },300);

    // Primary Button

    const startButton =
        document.querySelector(".primary");

    startButton.addEventListener("click",()=>{

        alert(
            "Добро пожаловать в ESMS Experience!\n\nBuild 0.1"
        );

    });

    // Secondary Button

    const demoButton =
        document.querySelector(".secondary");

    demoButton.addEventListener("click",()=>{

        alert(
            "Форма заявки появится в Build 0.2"
        );

    });

});