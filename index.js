    const { FormRecognizerClient, FormTrainingClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
    const fs = require("fs");

    const endpoint = "https://okentregas-texto.cognitiveservices.azure.com/";
    const apiKey = "7b226afb0afe4614ac75e2a7f837d51c";

    const trainingClient = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));
    const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));

    async function recognizeContent() {
        const formUrl = "https://vt-vtwa-assets.varsitytutors.com/vt-vtwa/uploads/problem_question_image/image/19791/table.jpg";
        const poller = await client.beginRecognizeContentFromUrl(formUrl);
        const pages = await poller.pollUntilDone();

        
        if (!pages || pages.length === 0) {
            throw new Error("Expecting non-empty list of pages!");
        }

        for (const page of pages) {
            console.log(
                `Page ${page.pageNumber}: width ${page.width} and height ${page.height} with unit ${page.unit}`
            );
            for (const table of page.tables) {
                for (const cell of table.cells) {
                    console.log(`cell [${cell.rowIndex},${cell.columnIndex}] has text ${cell.text}`);
                }
            }
        }
    }

    recognizeContent().catch((err) => {
        console.error("The sample encountered an error:", err);
    });


