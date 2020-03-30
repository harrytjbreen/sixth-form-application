require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const word2pdf = require("word2pdf");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const app = express();

const MSD = process.env.SAVE_DIRECTORY;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/save-application", async (req, res) => {
  const { body } = req;
  const application = {
    id: uuid(),
    content: { ...body }
  };

  // Add some meta
  application._meta = {
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    time: new Date(),
  };

  // Save this
  console.log(`Saving application ${application.id}.`);

  await saveToJson(application);
  console.log(`--> Saved to JSON (1/3)`);
  await saveToSpreadsheet(application);
  console.log(`--> Saved to Spreadsheet (2/3)`);
  await saveToPdf(application);
  console.log(`--> Saved to Word Doc (3/3)`);
  console.log("Completed Saved.");

  await res.json({ success: true, id: application.id });
});

const saveToJson = async application => {
  await promisify(fs.writeFile)(path.join(MSD, `_json/${application.id}.json`), JSON.stringify(application, null, 4));
};

const SPREADSHEET_HEADERS = [
  {valueName: "id", displayName: "Application ID"},

  {valueName: "forename", displayName: "Forename"},
  {valueName: "namePreference", displayName: "Name Preference"},
  {valueName: "surname", displayName: "Surname"},
  {valueName: "gender", displayName: "Gender"},
  {valueName: "dob", displayName: "Date of Birth"},

  {valueName: "houseID", displayName: "House Name/Number"},
  {valueName: "streetName", displayName: "Street Name"},
  {valueName: "town", displayName: "Town"},
  {valueName: "county", displayName: "County"},
  {valueName: "postcode", displayName: "Postcode"},

  {valueName: "studentEmail", displayName: "Student Email"},
  {valueName: "currentSchool", displayName: "Current School"},
  {valueName: "currentYearGroup", displayName: "Year Group"},
  {valueName: "headOfYearName", displayName: "Head of Year Name"},

  {valueName: "britishCitizen", displayName: "British Citizen?"},
  {valueName: "ukResident", displayName: "UK Resident?"},
  
  {valueName: "contact1Title", displayName: "Contact 1 Title"},
  {valueName: "contact1Forename", displayName: "Contact 1 Forename"},
  {valueName: "contact1Surname", displayName: "Contact 1 Surname"},
  {valueName: "contact1WorkTelephone", displayName: "Contact 1 Work Telephone"},
  {valueName: "contact1Relationship", displayName: "Contact 1 Relationship"},
  {valueName: "contact1ParentalResponsibility", displayName: "Contact 1 Parental Responsibility"},
  {valueName: "contact1Email", displayName: "Contact 1 Email"},

  {valueName: "contact2Title", displayName: "Contact 2 Title"},
  {valueName: "contact2Forename", displayName: "Contact 2 Forename"},
  {valueName: "contact2Surname", displayName: "Contact 2 Surname"},
  {valueName: "contact2WorkTelephone", displayName: "Contact 2 Work Telephone"},
  {valueName: "contact2Relationship", displayName: "Contact 2 Relationship"},
  {valueName: "contact2ParentalResponsibility", displayName: "Contact 2 Parental Responsibility"},
  {valueName: "contact2Email", displayName: "Contact 2 Email"},

];

const saveToSpreadsheet = async application => {
  const readSpreadSheet = async () => {
    if(!fs.existsSync(path.join(MSD, "spreadsheet/latest.csv"))) {
      // Generate spreadsheet
      let buildingData = SPREADSHEET_HEADERS.map(header => header.displayName).join(",");

      await promisify(fs.writeFile)(path.join(MSD, "spreadsheet/latest.csv"), buildingData);

      return buildingData;
    }

    return promisify(fs.readFile)(path.join(MSD, "spreadsheet/latest.csv"), "utf8");
  };

  const findHeader = header => {
    return SPREADSHEET_HEADERS.filter(fullHeader => fullHeader.displayName === header)[0].valueName;
  };

  const transformToReadableData = rawData => {
    if(rawData === null)
      return "";

    if(rawData === true)
      return "yes";
    else if (rawData === false)
      return "no";

    return rawData;
  };

  const flattenedApplication = {
    id: application.id,
    ...application._meta,
    ...application.content,
  };

  // Map this to SPREADSHEET_HEADERS and append it to the CSV
  const spreadSheetCurrentData = await readSpreadSheet();
  console.log("Read old spreadsheet data successfully.");
  const headerLine = spreadSheetCurrentData.split("\n")[0];
  const newData = headerLine.split(",").map(header => transformToReadableData(flattenedApplication[findHeader(header)])).join(",");

  await promisify(fs.writeFile)(path.join(MSD, "spreadsheet/latest.csv"), `${spreadSheetCurrentData}\n${newData}`);
};

const saveToPdf = async application => {
  const data= application.content;

  Object.keys(data).forEach((key) => {
    if (data[key] === null) {
      data[key] = "";
    }
  });

  data["tick"] = "✓";

  // Load the docx file as a binary
  let content = fs.readFileSync(path.resolve(__dirname, '_template.docx'), 'binary');

  let zip = new PizZip(content);

  let doc = new Docxtemplater();
  doc.loadZip(zip); //setOptions({parser:angularParser});

  // Set the templateVariables
  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    let e = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      properties: error.properties,
    };
    console.log(JSON.stringify({error: e}));
    throw error;
  }

  let buffer = doc.getZip().generate({type: 'nodebuffer'});

  fs.writeFileSync(path.resolve(MSD, `pdf/${data.forename}-${data.surname}-${application.id.toString().substring(0, 4)}.docx`), buffer);

  // const _data = await word2pdf(path.resolve(MSD, `pdf/temp_${application.id}.docx`));
  // fs.writeFileSync(path.resolve(MSD, `pdf/${application.id}.pdf`), _data);
};

const checkFolder = name => {
  console.log(`Checking '${name}' folder.`);

  if(!fs.existsSync(path.join(MSD, name))) {
    console.log(`'${name}' folder does not exist, creating it...`);

    fs.mkdirSync(path.join(MSD, name));
  }
};

const port = parseInt(process.env.PORT);
app.listen(port, () => {
  console.log(`Started sixth form application backend server on port ${port}.`);

  // Check internal systems
  checkFolder("_json");
  checkFolder("pdf");
  checkFolder("spreadsheet");

  console.log("Created folders. Application is now listening.");
});