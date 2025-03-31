const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get current date and time in UTC
const now = new Date();
const buildDate = now.toISOString().split('T')[0];
const buildTime = now.toISOString().split('T')[1].substring(0, 8);
const buildTimestamp = `${buildDate} ${buildTime}`;

// Try to get git user info
let gitUser = 'Unknown';
try {
  gitUser = execSync('git config user.name').toString().trim();
} catch (e) {
  console.log('Could not get git user, using default');
}

// Create build metadata
const buildMeta = {
  buildDate,
  buildTime,
  buildTimestamp,
  lastUpdatedBy: gitUser
};

// Write to a JSON file that can be imported
const outputPath = path.join(__dirname, '../public/build-meta.json');
fs.writeFileSync(outputPath, JSON.stringify(buildMeta, null, 2));

console.log(`Build metadata generated at ${outputPath}`);
console.log(`Last updated: ${buildTimestamp} by ${gitUser}`);