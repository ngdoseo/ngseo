export const whoIamOrga = {
    "@context": "http://schema.org",
    "@type": "Organization",
    url: "",
    name: "",
    logo:"",
    sameAs:["http://www.facebook.com...","http://instagram.com/...","http://www.twitter.com/...","http://plus.google.com/....."],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "",
      contactType: ""
    }
}

export const whoIamPerson = {
    "@type": "Person",
     name: ""
    }



export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  autoJson:boolean;
}
export interface SocialConfig extends SeoConfig {
  img: string;
  twiterSite: string;
  twitterCreator: string;
  sitename: string;
  ogtype: string;
  locale?: string;
  fbappid?: string;
}

export interface SocialBusinessConfig extends SocialConfig {
  ogtype: "business.business";
  street: string;
  locality: string;
  postalcode: string;
  country: string;
  latitude?: string;
  longitude?: string;
  hasMap?:string;
}

export interface SocialProductConfig extends SocialConfig {
  ogtype: "product";
  price: string;
  currency: string;
  availability: string;
  itemCondition:string;
  brand?:string;
  ean?:string;
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
  publisher: whoIamOrga,
  author:whoIamPerson,
  offers: {
    "@type": "",
    price: "",
    priceCurrency: ""
  }
};

export const webSiteJson = {
  "@context": "http://schema.org",
  "@type": "WebSite",
  name: whoIamOrga.name,
  url: whoIamOrga.url,
  description:"",
  sameAs: whoIamOrga.sameAs,
  potentialAction: {
    "@type": "",
    target: "",
    "query-input": ""
  }
};


export const articleJson = {
  "@context": "http://schema.org",
  "@type": "article",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": ""
  },
  headline: "",
  image: [""],
  datePublished: "",
  dateModified: "",
  author:whoIamPerson,
  publisher: whoIamOrga,
  description: "",
};
export const localBusJson = {
  "@context": "http://schema.org",
  "@type": "LocalBusiness",
  image: [""],
  "@id": "",
  name: "",
  description:"",
  address: {
    "@type": "PostalAddress",
    streetAddress: "",
    addressLocality: "",
    addressRegion: "",
    postalCode: "",
    addressCountry: ""
  },
  logo:whoIamOrga.logo,
  geo: {
    "@type": "GeoCoordinates",
    latitude: "",
    longitude: ""
  },
  hasMap:"",
  telephone: ""
};
export const productJson = {
  "@context": "http://schema.org/",
  "@type": "Product",
  name: "NAME",
  image: [
    "https://example.com/photos/1x1/photo.jpg"],
  description:
    "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
  mpn: "925872",
  brand: {
    "@type": "Thing",
    name: "ACME"
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.4",
    reviewCount: "89"
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "",
    priceValidUntil: "2020-11-05",
    itemCondition: "http://schema.org/UsedCondition",
    availability: "http://schema.org/InStock",
    seller: whoIamOrga
  }
};
export const webPageJson = {
  "@context": "http://schema.org",
  "@type": "WebSite",
  url: "",
  name: "",
  author: whoIamPerson,
  description: "",
  publisher: whoIamOrga
};
