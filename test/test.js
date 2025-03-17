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

function generateDetailsTemplate(title, content) {
  return `\n<details>
      <summary>
        <h4>${title}</h4>
      </summary>
       ${content}</details>\n`;
}

function createTableHeader(baseURL, link, i) {
  return `<th><a href="${baseURL}${link}" target="_self">Step ${i}</a></th>`;
}

function createTableRow(baseURL, links, columns) {
  return links
    .map((link, i) => {
      if (i === 0 || i % columns === 0) {
        return "<tr>" + createTableHeader(baseURL, link, i);
      } else if (i === links.length - 1) {
        return createTableHeader(baseURL, link, i) + "</tr>";
      } else {
        return createTableHeader(baseURL, link, i);
      }
    })
    .join("");
}

function generateTable(baseURL, links, columns) {
  return `
<table>
  <thead>
    ${createTableRow(baseURL, links, columns)}
  </thead>
</table>
`;
}

const table = generateTable(base_url_steps, getFolders(folderSteps), 5);

const README_TEMPLATE = [
  top_page,
  topic,
  generateDetailsTemplate("Follow Links Steps", table),
  generateTableTechnologies(),
  back_to_top,
];

function generateTableTechnologies() {
  return `\n#### Technologies\n\n<table>
      <thead>
        <tr>
          <th>HTML</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Test</td>
        </tr>
      </tbody>
</table>\n`;
}

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
