/*
* dev: Sazumi Viki
* ig: @moe.sazumiviki
* gh: github.com/sazumivicky
* site: sazumi.moe
*/

const { remote } = require('webdriverio');
const express = require('express');
const bodyParser = require('body-parser');
const randomUseragent = require('random-useragent');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/stalker', async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            const jsonResponse = { message: 'Please Input Username' };
            res.setHeader("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(jsonResponse, null, 2));
            return;
        }

        const userAgent = randomUseragent.getRandom();

        const browser = await remote({
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: [
                        '--headless',
                        '--disable-gpu',
                        '--no-sandbox',
                        '--disable-dev-shm-usage',
                        '--user-agent=' + userAgent
                    ]
                }
            }
        });

        await browser.url('https://tools.revesery.com/stalkers/');

        const inputField = await browser.$('#instagramUsername');
        await inputField.waitForExist();
        await inputField.setValue(username);

        const checkButton = await browser.$('button=Check Stalker');
        await checkButton.click();

        await browser.waitUntil(async () => {
            const resultContainer = await browser.$('#resultContainer');
            const resultText = await resultContainer.getText();
            return resultText.includes('Your Stalkers:') || resultText.includes('No Stalker Found');
        }, {
            timeout: 20000,
            timeoutMsg: 'Timeout waiting for result to appear'
        });

        const resultContainer = await browser.$('#resultContainer');
        const resultText = await resultContainer.getText();

        if (resultText.includes('No Stalker Found')) {
            const jsonResponse = { message: 'No Stalker Found' };
            res.setHeader("Content-Type", "application/json");
            res.status(404).send(JSON.stringify(jsonResponse, null, 2));
        } else {
            const stalkers = resultText.split('\n').slice(1).map(item => {
                const [name, username] = item.split('. ')[1].split(' | ');
                return { Name: name.trim(), username: (username ? username.trim() : "(undefined)") };
            });

            const jsonResponse = { stalkers };
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(jsonResponse, null, 2));
        }

        await browser.deleteSession();
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while scraping the website.' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});