import { dictionary } from './dictionary';

// Функція для отримання слів зі словника
const getWordsFromDictionary = (words) => {
  return words
    .filter(word => {
      if (!dictionary[word]) {
        console.warn(`Слово "${word}" відсутнє в словнику`);
        return false;
      }
      return true;
    })
    .map(word => ({
      swedishWord: word,
      transcription: dictionary[word].transcription,
      ukrainianTranslation: dictionary[word].ukrainianTranslation
    }));
};

export const lessonsData = [
  {
    id: 1,
    order: 1,
    title: "Att hälsa och presentera sig",
    content: {
      text: `Hej! Jag heter Anna. Jag är 25 år gammal och kommer från Sverige. Just nu bor jag i Stockholm och studerar vid universitetet. Jag tycker om att läsa böcker och promenera i naturen.

Jag har nyligen flyttat hit för att fortsätta min utbildning i litteraturvetenskap. På fritiden gillar jag också att laga mat och träffa vänner på kaféer. Vi pratar ofta om böcker, filmer och resor. Jag tycker att det är viktigt att hälsa artigt när man träffar nya människor.

När jag möter någon för första gången säger jag ofta: "Hej, jag heter Anna!" och frågar vad den personen heter. På så sätt blir samtalet mer personligt och trevligt. Det är spännande att lära känna nya personer och höra deras historier.`,
      vocabulary: getWordsFromDictionary([
        "att", "hälsa", "och", "presentera", "sig", "hej", "jag", "heter", "är", "år",
        "gammal", "kommer", "från", "Sverige", "just", "nu", "bor", "i", "Stockholm",
        "studerar", "vid", "universitetet", "tycker", "om", "läsa", "böcker", "promenera",
        "naturen", "har", "nyligen", "flyttat", "hit", "för", "fortsätta", "min",
        "utbildning", "litteraturvetenskap", "på", "fritiden", "gillar", "också", "laga",
        "mat", "träffa", "vänner", "kaféer", "vi", "pratar", "ofta", "filmer", "resor",
        "det", "viktigt", "artigt", "när", "man", "träffar", "nya", "människor", "möter",
        "någon", "första", "gången", "säger", "frågar", "vad", "den", "personen", "så",
        "sätt", "blir", "samtalet", "mer", "personligt", "trevligt", "spännande", "lära",
        "känna", "höra", "deras", "historier"
      ])
    }
  },
  {
    id: 2,
    order: 2,
    title: "Min familj",
    content: {
      text: `Jag bor med min familj i en lägenhet i Göteborg. Vi är fyra personer: min mamma, min pappa, min bror och jag. Vi har också en katt som heter Maja.

Mamma arbetar som sjuksköterska och pappa är ingenjör. Min bror studerar fortfarande i gymnasiet. Vi delar på hushållssysslorna, till exempel att städa och laga mat.

På helgerna brukar vi umgås tillsammans. Ibland tittar vi på film eller spelar brädspel. När det är högtider bjuder vi ofta in släkten på middag och firar tillsammans.`,
      vocabulary: getWordsFromDictionary([
        "min", "familj", "bor", "med", "i", "en", "lägenhet", "Göteborg", "vi", "är",
        "fyra", "personer", "mamma", "pappa", "bror", "och", "har", "också", "katt",
        "som", "heter", "arbetar", "sjuksköterska", "ingenjör", "fortfarande",
        "gymnasiet", "delar", "på", "hushållssysslorna", "till exempel", "städa",
        "laga", "mat", "helgerna", "brukar", "umgås", "tillsammans", "ibland",
        "tittar", "film", "spelar", "brädspel", "högtider", "bjuder", "släkten",
        "middag", "firar"
      ])
    }
  }
]; 