import Translator from "./Modules/translator.js";

const translator = new Translator;

document.getElementById("language").addEventListener("change", () => {
    document.getElementById("welcomeMessage").innerText = translator.translate("welcome");
})

document.getElementById("welcomeMessage").innerText = translator.translate("welcome");
