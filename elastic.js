const fs = require('fs');

console.time("elastic");


let glossary = [
    { term: "node", caseSensitive: false},
    { term: "Server", caseSensitive: true},
    { term: "Wonderful", caseSensitive: false},
    { term: "bonjour", caseSensitive: false },
    { term: "au revoir", caseSensitive: false },
];

const text = fs.readFileSync('data/text-small.txt', 'utf-8');

const { Client } = require('@elastic/elasticsearch')
const config = require('config');
const elasticConfig = config.get('elastic');

console.time("elastic");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new Client({
    node: 'https://localhost:9200',
    auth: {
        username: elasticConfig.username,
        password: elasticConfig.password
    }
})
//client.info()  .then(response => console.log(response))


async function run () {
    await client.indices.delete({
        index: 'glossary',
    });

    const result = await client.indices.create({
        index: 'glossary',
        body: {
            settings: {
                analysis: {
                    tokenizer: {
                        my_tokenizer: {
                            type: 'char_group',
                            tokenize_on_chars: [' ', '\t', '\n', '\r', '\f', '_', '-', '.']
                        }
                    },

                    analyzer: {
                        my_analyzer: {
                            //tokenizer: 'standard',
                            tokenizer: 'my_tokenizer',
                            //filter: ['stemmer'] // original
                            filter: ["lowercase", "asciifolding", "stemmer"]
                        }
                    }
                }
            },
            mappings: {
                properties: {
                    /*term: { // original
                      type: 'text',
                      analyzer: 'my_analyzer'
                    }*/
                    term: {
                        type: 'text',
                        fields: {
                            raw: {
                                type: 'keyword'
                            },
                            stemmed: {
                                type: 'text',
                                analyzer: 'my_analyzer'
                            }
                        }
                    }
                }
            }
        }
    })
    console.log(result.body)

    // Add terms to the glossary

    const glossaryToBody = glossary.flatMap(doc => [{ index: { _index: 'glossary' } }, doc])

    await client.bulk({
        refresh: true,
        body: glossaryToBody
    })

    // Ensure data was inserted successfully
    const { count } = await client.count({ index: 'glossary' })
    console.log('glossary')
    console.log(count)

    await client.indices.refresh({ index: "glossary" });

    try {
        for (let i = 0; i < 5000; i++) {

            console.log(i)

            const searchRes = await client.search({
                index: "glossary",
                body: {
                    query: {
                        match: {
                            'term.stemmed': text
                        }
                    }
                }
            });

            //console.log(searchRes)
            console.log('hits----')
            searchRes.hits.hits.forEach((hit) => console.log(hit._source))

            // Stemmer example
            /*const analyzeRes = await client.indices.analyze({
                body: {
                    tokenizer: 'standard',
                    filter: ['stemmer'],
                    text: text
                }
            })
            console.log(analyzeRes.tokens.map(token => token.token))*/
        }
    } catch (err) {
        console.error(err);
    }

    console.timeEnd("elastic")
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${used} MB`);
}

run().catch()

