"use strict";

const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");
const technologiesDocsLinks = require("./technologies/docs_links.json");
const technologiesSvg = require("./technologies/technologies_svg.json");

// ParserFreeCodeCamp
const puppeteer = require("puppeteer");

function writeTitle(newContent) {
  try {
    fs.writeFileSync(path.join(LAST_STEP_PATH, "title.txt"), newContent);
    console.log("Successfully wrote new content to 'title.txt' file.");
  } catch (err) {
    console.error("Error occurred while writing to 'title.txt' file:", err);
  }
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/learn-form-validation-by-building-a-calorie-counter/step-19"
  );

  // Get the content of the element with ID "description"
  const description = await page.$eval(
    "#description",
    (element) => element.outerHTML
  );
  writeTitle(description);

  await browser.close();
})();
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
const last_description_task = readDescriptionTask();
const title = cleanText(last_description_task);

const table = generateTable(base_url, getFolders(folderSteps), 5);

function getLastFolderStep(folders) {
  return folders.at(-1);
}

function readDescriptionTask() {
  let task = fs.readFileSync(path.join(LAST_STEP_PATH, "title.txt"), {
    encoding: "utf8",
  });
  const text = task.replace(' id="description"', "");
  const regex = /<[^>]+>/g;

  if (!regex.test(text)) {
    return "";
  }

  return text.trim();
}

function parseFileTitle(newContent) {
  try {
    fs.writeFileSync(path.join(LAST_STEP_PATH, "title.txt"), newContent);
    console.log("File 'title.txt' has been overwritten.");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}
function cleanText(text) {
  const regex = /<[^>]+>/g;

  if (!regex.test(text)) {
    return text;
  }

  if (!text.startsWith("Step")) {
    text = getNumberStep(LAST_STEP_FOLDER) + "\n" + text;
  }

  text = text.replace(/<[^>]+>/g, "");

  let cleanedText = "";
  const words = text.split(" ");
  let currentLineLength = 0;
  let wordCount = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (wordCount > 0 && wordCount % 7 === 0) {
      cleanedText += "\n";
      currentLineLength = 0;
    }
    cleanedText += word + " ";
    currentLineLength += word.length + 1;
    wordCount++;
  }

  return cleanedText;
}

function getNumberStep(folder) {
  return `<h3>Step  ${+folder.replace(/\D/g, "")}</h3>`;
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
  generateDetailsTemplate("Follow Links Steps", table),
  generateDetailsTemplate(
    "Description of the Task",
    `${getNumberStep(LAST_STEP_FOLDER)}\n\n${last_description_task}`
  ),
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
       ${content}
</details>\n\n`;
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
</table>`;
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

function createReadmeFile(directoryPath, template) {
  try {
    const readmePath = path.join(directoryPath, "README.md");

    fs.writeFileSync(readmePath, template.join(""), {
      flag: "w",
    });

    console.log("README.md file created/updated successfully!");
  } catch (err) {
    console.error("Error creating/updating README.md file:", err);
  }
}

parseFileTitle(title);
createReadmeFile(MAIN_PATH, README_MAIN);
createReadmeFile(STEPS_PATH, README_MAIN);
createReadmeFile(LAST_STEP_PATH, README_STEP);
