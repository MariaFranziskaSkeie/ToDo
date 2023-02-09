class Translator{
    Languages = {
        en: {
          todo: 'Your todo list',
          welcome: "Welcome to your todo list",
          hello: "Hello",
          goodbye: "Goodbye",
        },
        no: {
          todo: 'Din todo liste',
          welcome: "Velkommen til din todo liste",
          hello: "Hei",
          goodbye: "Farvel",
        }, 
        de:{
          todo: 'Deine todo liste',
          welcome: "Willkommen zu deiner todo liste",
          hello: "Hallo",
          goodbye: "Auf Wiedersehen",
        },
      }

      getLanguage(){
        return document.getElementById("language").value;
      }

      translate(key){
        return this.Languages[this.getLanguage()][key];
      }

      localizeDate(date){
        return date.toLocalDateString(this.getLanguage());
      }
}

export default Translator;