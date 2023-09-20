## Natural (NLP) vs ElasticSearch (Full Text Search)

## Installation
```
npm install
```

### Natural
```
ts-node natural.ts
``` 

### nlp-node
```
ts-node nlp.ts
``` 

### ElasticSearch

It requires that you have a functional ES instance:
https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html

Add your config data in config/default.json

#### Run ES
```
node elastic.js
``` 

#### Run ES using chunks
```
node elastic-chunks.js
```

## Results:

Using the data/text-small.txt with a loop of 5000 iterations

### ElasticSearch
**ES limitations**: Text size depends on the value **maxClauseCount** ES setting see:
https://medium.com/traackr-devs/setting-the-booleanquery-maxclausecount-in-elasticsearch-f9d829516838

elastic: **~7.8 seconds**

The script uses approximately 25.92754364013672 MB

### ES using chunks
elastic-chunks: **~3.524 seconds**
The script uses approximately 26.654769897460938 MB

### natural (using tokenizeAndStem())
natural: **3.5 seconds**

The script uses approximately 124.1512680053711 MB

### nlp 

nlp: **381.159ms**
The script uses approximately 162.9041519165039 MB
