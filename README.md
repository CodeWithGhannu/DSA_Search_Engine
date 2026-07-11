<div align="center">

# 🚀 DSA Search Engine

### Intelligent NLP-Powered Search Engine for Coding Interview Problems

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![EJS](https://img.shields.io/badge/EJS-8BC34A?style=for-the-badge)]()
[![BM25](https://img.shields.io/badge/BM25-Ranking-blue?style=for-the-badge)]()
[![NLP](https://img.shields.io/badge/NLP-Powered-success?style=for-the-badge)]()

---

*A high-performance search engine that intelligently retrieves DSA problems using Natural Language Processing and BM25 relevance ranking.*

</div>

---

# ✨ Overview

**DSA Search Engine** is an Information Retrieval system designed to search coding interview problems collected from multiple competitive programming platforms.

Unlike conventional keyword search, the engine performs **linguistic preprocessing** before ranking documents. Queries undergo normalization, spell correction, lemmatization, and numerical transformation, allowing the system to understand different forms of the same query and retrieve significantly more relevant results.

The ranking pipeline combines **BM25**, **TF-IDF statistics**, and **title similarity scoring** to improve retrieval quality while maintaining fast response times.

---

# 🌟 Features

- 🔍 Intelligent keyword-based search over **3000+ DSA problems**
- 🧠 BM25 Information Retrieval Engine
- ⚡ Fast document ranking using precomputed indexes
- ✨ NLP-powered query preprocessing
- 📝 Automatic Spell Correction
- 🔄 Lemmatization
- 🔤 Stopword Removal
- 🔢 Number ↔ Word Normalization
- 🎯 Title Similarity Re-ranking
- 📚 Multi-platform indexing
  - LeetCode
  - InterviewBit
  - TechDelight

---

# 🏗 Architecture

```text
                    User Query
                         │
                         ▼
              NLP Preprocessing Pipeline
                         │
        ┌─────────────────────────────────┐
        │ Stopword Removal                │
        │ Text Normalization              │
        │ Lemmatization                   │
        │ Spell Correction                │
        │ Number Transformation           │
        └─────────────────────────────────┘
                         │
                         ▼
                 Keyword Validation
                         │
                         ▼
               BM25 Ranking Engine
                         │
                         ▼
          Title Similarity Enhancement
                         │
                         ▼
             Top Ranked Search Results
```

---

# ⚙️ Technology Stack

| Category | Technologies |
|----------|--------------|
| Backend | Node.js, Express.js |
| Template Engine | EJS |
| Language | JavaScript |
| NLP | natural, wink-lemmatizer, stopword |
| Information Retrieval | BM25, TF-IDF |
| Utilities | string-similarity, remove-punctuation, words-to-numbers |

---

# 🔬 Search Pipeline

```
User Query
      │
      ▼
Tokenization
      │
      ▼
Stopword Removal
      │
      ▼
Case Normalization
      │
      ▼
Punctuation Removal
      │
      ▼
Number ↔ Word Conversion
      │
      ▼
Lemmatization
      │
      ▼
Spell Correction
      │
      ▼
Keyword Validation
      │
      ▼
BM25 Ranking
      │
      ▼
Title Similarity
      │
      ▼
Top-k Results
```

---

# 📂 Project Structure

```text
DSA_Search_Engine
│
├── app.js
├── package.json
├── Problems/
├── public/
├── views/
├── TF.js
├── IDF.js
├── keywords.js
├── titles.js
├── urls.js
├── length.js
└── README.md
```

---

# ⚡ Core Search Components

| Component | Purpose |
|-----------|---------|
| BM25 | Document relevance scoring |
| TF | Measures keyword importance inside each document |
| IDF | Rewards informative and rare keywords |
| Lemmatizer | Converts grammatical variants to root words |
| Spell Checker | Handles misspelled queries |
| Title Similarity | Boosts highly relevant document titles |
| Stopword Removal | Eliminates unnecessary words |
| Number Converter | Handles queries like **2 Sum** ↔ **Two Sum** |

---

# 📈 Workflow

```text
Browser
   │
   ▼
Express Server
   │
   ▼
Receive Query
   │
   ▼
NLP Processing
   │
   ▼
BM25 Ranking
   │
   ▼
Sort Documents
   │
   ▼
Retrieve Top Results
   │
   ▼
Render Response
```

---

# 👨‍💻 Author

### Ghanendar Jurasia

**B.Tech — Computer Science & Engineering**

**Indian Institute of Technology (BHU), Varanasi**

🔗 GitHub: **[@CodeWithGhannu](https://github.com/CodeWithGhannu)**

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a star!

</div>
