document.addEventListener("DOMContentLoaded",()=>{

console.log("ESMS Experience Started");

const hero=document.querySelector(".hero-content");

hero.style.opacity=0;

hero.style.transform="translateY(80px)";

setTimeout(()=>{

hero.style.transition="1.2s";

hero.style.opacity=1;

hero.style.transform="translateY(0px)";

},300);

const btn=document.querySelector(".primary");

btn.onclick=()=>{

document.body.classList.add("experience");

alert("Добро пожаловать в ESMS Experience.\nBuild 0.2");

};

});