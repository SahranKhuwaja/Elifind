const pdfparse = require('pdf-parse');
const docxParse = require('mammoth');
const docParse = require('@gmr-fms/word-extractor');
const skillsList = require('../skills/skills');
const { WordTokenizer } = require('natural');
const pos = require('pos');
const wordpos = require('wordpos');

exports.extractText = async (file) => {

  let text;
  if (file.mimetype === 'application/pdf') {
    text = (await pdfparse(file.buffer)).text;
  }
  else if (file.mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = (await docxParse.extractRawText(file.buffer)).value
  }
  else if (file.mimetype === 'application/msword') {
    text = await (await docParse.fromBuffer(file.buffer)).getBody();
  }
  else {
    text = await Buffer.from(file.buffer).toString('utf-8');
  }
  text =await text.replace(/c#|C#/g,'csharp');
  text = await text.replace(/c\+\+|C\+\+/g,'cplusplus');
  return text;
}



exports.infoExtractor = async (text) => {

  const name = await text.match(/[A-Z][A-Za-z]*\s[A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)?/)
  const email = await text.match(/[a-zA-Z0-9-\.]+@[a-zA-Z-\.]*\.(com|edu|net)/g);
  const phone = await text.match(/[+(]?\d+[)\-]?[ \t\r\f\v]*[(]?\d{2,}[()\-]?[ \t\r\f\v]*\d{2,}[()\-]?[ \t\r\f\v]*\d*[ \t\r\f\v]*\d*[ \t\r\f\v]*/g);
  const Tokenizer = new WordTokenizer();
  const words = await Tokenizer.tokenize(text)
  const tagger = new pos.Tagger();
  const taggedWords = tagger.tag(words);

  let nouns = await taggedWords.map((e) => {
    if (e[1] === 'NN' || e[1] === 'NNP' || e[1] === 'NNPS' || e[1] === 'NNS' || e[1]==='VB' || e[1]==='VBG'||
    e[1]==='VPN'||e[1]==='VPN'||e[1]==='VPZ'|| e[1]==='JJ') {
      return e[0];
    }
  }).filter(e => { if (e !== undefined) { return e } });
  let skills = [];
  for (var i = 0; i < nouns.length; i++) {
    nouns[i] = await  nouns[i] ==='csharp'?'C#':nouns[i]==='cplusplus'?'C++':nouns[i]
    for (var j = 0; j < skillsList.length; j++) {
      if (nouns[i].toLowerCase().trim() === skillsList[j].toLowerCase()){
         nouns[i].toLowerCase()==='net'? skills.push('.NET') :
         nouns[i].length>3?skills.push(nouns[i][0].toUpperCase()+nouns[i].slice(1).toLowerCase()):skills.push(nouns[i].toUpperCase());
      }
    }
  }
  return { name, email, phone, skills};
}

exports.cleanData = async (info) => {
  
  if(info.name){
     const part = await info.name[0].split(' ');
     info.name[0] = '';
     for(var i=0;i<part.length;i++){
       info.name[0] += await part[i][0].toUpperCase() + part[i].slice(1).toLowerCase()+ ' ';
     }
   
  }

  if (info.phone) {
    info.phone = await info.phone.filter(e => {
      return !(e.trim().length > 15 || e.trim().length < 11)
    }).filter(e => {
      e.replace('\r', "");
      const split = e.trim().split('-');
      if (split[1] !== undefined) {
        if (split[1].length > 6 || split[1].length === 3) {
          return e;
        }
      } else {
        return e
      }
    })
  }
  return info;
}
