
function formatString(str, length) {
  const number = str.match(/\d+/)[0];
  const paddedNumber = number.padStart(length - (str.length - number.length), ' ');
  return `${str.replace(/\d+/, paddedNumber)}`;
}

function generateTable(baseURL, links) {
  const columns = 5;
  const th = (baseURL, link, i) =>
    `<th><a href="${baseURL}${link}" target="_self">${formatString('Step ' + i, 6)}</a></th>`;
  const values = {
    0: function (baseURL, link, i) {
      return `<tr>${th(baseURL, link, i)}`;
    },
    default: function (baseURL, link, i) {
      return th(baseURL, link, i);
    },
    lastTh: function (baseURL, link, i) {
      return `${th(baseURL, link)}</tr>`;
    },
  };
  return `
<table>
  <thead>
    ${links
      .map((link, i) => {
        return (
          values[i === 0 || i % columns] ||
          values[i === links.length - 1 || "lastTh"] ||
          values["default"]
        )(baseURL, link, i);
      })
      .join("")}
  </thead>
</table>
`;
}
