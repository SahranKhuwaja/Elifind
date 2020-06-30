const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

exports.sentimentAnalysis = async (review) => {


    const lexedReview = aposToLexForm(review);
    const casedReview = lexedReview.toLowerCase();
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })

    const filteredReview = SW.removeStopwords(tokenizedReview);
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);

    return analysis;




}