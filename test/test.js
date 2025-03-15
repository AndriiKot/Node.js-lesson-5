const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");

const filePath = path.join(__dirname, "README.md");

const topic = config.README_TOPIC;
const top_page = config.top_page;
const back_to_top = config.back_to_top_page;
const base_url_steps = config.MAIN_README_DIFF.BASE_URL;

const folderSteps = "./steps";

function getFolders(folderPath) {
  const files = fs.readdirSync(folderPath);
  const folders = files.filter((file) => {
    const filePath = path.join(folderPath, file);
    return fs.statSync(filePath).isDirectory();
  });
  return folders;
}

const folders = getFolders(folderSteps);
console.log('Folders in the "steps" directory:', folders);

function generateDetailsTemplate(title, content) {
  return `\n<details>
      <summary>
        <h4>${title}</h4>
      </summary>
       ${content}</details>\n`;
}

function generateTable(baseURL, links) {
  return `\n<table>
    <thead>
      <tr>
        ${links
          .map(
            (link, i) =>
              `<th>
                <a href="${baseURL}${link}" target="_self">Step ${i}</a>
              </th>`
          )
          .join("")}
      </tr>
    </thead>
  </table>\n`;
}

const table = generateTable(base_url_steps, folders);

const README_TEMPLATE = [
  top_page,
  topic,
  generateDetailsTemplate("Follow Links Steps", table),
  back_to_top,
];

function createReadmeFile() {
  try {
    fs.writeFileSync(filePath, README_TEMPLATE.join(""), {
      flag: "w",
    });
    console.log("README.md file created/updated successfully!");
  } catch (err) {
    console.error("Error creating/updating README.md file:", err);
  }
}

createReadmeFile();
