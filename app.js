const express = require("express");

// Template Engine
const ejs = require("ejs");

// Module to remove the stopwords (is, an, the ....)
const { removeStopwords } = require("stopword");

// Module to remove the Punctuations (. , !)
const removePunc = require("remove-punctuation");

// Module for spell-check
const natural = require("natural");

// Module to remove grammar (add / adding == add)
const lemmatizer = require("wink-lemmatizer");

// Module to convert numbers to words
var converter = require("number-to-words");

// Modules to read files and set directory paths
const fs = require("fs");
const path = require("path");

// Module to calculate Title Similarity
const stringSimilarity = require("string-similarity");

// Module to convert words to numbers
const { wordsToNumbers } = require("words-to-numbers");

/**
 * Reading Required Pre-computed Index Arrays
 */
const IDF = require("./idf");
const keywords = require("./keywords");
const length = require("./length");
let TF = require("./TF");
const titles = require("./titles");
const urls = require("./urls");

// Dataset constants for the search index
const N = 3023;
const W = 27602;
const avgdl = 138.27125372146875;

// Starting the Server
const app = express();

// Utility helper function to capitalize strings
Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

// Setting EJS as our visual view engine
app.set("view engine", "ejs");

// Path to our Public Assets Folder (for CSS styles/images)
app.use(express.static(path.join(__dirname, "/public")));

// Instantiating our spellcheck dictionary using our pre-computed keywords
const spellcheck = new natural.Spellcheck(keywords);

// 1. GET Route to load Ghanendar's home search screen
app.get("/", (req, res) => {
  res.render("index");
});

// 2. GET Route to perform the mathematical BM25 search logic
app.get("/search", (req, res) => {
  const query = req.query.query;
  const oldString = query.split(" ");
  const newString = removeStopwords(oldString);
  newString.sort(); 

  let queryKeywords = [];

  // Isolates raw numbers from the query string
  let getNum = query.match(/\d+/g);

  if (getNum) {
    getNum.forEach((num) => {
      queryKeywords.push(num);
      let numStr = converter.toWords(Number(num));
      let numKeys = numStr.split("-");
      queryKeywords.push(numStr); 

      numKeys.forEach((key) => {
        let spaceSplits = key.split(" ");
        if (numKeys.length > 1) queryKeywords.push(key);
        if (spaceSplits.length > 1)
          spaceSplits.forEach((key) => {
            queryKeywords.push(key);
          });
      });
    });
  }

  for (let j = 0; j < newString.length; j++) {
    newString[j] = newString[j].toLowerCase();
    newString[j] = removePunc(newString[j]);
    if (newString[j] !== "") queryKeywords.push(newString[j]);

    // Processing CamelCasing variations
    var letr = newString[j].match(/[a-zA-Z]+/g);
    if (letr) {
      letr.forEach((w) => {
        queryKeywords.push(removePunc(w.toLowerCase()));
      });
    }

    // Converting written words back to numbers
    let x = wordsToNumbers(newString[j]).toString();
    if (x != newString[j]) queryKeywords.push(x);
  }

  // Running Grammar and Spell Check pipelines
  let queryKeywordsNew = queryKeywords;
  queryKeywords.forEach((key) => {
    let key1 = key;
    let key2 = lemmatizer.verb(key1); 
    queryKeywordsNew.push(key2);

    let spellkey1 = spellcheck.getCorrections(key1);
    let spellkey2 = spellcheck.getCorrections(key2);
    if (spellkey1.indexOf(key1) == -1) {
      spellkey1.forEach((k1) => {
        queryKeywordsNew.push(k1);
        queryKeywordsNew.push(lemmatizer.verb(k1));
      });
    }

    if (spellkey2.indexOf(key2) == -1) {
      spellkey2.forEach((k2) => {
        queryKeywordsNew.push(k2);
        queryKeywordsNew.push(lemmatizer.verb(k2));
      });
    }
  });

  queryKeywords = queryKeywordsNew;
  console.log("Ghanendar's Engine parsed query keywords:", queryKeywords);

  // Filtering out keywords not existing in our indexed dictionary
  let temp = [];
  for (let i = 0; i < queryKeywords.length; i++) {
    const id = keywords.indexOf(queryKeywords[i]);
    if (id !== -1) {
      temp.push(queryKeywords[i]);
    }
  }

  queryKeywords = temp;
  queryKeywords.sort();

  // Deduplicating query keywords
  let temp1 = [];
  queryKeywords.forEach((key) => {
    if (temp1.indexOf(key) == -1) {
      temp1.push(key);
    }
  });
  queryKeywords = temp1;

  // Collecting internal IDs for every valid matched keyword
  let qid = [];
  queryKeywords.forEach((key) => {
    qid.push(keywords.indexOf(key));
  });

  /**
   * Executing the BM25 Ranking Algorithm
   */
  const arr = [];

  for (let i = 0; i < N; i++) {
    let s = 0;
    qid.forEach((key) => {
      const idfKey = IDF[key];
      let tf = 0;
      for (let k = 0; k < TF[i].length; k++) {
        if (TF[i][k].id == key) {
          tf = TF[i][k].val / length[i];
          break;
        }
      }
      const tfkey = tf;
      const x = tfkey * (1.2 + 1);
      const y = tfkey + 1.2 * (1 - 0.75 + 0.75 * (length[i] / avgdl));
      let BM25 = (x / y) * idfKey;

      // Boosting weights for competitive programming platforms (LeetCode & InterviewBit)
      if (i < 2214) BM25 *= 2;
      s += BM25;
    });

    // Layering Title String Similarity matching scores
    const titSim = stringSimilarity.compareTwoStrings(
      titles[i],
      query.toLowerCase()
    );
    s *= titSim;

    arr.push({ id: i, sim: s });
  }

  // Sorting all documents highest matching score first
  arr.sort((a, b) => b.sim - a.sim);

  let response = [];
  let nonZero = 0;

  // Compiling the Top 10 Search Results
  for (let i = 0; i < 10; i++) {
    if (arr[i].sim != 0) nonZero++;
    const str = path.join(__dirname, "Problems");
    const str1 = path.join(str, `problem_text_${arr[i].id + 1}.txt`);
    
    // Safety check to ensure file exists before reading it
    if (fs.existsSync(str1)) {
      let question = fs.readFileSync(str1).toString().split("\n");
      let n = question.length;
      let problem = "";

      if (arr[i].id <= 1773) {
        problem = question[0].split("ListShare")[1] + " ";
        if (n > 1) problem += question[1];
      } else {
        problem = question[0] + " ";
        if (n > 1) problem += question[1];
      }
      response.push({
        id: arr[i].id,
        title: titles[arr[i].id],
        problem: problem,
      });
    }
  }

  // Deliberate user experience timeout cushion to showcase loading animations
  setTimeout(() => {
    if (nonZero) res.json(response);
    else res.json([]);
  }, 1000);
});

// 3. GET route to display an individual full coding question text
app.get("/question/:id", (req, res) => {
  const id = Number(req.params.id);
  const str = path.join(__dirname, "Problems");
  const str1 = path.join(str, `problem_text_${id + 1}.txt`);
  
  if (!fs.existsSync(str1)) {
    return res.status(404).send("Problem statement file not found.");
  }

  let text = fs.readFileSync(str1).toString();
  if (id <= 1773) {
    text = text.split("ListShare");
    text = text[1] || text[0];
  }

  var find = "\n";
  var re = new RegExp(find, "g");
  text = text.replace(re, "<br/>");

  let title = titles[id] || "Unknown Problem";
  title = title.split("-");
  let temp = "";
  for (let i = 0; i < title.length; i++) {
    temp += title[i] + " ";
  }
  title = temp.trim().capitalize();
  
  let type = "Techdelight";
  if (id < 1774) type = "Leetcode";
  else if (id < 2214) type = "Interview Bit";
  
  const questionObject = {
    title,
    link: urls[id] || "#",
    value: text,
    type,
  };

  res.locals.questionObject = questionObject;
  res.locals.questionBody = text;
  res.locals.questionTitle = titles[id];
  res.locals.questionUrl = urls[id];
  res.render("question");
});

// Listening Configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Ghanendar's CodeLabs Server is running smoothly on port " + port);
});