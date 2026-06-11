const fs = require('fs');
let code = fs.readFileSync('src/app/components/QuizWizard.js', 'utf8');

const searchString = '          {/* Lead Generation Matched Consultation Call Box */}\r\n          <div className={styles.ctaBox}>';
const searchString2 = '          {/* Lead Generation Matched Consultation Call Box */}\n          <div className={styles.ctaBox}>';

let start = code.indexOf(searchString);
if (start === -1) start = code.indexOf(searchString2);

const endString = '          </div>\r\n\r\n          <p className={styles.resultsDisclaimer}>';
const endString2 = '          </div>\n\n          <p className={styles.resultsDisclaimer}>';

let end = code.indexOf(endString, start);
let endLen = '          </div>'.length;
if (end === -1) {
    end = code.indexOf(endString2, start);
}

if (start > -1 && end > -1) {
    end += endLen;
    let block = code.substring(start, end);
    code = code.substring(0, start) + code.substring(end);
    
    const targetString = '          {/* OVARIAN RESERVE LAB CLUSTER PANEL */}';
    const insertPos = code.indexOf(targetString);
    
    if (insertPos > -1) {
        block = '          {results.category !== "low" && (\n  ' + block.split('\n').join('\n  ') + '\n          )}\n\n';
        code = code.substring(0, insertPos) + block + code.substring(insertPos);
        fs.writeFileSync('src/app/components/QuizWizard.js', code);
        console.log('Moved successfully');
    } else {
        console.log('Target not found');
    }
} else {
    console.log('Block not found', start, end);
}
