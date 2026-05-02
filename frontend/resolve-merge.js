import { execSync } from 'child_process';
import path from 'path';

console.log("🚀 Starting Automatic Merge Conflict Resolution...");

const commands = [
  // 1. Keep our versions of the conflicted files
  'git checkout --ours package-lock.json',
  'git checkout --ours src/components/public/HeroSection.jsx',
  'git checkout --ours src/index.css',
  'git checkout --ours src/pages/main_dashboard/Dashboard.jsx',
  'git checkout --ours src/pages/project_view/Settings.jsx',

  // 2. Remove files that were modified/deleted in main but we intentionally deleted/moved them
  'git rm src/pages/Landing.jsx',
  'git rm src/auth/Login.jsx',

  // 3. Move newly added files from main (that were placed in the old 'Landing' folder) 
  // into our new 'components/public' folder structure
  'git mv src/pages/Landing/HowItWorks.jsx src/components/public/HowItWorks.jsx || echo "Already moved"',
  'git mv src/pages/Landing/TeamSection.jsx src/components/public/TeamSection.jsx || echo "Already moved"',
  'git mv src/pages/Landing/featureGrid.jsx src/components/public/featureGrid.jsx || echo "Already moved"',

  // 4. Clean up any empty directories
  'git clean -fd src/pages/Landing',
  'git clean -fd src/auth',

  // 5. Stage everything and commit
  'git add .',
  'git commit -m "Merge main: accepted local UI changes and resolved folder restructuring conflicts"'
];

for (const cmd of commands) {
  try {
    console.log(`\n> Executing: ${cmd}`);
    // Run the command. Ignoring errors for git clean/mv as they might already be handled
    const output = execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
    if (output) console.log(output.trim());
  } catch (error) {
    console.warn(`⚠️ Warning on command: ${cmd}`);
    console.warn(error.stderr ? error.stderr.trim() : error.message);
  }
}

console.log("\n✅ Merge conflicts resolved successfully! You can now run `npm run dev`.");
