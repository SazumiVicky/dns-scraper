/*
* dev: Sazumi Viki
* ig: @moe.sazumiviki
* gh: github.com/sazumivicky
* site: sazumi.moe
*/

const express = require('express');
const { remote } = require('webdriverio');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.static('public'));

app.get('/api/dns', async (req, res) => {
    const { url } = req.query;

    console.log('1. Sedang membuka web');
    const browser = await remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
            }
        }
    });
    await browser.url('https://www.toolsoverflow.com/dns/cname-lookup');
    console.log('2. Berhasil membuka web');

    console.log('3. Sedang memasukan url');
    const inputElement = await browser.$('#tof-tool-input');
    await inputElement.setValue(url);
    console.log('4. Berhasil memasukan url');

    console.log('5. Menunggu output');
    const checkButton = await browser.$('.tof-input-button');
    await checkButton.click();
    await browser.pause(5000);
    console.log('6. Output berhasil didapatkan');

    const html = await browser.getPageSource();
    const $ = cheerio.load(html);

    const cname = $('.tof-tool-result-head .domain').text();
    const tableRows = $('.tof-table-data tr');

    const results = tableRows.map((_, row) => {
        const columns = $(row).find('td');
        const rowData = {};
        columns.each((index, column) => {
            const columnHeader = ["Hostname", "Type", "Target", "Ttl", "Organisation", "Country", "ASN Number"][index];
            rowData[columnHeader] = $(column).text().trim();
        });
        return rowData;
    }).get();

    const response = {
        cname,
        results
    };

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response, null, 2));

    await browser.deleteSession();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});