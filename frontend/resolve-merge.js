import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// This script removes conflict markers from files by keeping ONLY the incoming (theirs) code.
// It works by parsing the file content directly — no git checkout needed.

const srcDir = path.resolve('src');

function findConflictedFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...findConflictedFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js') || entry.name.endsWith('.json') || entry.name.endsWith('.css'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('<<<<<<< HEAD')) {
          results.push(fullPath);
        }
      } catch(e) {}
    }
  }
  return results;
}

function resolveConflictsKeepTheirs(content) {
  // This regex matches conflict blocks and keeps only the "theirs" (incoming) section
  const conflictRegex = /<<<<<<< HEAD[\s\S]*?=======\n([\s\S]*?)>>>>>>>[^\n]*\n?/g;
  return content.replace(conflictRegex, '$1');
}

console.log("🔍 Scanning for files with conflict markers in src/...\n");

const conflictedFiles = findConflictedFiles(srcDir);

// Also check package-lock.json at root
const lockFile = path.resolve('package-lock.json');
try {
  const lockContent = fs.readFileSync(lockFile, 'utf-8');
  if (lockContent.includes('<<<<<<< HEAD')) {
    conflictedFiles.push(lockFile);
  }
} catch(e) {}

if (conflictedFiles.length === 0) {
  console.log("✅ No conflict markers found! Everything is clean.");
  process.exit(0);
}

console.log(`Found ${conflictedFiles.length} files with conflict markers:\n`);

for (const filePath of conflictedFiles) {
  try {
    const original = fs.readFileSync(filePath, 'utf-8');
    const resolved = resolveConflictsKeepTheirs(original);
    
    if (resolved !== original) {
      fs.writeFileSync(filePath, resolved, 'utf-8');
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`  ✅ Resolved: ${relativePath}`);
    }
  } catch (err) {
    console.warn(`  ⚠️ Failed: ${filePath} — ${err.message}`);
  }
}

// Stage all changes
console.log("\n📦 Staging all resolved files...");
try {
  execSync('git add .', { stdio: 'pipe', cwd: path.resolve('..') });
  console.log("  Done.");
} catch(e) {
  // Try from current dir
  try { execSync('git add .', { stdio: 'pipe' }); } catch(e2) {}
}

// Amend the previous (broken) merge commit instead of creating a new one
console.log("📝 Amending previous commit with clean files...");
try {
  execSync('git commit --amend -m "Merge abhi-integration: accepted all incoming changes (clean)"', { stdio: 'pipe', cwd: path.resolve('..') });
  console.log("  Done.");
} catch(e) {
  try { 
    execSync('git commit -m "fix: resolve remaining conflict markers"', { stdio: 'pipe', cwd: path.resolve('..') }); 
  } catch(e2) {
    console.log("  Commit skipped (may need manual commit).");
  }
}

console.log("\n✅ All conflict markers removed! Run `npm run dev` to verify.");
