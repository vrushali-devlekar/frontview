import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

const dirsToCreate = [
  'components/ui',
  'components/layout',
  'components/public',
  'components/project',
  'pages/public',
  'pages/auth',
  'pages/main_dashboard',
  'pages/project_view'
];

dirsToCreate.forEach(dir => {
  fs.mkdirSync(path.join(srcDir, dir), { recursive: true });
});

const filesToMove = [
  { from: 'components/dashboard/Sidebar.jsx', to: 'components/layout/Sidebar.jsx' },
  { from: 'components/dashboard/TopNav.jsx', to: 'components/layout/TopNav.jsx' },
  { from: 'pages/Landing/HeroSection.jsx', to: 'components/public/HeroSection.jsx' },
  { from: 'pages/Landing/FeatureSection.jsx', to: 'components/public/Features.jsx' },
  { from: 'pages/Landing/StepSection.jsx', to: 'components/public/StepSection.jsx' },
  { from: 'pages/Landing/Footer.jsx', to: 'components/public/Footer.jsx' },
  { from: 'pages/Landing.jsx', to: 'pages/public/Landing.jsx' },
  { from: 'auth/Login.jsx', to: 'pages/auth/Login.jsx' },
  { from: 'auth/Register.jsx', to: 'pages/auth/Register.jsx' },
  { from: 'auth/AuthSuccess.jsx', to: 'pages/auth/Callback.jsx' },
  { from: 'components/dashboard/DashboardContent.jsx', to: 'pages/main_dashboard/Dashboard.jsx' },
  { from: 'pages/NewProject.jsx', to: 'pages/main_dashboard/NewProject.jsx' },
  { from: 'components/ActiveLinks/Applications.jsx', to: 'pages/project_view/Overview.jsx' },
  { from: 'components/ActiveLinks/DeploymentsPage.jsx', to: 'pages/project_view/Deployments.jsx' },
  { from: 'components/ActiveLinks/DeploymentLogsPage.jsx', to: 'pages/project_view/Terminal.jsx' },
  { from: 'components/ActiveLinks/Metrics.jsx', to: 'pages/project_view/Metrics.jsx' },
  { from: 'components/ActiveLinks/Settings.jsx', to: 'pages/project_view/Settings.jsx' }
];

filesToMove.forEach(({ from, to }) => {
  const src = path.join(srcDir, from);
  const dest = path.join(srcDir, to);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log(`Moved: ${from} -> ${to}`);
  } else {
    console.log(`Warning: Source file not found: ${from}`);
  }
});

const stubsToCreate = [
  'components/ui/CyberButton.jsx',
  'components/ui/StatusBadge.jsx',
  'components/ui/InputField.jsx',
  'components/ui/Loader.jsx',
  'components/project/TerminalLogs.jsx',
  'components/project/AIModal.jsx',
  'components/project/EnvTable.jsx',
  'components/project/DeployRow.jsx',
  'pages/main_dashboard/Integrations.jsx',
  'pages/main_dashboard/Members.jsx',
  'pages/main_dashboard/Account.jsx',
  'pages/project_view/Webhooks.jsx'
];

stubsToCreate.forEach(file => {
  const p = path.join(srcDir, file);
  if (!fs.existsSync(p)) {
    const compName = path.basename(file, '.jsx');
    const content = `import React from 'react';\n\nexport default function ${compName}() {\n  return <div>${compName} Component</div>;\n}\n`;
    fs.writeFileSync(p, content);
    console.log(`Created stub: ${file}`);
  }
});

console.log('Restructure complete! Please inform the AI so it can fix the imports.');
