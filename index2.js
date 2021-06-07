const { FormRecognizerClient, FormTrainingClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");

const endpoint = "https://okentregas-texto.cognitiveservices.azure.com/";
const apiKey = "7b226afb0afe4614ac75e2a7f837d51c";

const trainingClient = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));
const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));

async function trainModel() {

    const containerSasUrl = "https://storageokentrega.blob.core.windows.net/containerokentrega?sp=racwdl&st=2021-06-04T13:09:02Z&se=2021-06-05T13:09:02Z&sv=2020-02-10&sr=c&sig=TQya%2F6EaDsZURSMB7oQM%2B5%2Frtm3iFfnDn7UokwZdhh8%3D";

    const poller = await trainingClient.beginTraining(containerSasUrl, false, {
        onProgress: (state) => { console.log(`training status: ${state.status}`); }
    });
    const model = await poller.pollUntilDone();

    if (!model) {
        throw new Error("Expecting valid training result!");
    }

    console.log(`Model ID: ${model.modelId}`);
    console.log(`Status: ${model.status}`);
    console.log(`Training started on: ${model.trainingStartedOn}`);
    console.log(`Training completed on: ${model.trainingCompletedOn}`);

    if (model.submodels) {
        for (const submodel of model.submodels) {
            // since the training data is unlabeled, we are unable to return the accuracy of this model
            console.log("We have recognized the following fields");
            for (const key in submodel.fields) {
                const field = submodel.fields[key];
                console.log(`The model found field '${field.name}'`);
            }
        }
    }
    // Training document information
    if (model.trainingDocuments) {
        for (const doc of model.trainingDocuments) {
            console.log(`Document name: ${doc.name}`);
            console.log(`Document status: ${doc.status}`);
            console.log(`Document page count: ${doc.pageCount}`);
            console.log(`Document errors: ${doc.errors}`);
        }
    }
}

trainModel().catch((err) => {
    console.error("The sample encountered an error:", err);
});

