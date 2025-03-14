const fs = require('node:fs');
const path = require('node:path');
const config = require('./config');

const filePath = path.join(__dirname, 'README.md');
const topic = config.README_TOPIC;

async function createReadmeFile() {
  try {
    await fs.promises.writeFile(filePath, topic, { flag: 'w' });
    console.log('README.md file created/updated successfully!');
  } catch (err) {
    console.error('Error creating/updating README.md file:', err);
  }
}

createReadmeFile();
