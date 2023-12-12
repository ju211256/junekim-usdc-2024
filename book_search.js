/** 
 * RECOMMENDATION
 * 
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 * 
 * The Developer Tools in Chrome are available under the "..." menu, 
 * futher hidden under the option "More Tools." In Firefox, they are 
 * under the hamburger (three horizontal lines), also hidden under "More Tools." 
 */

/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */ 
function findSearchTermInBooks(searchTerm, scannedTextObj) {
    const results = [];
    let previousLastWord = '';

    scannedTextObj.forEach(book => {
        book.Content.forEach(content => {
            // Check for the searchTerm in the current line
            if (content.Text.includes(searchTerm)) { // If the results match, add to the results object
                results.push({
                    ISBN: book.ISBN,
                    Page: content.Page,
                    Line: content.Line
                });
            }

            // If previous line ended with a hyphen, combine the last word of the last line with the first word of current line.
            if (previousLastWord) {
                let firstWordOfCurrentLine = content.Text.split(' ')[0]; // Get the first word of the current line
                let combinedWord = previousLastWord + firstWordOfCurrentLine; // Combine the hyphenated word into one full word

                if (combinedWord === searchTerm) { // If the results match, add current line to the result object
                    results.push({
                        ISBN: book.ISBN,
                        Page: content.Page,
                        Line: content.Line
                    });
                }
            }

            // If the current line ends with a hyphen, store the hyphenated word to be used for word search in next iteration.
            if (content.Text.endsWith('-')) {
                let words = content.Text.split(' ');
                previousLastWord = words[words.length - 1].slice(0, -1); // Get the last word without the hyphen
            } else {
                previousLastWord = ''; // If current line does not end with a hyphen, simply leave the varaible as empty.
            }
        });
    });

    return { 
        SearchTerm: searchTerm,
        Results: results
    };
}

/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum. The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
];

/** Example output object */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
};

/* Unit tests */

console.log("Running unit tests for findSearchTermInBooks...");

/** Test 1: Check for exact match with known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut.Results);
    console.log("Received:", test1result.Results);
}

/** Test 2: Check for correct number of results. */
const test2result = findSearchTermInBooks("Canadian's", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected result count:", twentyLeaguesOut.Results);
    console.log("Received result count:", test2result.Results);
}

/** Negative Test: Check for no matches when the search term is not present. */
const negativeTestResult = findSearchTermInBooks("nonexistent", twentyLeaguesIn); 
if (negativeTestResult.Results.length == 0) {
    console.log("PASS: Negative Test");
} else {
    console.log("FAIL: Negative Test");
    console.log("Expected 0 results but received:", negativeTestResult.Results.length);
}

/** Test with Empty Array of Books */
const emptyBooksTestResult = findSearchTermInBooks("any", []);
if (emptyBooksTestResult.Results.length === 0) {
    console.log("PASS: Test with Empty Array of Books");
} else {
    console.log("FAIL: Test with Empty Array of Books");
    console.log("Expected 0 results but received:", emptyBooksTestResult.Results.length);
}

/** Test with Book Having No Content */
const noContentBook = [{
    "Title": "Empty Book",
    "ISBN": "0000000000",
    "Content": []
}];

const noContentBookTestResult = findSearchTermInBooks("any", noContentBook);
if (noContentBookTestResult.Results.length === 0) {
    console.log("PASS: Test with Book Having No Content");
} else {
    console.log("FAIL: Test with Book Having No Content");
    console.log("Expected 0 results but received:", noContentBookTestResult.Results.length);
}

/** Case-Sensitive Test: Check for case sensitivity. */
const caseSensitiveTestResult = findSearchTermInBooks("her", twentyLeaguesIn); 
if (caseSensitiveTestResult.Results.length == 1) {
    console.log("PASS: Case-Sensitive Test");
} else {
    console.log("FAIL: Case-Sensitive Test");
    console.log("Expected 1 results but received:", caseSensitiveTestResult.Results.length);
}

/** Hyphenated Word Breaks Test: Check for hyphenated word across lines. */
const hyphenatedTestResult = findSearchTermInBooks("darkness", twentyLeaguesIn); 
if (hyphenatedTestResult.Results.length == 1) {
    console.log("PASS: Hyphenated Word Breaks Test");
} else {
    console.log("FAIL: Hyphenated Word Breaks Test");
    console.log("Expected 1 result but received:", hyphenatedTestResult.Results.length);
}

