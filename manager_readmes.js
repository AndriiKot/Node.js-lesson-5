"use strict";

const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");
const technologiesDocsLinks = require("./technologies/docs_links.json");
const technologiesSvg = require("./technologies/technologies_svg.json");

const folderSteps = "steps";
const folderImagesPreviews = "images/previews";
const urlBlod = `/blob/${config.BRANCH}`;

const STEPS = getFolders(folderSteps);
const LAST_STEP_FOLDER = getLastFolderStep(STEPS);
const MAIN_PATH = path.join(__dirname, "..", "..");
const STEPS_PATH = path.join(MAIN_PATH, "steps");
const LAST_STEP_PATH = path.join(STEPS_PATH, LAST_STEP_FOLDER);

const topic = config.README_TOPIC;
const top_page = config.top_page;
const back_to_top = config.back_to_top_page;
const base_url = config.BASE_URL;
const base_url_technologies = config.BASE_URL_TECHNOLOGIES;

const table = generateTable(base_url, getFolders(folderSteps), 5);

function getLastFolderStep(folders) {
  return folders.at(-1);
}
function generateCodesProject() {
  const lastStepFolder = getFolders(folderSteps).at(-1);
  const lastStepFiles = getFiles(path.resolve(folderSteps, lastStepFolder));
  const intersection = lastStepFiles.filter((item) =>
    config.FILES.includes(item)
  );
  let stringCodesProject = "";

  intersection.forEach((file) => {
    const data = fs.readFileSync(
      path.resolve(folderSteps, lastStepFolder, file),
      { encoding: "utf8" }
    );
    stringCodesProject += `\n
<details open>
  <summary>
    <h4>${file}</h4>
  </summary>
\n\n\n\`\`\`${file.replace(/.*\./, "")}\n${data}\n\`\`\`\n\n${back_to_top}
</details>`;
  });
  return stringCodesProject;
}

const README_MAIN = [
  top_page,
  topic,
  generateDetailsTemplate("Follow Links Steps", table),
  generateImagePreview(base_url, 4, getFiles(folderImagesPreviews).at(-1)),
  back_to_top,
  generateTableTechnologies(config.TECHNOLOGIES, 33, 100, 100, 100),
  back_to_top,
  generateCodesProject(),
];

const README_STEP = [
  top_page,
  topic,
  generateDetailsTemplate("Description of the Task", table),
  generateImagePreview(base_url, 4, getFiles(folderImagesPreviews).at(-1)),
  back_to_top,
  generateTableTechnologies(config.TECHNOLOGIES, 33, 100, 100, 100),
  back_to_top,
  generateCodesProject(),
];

function generateImagePreview(base_url, header_level, imageName) {
  const alt = imageName.replace(/\.[^.]*$/g, "");
  const normalizeUrl = new URL(
    path.join(base_url, urlBlod, "images/previews", imageName)
  ).toString();
  return `<h${header_level}>preview</h${header_level}>
    <img src="${normalizeUrl}" alt="${alt}">
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

function generateTableTechnologies(
  relevantTechnologies,
  th_height,
  tb_height,
  th_width,
  tb_width
) {
  const th = (tech, height, width) => {
    return `<th height=${height} width=${width}>${tech}</th>`;
  };
  const a = (link, img) => {
    return `<a href=${link} target="_self">${img}</a>`;
  };

  const img = (src, alt) => {
    return `<img src=${src} alt=${alt}>`;
  };

  const tb = (tech, height, width, a) => {
    return `<td height=${height} width=${width}>${a(
      technologiesDocsLinks[tech],
      img(base_url_technologies + technologiesSvg[tech], tech)
    )}</td>`;
  };
  return `
<table>
  <thead>
      ${relevantTechnologies
        .map((tech, i) => {
          if (i === 0) {
            return `<tr>${th(tech, th_height, th_width)}`;
          } else if (i === relevantTechnologies.length - 1) {
            return `${th(tech, th_height, th_width)}</tr>`;
          } else {
            return th(tech, th_height, th_width);
          }
        })
        .join("")}
  </thead>
  <tbody>
      ${relevantTechnologies
        .map((tech, i) => {
          if (i === 0) {
            return `<tr>${tb(tech, tb_height, tb_width, a)}`;
          } else if (i === relevantTechnologies.length - 1) {
            return `${tb(tech, tb_height, tb_width, a)}</tr>`;
          } else {
            return tb(tech, tb_height, tb_width, a);
          }
        })
        .join("")}
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

function generateTableLink(files) {
  let result = "| ";
  for (let i = 0; i < files.length; i++) {
    let fileName = files[i];
    let fileNameWithoutExtension = fileName.split(".").join("");
    result += `[${fileName}](#${fileNameWithoutExtension}) |`;
  }
  result += "\n |";
  for (let i = 0; i < files.length; i++) {
    result += "------------------- | ";
  }
  result += "\n\n";
  return result;
}

function createReadmeFile(directoryPath, tamplate) {
  try {
    const readmePath = path.join(directoryPath, "README.md");

    fs.writeFileSync(readmePath, tamplate.join(""), {
      flag: "w",
    });

    console.log("README.md file created/updated successfully!");
  } catch (err) {
    console.error("Error creating/updating README.md file:", err);
  }
}

createReadmeFile(MAIN_PATH, README_MAIN);
createReadmeFile(STEPS_PATH, README_MAIN);
createReadmeFile(LAST_STEP_PATH, README_STEP);
