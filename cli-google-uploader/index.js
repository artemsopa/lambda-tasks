const { google } = require("googleapis");
const inquirer = require("inquirer");
const fs = require("fs");
const prettylink = require("prettylink");

const CLIENT_ID =
  "324933358487-jg9ate8u0ut8bl1al6ijhd534o86lsr1.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const REFRESH_TOKEN =
  "1//04_SLALvDjA0vCgYIARAAGAQSNwF-L9IrW5JDyWEQIURhIi0WGuGSRURbF_cWVkpwxD2QquaLVFJqXFcF6v0DxcPU1NJO63EUnPI";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const uploadFile = async (fileName, filePath) => {
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: ["1TK0XIFfyNP0rVNYK63OFWAW_7rGwsuu1"],
    },
    media: {
      body: fs.createReadStream(filePath),
    },
  });
  return response.data;
};

const getPathQ = {
  type: "input",
  message:
    "Drag and drop your image to terminal and press ENTER for uploading:",
  name: "path",
};

const changeTitleQ = (title) => {
  return {
    type: "confirm",
    message: `You upload the file with the name: ${title}. Would you like to change it?`,
    name: "isChange",
  };
};

const enterTitleQ = {
  type: "input",
  message: "Enter new file name (without extension .jpg, .png, etc.):",
  name: "title",
};

const shortUrlQ = {
  type: "confirm",
  message: `Would you like to shorten your link?`,
  name: "isShort",
};

const startUpload = async () => {
  try {
    const file = await inquirer.prompt(getPathQ);
    let fileName = file.path.split("\\").pop();
    const ext = "." + fileName.split(".").pop();
    console.log(
      `Path to file: ${file.path}\nFile name: ${fileName}\nFile extension: ${ext}`
    );
    const confirm = await inquirer.prompt(changeTitleQ(fileName));
    if (confirm.isChange) {
      const input = await inquirer.prompt(enterTitleQ);
      fileName = input.title + ext;
      console.log({ newFileName: fileName });
    }
    const obj = await uploadFile(fileName, file.path);
    console.log(`${file.path}\nSuccessfully uploaded!`);
    const confirmUrl = await inquirer.prompt(shortUrlQ);
    const link = (await generatePublicUrl(obj.id)).webViewLink;
    if (confirmUrl.isShort) {
      console.log("Your short link:", await getShortUrl(link));
    } else {
      console.log("Your link:", link);
    }
  } catch (error) {
    console.log(error);
  }
};

const generatePublicUrl = async (fileId) => {
  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });
  const result = await drive.files.get({
    fileId: fileId,
    fields: "webViewLink", //webContentLink
  });
  return result.data;
};

const getShortUrl = async (url) => {
  return await new prettylink.TinyURL().short(url);
};

startUpload();
