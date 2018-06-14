import { Meta } from "@angular/platform-browser";
import { Injectable } from "@angular/core";

export class Seo {
    title:string;
    description:string;
    keywords?:string;
    canonical?:string;
}

export class Social extends Seo{
 img:string;
 twiterSite:string;
 twitterCreator:string;
 url:string;
}

export class SocialProduct extends Social{
   price:string;
   currency:string
   availability:string;
   }

export class SocialArticle extends Social{
    ogtype:"article";
    author:string;
   }
export const arrayJson = [];

export const bookJson = {
    
        "@context": "http://schema.org",
        "@type": "Book",
        "name": "",
        "publisher": "",
        "offers":
        {
           "@type": "",
           "price": "",
           "priceCurrency": "",
        },
      
}




@Injectable()
export class MetaService {

  private site = "https://my-awesome-app.com";  
  constructor() {}
  seo(data:Seo) {}

  social(data:Social) {}

  jsonLd(array:any[]) {
      
  }
}
