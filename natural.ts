const natural = require('natural');
import {readFileSync} from 'fs';

console.time("natural");

let glossary = [
    {term: "node", caseSensitive: false},
    {term: "Server", caseSensitive: true},
    {term: "Wonderful", caseSensitive: false},
    {term: "bonjour", caseSensitive: false},
    {term: "au revoir", caseSensitive: false},
];

try {
    const text = readFileSync('data/text-small.txt', 'utf-8');
    let languageCode = 'en'; // ISO 639-1 language code

    let stemmer;
    switch (languageCode) {
        case 'fr':
            stemmer = natural.PorterStemmerFr;
            break;
        case 'es':
            stemmer = natural.PorterStemmerEs;
            break;
        case 'en':
        default: // default language is English
            stemmer = natural.PorterStemmer;
            break;
    }

    // add loop of the same glossary term for tests
    for (let i = 0; i < 5000; i++) {
        console.log(i)
        let stemmedText = stemmer.tokenizeAndStem(text)

        let matchingGlossaryTerms = glossary.filter(glossaryItem => {
            const term = glossaryItem.term;

            if (stemmedText.includes(term)) {
                return true;
            }

            return false;
        }).map(item => item.term);
        console.log(matchingGlossaryTerms);
    }
} catch (err) {
    console.error(err);
}

console.timeEnd("natural")

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${used} MB`);