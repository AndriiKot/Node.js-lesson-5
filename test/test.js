const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");
const technologiesDocsLinks = require("../technologies/docs_links.json");
const technologiesSvg = require("../technologies/technologies_svg.json");

const filePath = path.join(__dirname, "README.md");

const topic = config.README_TOPIC;
const top_page = config.top_page;
const back_to_top = config.back_to_top_page;
const base_url = config.BASE_URL;
const base_url_technologies = config.BASE_URL_TECHNOLOGIES;

const folderSteps = "./steps";
const folderImagesPreviews = "./images/previews";
const urlTreeBranch = `${base_url}/tree/${config.BRANCH}`;

const table = generateTable(base_url, getFolders(folderSteps), 5);

const README_TEMPLATE = [
  top_page,
  topic,
  generateDetailsTemplate("Follow Links Steps", table),
  generateImagePreview(base_url, 4, getFiles(folderImagesPreviews).at(-1)),
  back_to_top,
  generateTableTechnologies(config.TECHNOLOGIES),
  back_to_top,
];

function generateImagePreview(base_url_images, header_level, imageName) {
  const alt = imageName.replace(/\.[^.]*$/g, "");
  return `<h${header_level}>preview</h${header_level}>
    <img src="${urlTreeBranch}${folderImagesPreviews}${imageName}" alt="${alt}">
  `;
}
function getFolders(folderPath) {
  const files = fs.readdirSync(folderPath);
  const folders = files.filter((file) => {
    const filePath = path.join(folderPath, file);
    return fs.statSync(filePath).isDirectory();
  });
  return folders.sort();
}

function getFiles(folderPath) {
  const files = fs.readdirSync(folderPath);
  const fileList = files.filter((file) => {
    const filePath = path.join(folderPath, file);
    return fs.statSync(filePath).isFile();
  });
  return fileList.sort();
}

function generateDetailsTemplate(title, content) {
  return `\n<details>
      <summary>
        <h4>${title}</h4>
      </summary>
       ${content}</details>\n`;
}

function createTableHeader(baseURL, link, i) {
  return `<th><a href="${baseURL}/tree/${config.BRANCH}/steps/${link}" target="_self">Step ${i}</a></th>`;
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

function generateTableTechnologies(relevantTechnologies) {
  return`
<table>
  <thead>
      ${relevantTechnologies.map((tech, i) => {
        if(i === 0) {
          return `<tr><th>${tech}</th>`;
        } else if (i === relevantTechnologies.length - 1) {
          return `<th>${tech}</th></tr>`;
        } else {
          return `<th>${tech}</th>`;
        }
      }).join("")}
  </thead>
  <tbody>
      ${relevantTechnologies.map((tech, i) => {
        if(i === 0) {
          return `<tr><td><a href="${technologiesDocsLinks[tech]}" target="_self"><img src="${base_url_technologies}${technologiesSvg[tech]}" alt="${tech}"></a></td>`;
        } else if (i === relevantTechnologies.length - 1) {
          return `<td><a href="${technologiesDocsLinks[tech]}" target="_self"><img src="${base_url_technologies}${technologiesSvg[tech]}" alt="${tech}"></a></td></tr>`;
        } else {
          return `<td><a href="${technologiesDocsLinks[tech]}" target="_self"><img src="${base_url_technologies}${technologiesSvg[tech]}" alt="${tech}"></a></td>`;
        }
      }).join("")}
  </tbody>
</table>`;
}



function generateTable(baseURL, links, columns) {
  return `
<table>
  <thead>
    ${createTableRow(baseURL, links, columns)}
  </thead>
  <tbody>
  </tbody>
</table>
`;
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
