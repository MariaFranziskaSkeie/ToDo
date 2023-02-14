import Translator from "./Modules/translator.js";

const translator = new Translator;

document.getElementById("language").addEventListener("change", () => {
    document.getElementById("welcomeMessage").innerText = translator.translate("welcome");
});

document.getElementById("welcomeMessage").innerText = translator.translate("welcome");

document.getElementById("jokeButton").addEventListener("click", async () => {
    const languageId = translator.getLanguage();
    const joke = await getJoke(languageId);

    document.getElementById("jokeString").innerText = joke;
});

async function getJoke(languageId){
    try {
        const response = await fetch("http://localhost:8080/jokes/" + languageId);
        const theJoke = await response.json();
        return theJoke.joke;

    } catch (error) {
        console.log(error);
    }
};