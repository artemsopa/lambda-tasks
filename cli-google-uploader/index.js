//cli-google-uploader@peerless-clock-352021.iam.gserviceaccount.com

const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

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

const filePath = path.resolve(__dirname, "tower.jpg");

const uploadFile = async () => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "image.jpg",
        parents: ['1TK0XIFfyNP0rVNYK63OFWAW_7rGwsuu1'],
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });
    console.log(response.data);
  } catch (error) {
      console.log(error.message);
  }
};

uploadFile();