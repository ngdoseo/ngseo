import { Meta, Title } from "@angular/platform-browser";
import { Injectable } from "@angular/core";
import { Location } from "@angular/common";
import { Route, ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { ɵDomAdapter,ɵgetDOM as getDOM } from "@angular/platform-browser";
import { Inject } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
}
export interface SocialConfig extends SeoConfig {
  img: string;
  twiterSite: string;
  twitterCreator: string;
  sitename:string;
  ogtype:string;
  locale?:string;
  fbappid?:string;
}
export interface SocialBusinessConfig extends SocialConfig {
  ogtype: "business.business";
  street: string;
  locality: string;
  postalcode: string;
  country:string;
  latitude?:string;
  longitude?:string;
}

export interface SocialProductConfig extends SocialConfig {
  ogtype: "product";
  price: string;
  currency: string;
  availability: string;
}

export interface SocialArticleConfig extends SocialConfig {
  ogtype: "article";
  author: string;
}
export const arrayJson = [];

export const bookJson = {
  "@context": "http://schema.org",
  "@type": "Book",
  name: "",
  publisher: "",
  offers: {
    "@type": "",
    price: "",
    priceCurrency: ""
  }
};

export const orgaJson = {
  "@context": "http://schema.org",
  "@type": "Organization",
  "url": "",
  "name": "",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "",
    "contactType": ""
  }
};
export const articleJson = {
  "@context": "http://schema.org",
  "@type": "article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": ""
  },
  "headline": "",
  "image": [
    "",
   ],
  "datePublished": "",
  "dateModified": "",
  "author": {
    "@type": "Person",
    "name": ""
  },
   "publisher": {
    "@type": "Organization",
    "name": "",
    "logo": {
      "@type": "ImageObject",
      "url": ""
    }
  },
  "description": ""
}
export const localBusinessJson = {
  "@context":"http://schema.org",
  "@type":"LocalBusiness",
  "image": [
    ""
   ],
  "@id":"",
  "name":"",
  "address":{
    "@type":"PostalAddress",
    "streetAddress":"",
    "addressLocality":"",
    "addressRegion":"",
    "postalCode":"",
    "addressCountry":""
  },
  "geo":{
    "@type":"GeoCoordinates",
    "latitude":"",
    "longitude":""
  },
  "telephone":"",
}
export const productJson = {
  "@context": "http://schema.org/",
  "@type": "Product",
  "name": "Executive Anvil",
  "image": [
    "https://example.com/photos/1x1/photo.jpg",
    "https://example.com/photos/4x3/photo.jpg",
    "https://example.com/photos/16x9/photo.jpg"
   ],
  "description": "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
  "mpn": "925872",
  "brand": {
    "@type": "Thing",
    "name": "ACME"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.4",
    "reviewCount": "89"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "119.99",
    "priceValidUntil": "2020-11-05",
    "itemCondition": "http://schema.org/UsedCondition",
    "availability": "http://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Executive Objects"
    }
  }
}
export const webpage = {
  "@context": "http://schema.org",
  "@type": "WebSite",
  "url": "http://www.example.com/",
  "name": "",
   "author": {
      "@type": "Person",
      "name": ""
    },
  "description": "",
  "publisher": "",
    }

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


  seo(data: SeoConfig) {
    this._title.setTitle(data.title);
    this._meta.updateTag({ name: "description", content: data.description });
    data.keywords?this._meta.updateTag({ name: "keywords", content: data.keywords }):"";

    //Creating canonicalLink
    const canoLink = this._dom.createElement('link') as HTMLLinkElement;
    this._dom.setAttribute(canoLink, 'rel', 'canonical');
    this._dom.setAttribute(canoLink, 'href',  data.canonical? this.site + data.canonical : this.site +  this.router.url);
    this._dom.appendChild(this.head, canoLink);
    // this._dom.setAttribute(linkCano, 'type', 'application/ld+json');
    // this._dom.setInnerHTML(jsonScriptLink, JSON.stringify(metaUpdate.jsonld));
    // this._dom.insertAfter(head, insertIni, jsonScriptLink);

  }

  social(data: SocialConfig) {
    this.seo(data);


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
          this._meta.updateTag({ property: "article:author", content: dataArticle.author});
          this._meta.updateTag({ property: "article:published_time", content: new Date().toISOString() });
        }
        else if (data.ogtype=="product")
        {
          let dataProduct = data as SocialProductConfig;
          this._meta.updateTag({ property: "product:price:amount", content: dataProduct.price });
          this._meta.updateTag({ property: "product:price:currency", content: dataProduct.currency });
          this._meta.updateTag({ property: "og:availability", content: dataProduct.availability });

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

        }
  }

  jsonLd(array: any[]) {}
}
