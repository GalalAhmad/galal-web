const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Starting comprehensive Git History & Working Tree Secrets Scan...');

// Regex rules similar to Gitleaks / Trufflehog rules
const rules = [
  { name: 'Supabase Service Role / Anon Key', regex: /eyJhbGciOi[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g },
  { name: 'Postgres / Supabase Connection URI', regex: /postgres(?:ql)?:\/\/[^\s'"]+/gi },
  { name: 'Generic Password Assignment', regex: /(?:password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*['"]([^'"]+)['"]/gi },
  { name: 'Hardcoded Admin Password Reference', regex: /galal@admin\w*|galalahmad2026|admin123|admin2026/gi },
  { name: 'Private Key Block', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: 'Personal Phone Number (Egyptian/Saudi)', regex: /(?:\+?20|0)?1[0125][0-9]{8}|(?:\+?966|0)?5[0-9]{8}/g },
  { name: 'Email Address in Data/Code', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
];

function redact(val) {
  if (!val) return '';
  const s = String(val);
  if (s.length <= 4) return '***';
  return s.substring(0, 3) + '***' + s.substring(s.length - 2);
}

// 1. Scan full git commit log diffs across all refs
console.log('Scanning all Git commits and diffs across all refs...');
const gitLogDiff = execSync('git log -p --full-history --all --color=never', { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });

const findings = [];
const lines = gitLogDiff.split('\n');

let currentCommit = 'UNKNOWN';
let currentAuthor = '';
let currentDate = '';
let currentFile = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('commit ')) {
    currentCommit = line.split(' ')[1];
  } else if (line.startsWith('Author: ')) {
    currentAuthor = line.substring(8);
  } else if (line.startsWith('Date: ')) {
    currentDate = line.substring(6).trim();
  } else if (line.startsWith('diff --git ')) {
    const parts = line.split(' ');
    currentFile = parts[2] ? parts[2].replace(/^a\//, '') : '';
  } else if (line.startsWith('+') && !line.startsWith('+++')) {
    const addedContent = line.substring(1);
    
    // Ignore false positives like package-lock.json integrity hashes or common public urls
    if (currentFile.includes('package-lock.json') || currentFile.endsWith('.lock')) continue;
    if (currentFile.includes('node_modules')) continue;

    for (const rule of rules) {
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(addedContent)) !== null) {
        const matchedText = match[0];
        
        // Filter out public/harmless matches
        if (rule.name === 'Email Address in Data/Code') {
          if (matchedText.includes('example.com') || matchedText.includes('vercel.app') || matchedText.includes('schema.org') || matchedText.includes('w3.org') || matchedText.includes('github.com')) continue;
        }
        if (rule.name === 'Personal Phone Number (Egyptian/Saudi)') {
          // Ignore standard generic examples like 01000000000 or emergency numbers
          if (/^01000000000$/.test(matchedText)) continue;
          if (currentFile.includes('SingleTestClient.tsx') && ['16328', '920033360'].includes(matchedText)) continue;
        }

        findings.push({
          rule: rule.name,
          commit: currentCommit.substring(0, 8),
          date: currentDate,
          file: currentFile,
          matchedRedacted: redact(matchedText),
          snippet: addedContent.substring(0, 100).replace(matchedText, redact(matchedText))
        });
      }
    }
  }
}

// 2. Scan currently committed files in working directory
console.log('Scanning all files currently in working directory...');
const filesOutput = execSync('git ls-files', { encoding: 'utf8' });
const committedFiles = filesOutput.split('\n').map(f => f.trim()).filter(Boolean);

const workingTreeFindings = [];
for (const file of committedFiles) {
  if (!fs.existsSync(file)) continue;
  if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.ico') || file.endsWith('.pdf')) continue;
  
  const content = fs.readFileSync(file, 'utf8');
  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    let match;
    while ((match = rule.regex.exec(content)) !== null) {
      const matchedText = match[0];
      if (rule.name === 'Email Address in Data/Code') {
        if (matchedText.includes('example.com') || matchedText.includes('vercel.app') || matchedText.includes('schema.org') || matchedText.includes('w3.org') || matchedText.includes('github.com')) continue;
      }
      if (rule.name === 'Personal Phone Number (Egyptian/Saudi)') {
        if (/^01000000000$/.test(matchedText)) continue;
      }

      workingTreeFindings.push({
        rule: rule.name,
        file: file,
        matchedRedacted: redact(matchedText),
        line: match.index
      });
    }
  }
}

// Write findings to JSON report
const report = {
  totalGitHistoryFindings: findings.length,
  totalWorkingTreeFindings: workingTreeFindings.length,
  gitHistoryFindings: findings,
  workingTreeFindings: workingTreeFindings
};

fs.writeFileSync('scripts/secrets_scan_result.json', JSON.stringify(report, null, 2), 'utf8');
console.log(`Scan completed. Total history findings: ${findings.length}, working tree findings: ${workingTreeFindings.length}`);
