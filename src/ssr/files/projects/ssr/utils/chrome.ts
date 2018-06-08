const puppeteer = require('puppeteer');

interface BrowserRenderOptions
{
url:string
}

export class ChromeRenderer {

    private browser:any;
    private page:any;
  public test:String = "juanola";


  public async initialize(){

    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();

  }

  public async render(options:BrowserRenderOptions){

    await this.page.goto(options.url, {waitUntil: 'networkidle2'});
    return await this.page.evaluate(() => document.documentElement.outerHTML);
  }

  async close(){
    this.browser.close();
  }

  }
