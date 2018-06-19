import { Meta, Title } from "@angular/platform-browser";
import { Injectable } from "@angular/core";
import { Location } from "@angular/common";
import { Route, ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { ɵDomAdapter,ɵgetDOM as getDOM } from "@angular/platform-browser";
import { Inject } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { SeoConfig, SocialConfig, SocialArticleConfig, SocialProductConfig, SocialBusinessConfig, articleJson, arrayJson, productJson, localBusJson, webPageJson, webSiteJson } from "./models/json";




@Injectable()
export class MetaService {
  private site = "https://my-awesome-app.com";
  public _dom: ɵDomAdapter = getDOM();
  public head:any;
  constructor(
    private _title: Title,
    private _meta: Meta,
    private router:Router,
    @Inject(DOCUMENT) private _document: any,
  ) {
    this.head = this._document.head;
  }

  updateTitle(title:string){
    this._title.setTitle(title);
  }


  seo(data: SeoConfig,json=true) {
    this._title.setTitle(data.title);
    this._meta.updateTag({ name: "description", content: data.description });
    data.keywords?this._meta.updateTag({ name: "keywords", content: data.keywords }):"";

    //Creating canonicalLink
    const canoLink = this._dom.createElement('link') as HTMLLinkElement;
    this._dom.setAttribute(canoLink, 'rel', 'canonical');
    this._dom.setAttribute(canoLink, 'href',  data.canonical? this.site + data.canonical : this.site +  this.router.url);
    this._dom.appendChild(this.head, canoLink);

    if (data.autoJson && json)
    {

    }


  }

  seoDomain(data: SeoConfig)
  {
    this.seo(data,false);
    let jsonPush = [];
    jsonPush.push(this.createJsonDomain(data));
    this.jsonLd(jsonPush)
  
  }

  social(data: SocialConfig) {
    this.seo(data,false);


    // Preparing Twitter Struncture Data
        this._meta.updateTag({ name: "twitter:card", content: "summary" });
        this._meta.updateTag({ name: "twitter:site", content: data.twiterSite });
        this._meta.updateTag({ name: "twitter:creator", content: data.twitterCreator });
        this._meta.updateTag({ name: "twitter:title", content: data.title});
        this._meta.updateTag({ name: "twitter:description", content: data.description });
        this._meta.updateTag({ name: "twitter:image", content: data.img });

     // Preparing Facebook and Pinterest Struncture Data
        this._meta.updateTag({ property: "og:site_name", content: data.sitename });
        this._meta.updateTag({ property: "og:title", content: data.title });
        this._meta.updateTag({ property: "og:description", content: data.description });
        this._meta.updateTag({ property: "og:image", content: data.img });
        this._meta.updateTag({ property: "og:type", content: data.ogtype});

        data.fbappid?this._meta.updateTag({ name: "fb:app_id", content: data.fbappid }):""

        data.canonical?this._meta.updateTag({ name: "og:url", content: this.site +  data.canonical }):
        this._meta.updateTag({ name: "og:url", content: this.site +  this.router.url });

        data.locale?this._meta.updateTag({ name: "og:locale", content: data.locale }):"";


   //Specific structure data
        if(data.ogtype=="article")
        {
          let dataArticle = data as SocialArticleConfig;
          let articleDate = new Date().toISOString()
          this._meta.updateTag({ property: "article:author", content: dataArticle.author});
          this._meta.updateTag({ property: "article:published_time", content:  articleDate});

          if (data.autoJson==true)
          {
            let jsonPush = [];
            jsonPush.push(this.createJsonArticle(dataArticle));
            this.jsonLd(jsonPush)

          }

        

        }
        else if (data.ogtype=="product")
        {
          let dataProduct = data as SocialProductConfig;
          this._meta.updateTag({ property: "product:price:amount", content: dataProduct.price });
          this._meta.updateTag({ property: "product:price:currency", content: dataProduct.currency });
          this._meta.updateTag({ property: "og:availability", content: dataProduct.availability });

          if (data.autoJson==true)
          {
            let jsonPush = [];
            jsonPush.push(this.createJsonProduct(dataProduct));
            this.jsonLd(jsonPush)

          }

        }
        else if (data.ogtype=="business.business")
        {
          let dataBusiness= data as SocialBusinessConfig;
          this._meta.updateTag({ property:"business:contact_data:street_address", content:dataBusiness.street});
          this._meta.updateTag({ property:"business:contact_data:locality"      , content:dataBusiness.locality});
          this._meta.updateTag({ property:"business:contact_data:postal_code"   , content:dataBusiness.postalcode});
          this._meta.updateTag({ property:"business:contact_data:country_name"  , content:dataBusiness.country});
          dataBusiness.latitude?this._meta.updateTag({ property:"place:location:latitude", content:dataBusiness.latitude}):"";
          dataBusiness.longitude?this._meta.updateTag({ property:"place:location:longitude", content:dataBusiness.longitude}):"";

          if (data.autoJson==true)
          {
            let jsonPush = [];
            jsonPush.push(this.createJsonLocal(dataBusiness));
            this.jsonLd(jsonPush)

          }

        }
  }

  createJsonArticle(dataArticle:SocialArticleConfig):{}
  {

          let artJson = articleJson;
          let articleDate = new Date().toISOString()
          artJson.author.name=dataArticle.author;
          artJson.dateModified = articleDate;
          artJson.datePublished = articleDate;
          artJson.description = dataArticle.description;
          artJson.headline = dataArticle.description;
          artJson.image.push(dataArticle.img);
          //artJson.publisher()
    
         return  artJson
  }

  createJsonProduct(dataProduct:SocialProductConfig):{}
  {

    let prodJson = productJson;
    prodJson.name = dataProduct.title;
    prodJson.image.push(dataProduct.img);
    prodJson.brand.name = dataProduct.brand;
    prodJson.description = dataProduct.description;
    prodJson.mpn = dataProduct.ean;
    prodJson.offers.availability = dataProduct.availability;
    prodJson.offers.itemCondition = dataProduct.itemCondition;
    prodJson.offers.price = dataProduct.price;
    return prodJson

  }

  createJsonLocal(dataBusiness:SocialBusinessConfig):{}
  {
    let localBusinessJson = localBusJson;
    localBusinessJson.name = dataBusiness.title;
    localBusinessJson.image.push(dataBusiness.img);
    localBusinessJson.geo.latitude = dataBusiness.latitude;
    localBusinessJson.geo.longitude = dataBusiness.longitude;
    localBusinessJson.hasMap = dataBusiness.hasMap;
    localBusinessJson.description=  dataBusiness.description;
    dataBusiness.canonical?  localBusinessJson["@id"] =  this.site +  dataBusiness.canonical :localBusinessJson["@id"] =  this.site +  this.router.url
    return localBusinessJson
  }
  
  createJsonWeb(data:SeoConfig):{} {

    let webJson = webPageJson;
    webJson.name = data.title;
    webJson.description = data.description;
    data.canonical?  webJson.url =  this.site +  data.canonical : webJson.url =  this.site +  this.router.url
    return webPageJson

  }

  createJsonDomain(data:SeoConfig):{} {

    let webJson = webSiteJson;
    webJson.name = data.title;
    webJson.description = data.description;
    data.canonical?  webJson.url =  this.site +  data.canonical : webJson.url =  this.site +  this.router.url
    return webJson

  }



  jsonLd(passedArray: any[]) {

    const jsonScript = this._dom.createElement('script') as HTMLScriptElement;
    this._dom.setAttribute(jsonScript, 'type', 'application/ld+json');
    this._dom.setInnerHTML(jsonScript, JSON.stringify(passedArray));
    this._dom.appendChild(this.head, jsonScript);

  }
}
