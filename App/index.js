const puppeteer = require('puppeteer');

const EMAIL_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const submitButton = 'button[type="submit"]';
const LINKEDIN_LOGIN_URL = 'https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Fsearch%2Fresults%2Fpeople%2F%3Fkeywords%3Dfullstack%26sid%3DL0s&fromSignIn=true&trk=cold_join_sign_in';

(async() =>{
    try{
        const browser = await puppeteer.launch({ headless: true});
        const page = await browser.newPage();

        
        await page.setDefaultNavigationTimeout(0); 
        await page.goto(LINKEDIN_LOGIN_URL, { waitUntil: 'domcontentloaded' })
        
        await page.click(EMAIL_SELECTOR)
        await page.keyboard.type('');  //Ingresar Perfil de linkedin
        await page.click(PASSWORD_SELECTOR);
        await page.keyboard.type('');  //Ingresar Password linkedin
        await page.click(submitButton);
        await page.waitForNavigation();


        await page.goto('https://www.linkedin.com/search/results/people/?keywords=fullstack&sid=L0s');
        await page.waitFor(1000);
        
        // Recorrer los perfiles
        const enlaces = await page.evaluate(()=>{
            const elements = document.querySelectorAll('#main > div > div > div:nth-child(2) > ul > li > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div.t-roman.t-sans > div > span.entity-result__title-line.entity-result__title-line--2-lines > span > a');
            
            const links = [];
            for (let element of elements){
                links.push(element.href);
            }
            return links;
        });

        // Extraer nombres
        const nombres = [];
        for(let enlace of enlaces){
            await page.goto(enlace);
            await page.waitFor(8000);
            

            const nombre = await page.evaluate(()=>{
                return Array.from(document.querySelectorAll('.pv-text-details__left-panel  h1')).map(x => x.textContent);
                
            });
            nombres.push(nombre);
        }

        console.log(nombres);
        
        console.log(enlaces.length);
        
        await page.waitFor(3000);
        await browser.close();
    } catch(e){
        console.log('error',e);
    }
})();