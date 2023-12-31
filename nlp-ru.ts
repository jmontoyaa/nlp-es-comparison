import {readFileSync} from 'fs';
const { NlpManager } = require('node-nlp');
const languageCode = 'en'
const manager = new NlpManager({ languages: [languageCode] });

console.time("nlp");

let glossary = [
    {term: "node", caseSensitive: false},
    {term: "Server", caseSensitive: true},
    {term: "Wonderful", caseSensitive: false},
    {term: "bonjour", caseSensitive: false},
    {term: "au revoir", caseSensitive: false},
];

try {
    const text = readFileSync('data/text-small-ru.txt', 'utf-8');
    let languageCode = 'ru'; // ISO 639-1 language code

    let stemmer = manager.container.get(`stemmer-${languageCode}`);

    // add loop of the same glossary term for tests
    for (let i = 0; i < 5000; i++) {
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

console.timeEnd("nlp")

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${used} MB`);