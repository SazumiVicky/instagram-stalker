/*
* Pengembang: Sazumi Viki
* Instagram: @moe.sazumiviki
* GitHub: github.com/sazumivicky
* Situs: sazumi.moe
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
    let browser;

    try {
        const { username } = req.query;

        if (!username) {
            const jsonResponse = { message: 'Mohon Masukkan Nama Pengguna (Username)' };
            res.setHeader("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(jsonResponse, null, 2));
            return;
        }

        const userAgent = randomUseragent.getRandom();

        browser = await remote({
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
        await inputField.waitForExist({ timeout: 10000 });
        await inputField.waitForEnabled({ timeout: 10000 });
        await inputField.setValue(username);

        const checkButton = await browser.$('button=Check Stalker');
        await checkButton.waitForExist({ timeout: 20000 });
        await checkButton.waitForEnabled({ timeout: 20000 });
        await checkButton.click();

        const resultContainer = await browser.$('#resultContainer');

        await browser.waitUntil(async () => {
            const resultText = await resultContainer.getText();
            if (resultText.includes('Tidak Ada Stalker Ditemukan')) {
                console.log('Tidak ada stalker ditemukan.');
                await browser.deleteSession();
                const jsonResponse = { message: 'Tidak Ada Stalker Ditemukan' };
                res.setHeader("Content-Type", "application/json");
                res.status(404).send(JSON.stringify(jsonResponse, null, 2));
                return true;
            } else {
                return resultText.includes('Stalker Anda:');
            }
        }, {
            timeout: 20000,
            timeoutMsg: 'Timeout menunggu hasil muncul'
        });

        const resultText = await resultContainer.getText();

        const stalkers = resultText.split('\n').slice(1).map(item => {
            const [name, username] = item.split('. ')[1].split(' | ');
            return { Nama: name.trim(), username: (username ? username.trim() : "(tidak terdefinisi)") };
        });

        const jsonResponse = { stalkers };
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(jsonResponse, null, 2));
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat melakukan scraping website.' });
    } finally {
        if (browser) {
            await browser.deleteSession();
        }
    }
});

app.listen(3000, () => {
    console.log('Server berjalan pada port 3000');
});