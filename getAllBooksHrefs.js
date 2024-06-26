const puppeteer = require('puppeteer');
const fs = require("fs")
let data = ""
let dataHrefAttributes = ""

async function acceptCookies(page) {

    await page.click('[title="Click to accept use of cookies"]');
    new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
}

async function getAllHref(page) {
    dataHrefAttributes += await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-href]');
        let hrefs = "";
        elements.forEach(element => {
            hrefs += element.getAttribute('data-href') + "\n";

        });
        return hrefs;
    });
}

async function writeInFile() {
    fs.writeFile(filePath, dataHrefAttributes, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('Data has been written to the file successfully.');
    });
}

const filePath = "./Bookshrefs.txt"

async function scrapData() {
    // Launch a headless browser
    const browser = await puppeteer.launch({headless: false, args: ['--start-maximized']});
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1800});
    await page.goto('https://www.kulturkaufhaus.de/en/start');
    //accept cookie
    await acceptCookies(page)
    //select book
    await page.click('[id="select2-f460458-0-469681408843-container"]');
    await page.click('#select2-f460458-0-469681408843-results>li:nth-child(1)');
    await page.click('[title="Search"]');
    await page.waitForNavigation({url: "https://www.kulturkaufhaus.de/en/search-results"})
    await acceptCookies(page)
    await getAllHref(page)
//TODO next
    for (let i = 1; i < 42; i++) {
        await page.goto(`https://www.kulturkaufhaus.de/en/search-results?bpmAjaxLazyLoad=1&bpmctrl=bpmpagenr.${i}%7Ckey.479988-1-0-0%7Cids.479988-0-480411%3A413659&bpmscrollajaxcallback=1#479988-0-480411:413659`)
        await acceptCookies(page)
        await getAllHref(page)

    }


    await writeInFile()
}

scrapData()

