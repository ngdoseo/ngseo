# Angular 6 Prerender & Server Side Rendering Out of the box

This repository is an extension of @schematics/angular including the universal side rendering tutorial steps in Angular.io and some helper methods to ease the use of Universal Server Side Rendering with Angular

### STATUS

#### devOps
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![CircleCI](https://circleci.com/gh/ampgular/schematics/tree/master.svg?style=svg)](https://circleci.com/gh/ampgular/schematics/tree/master)
[![npm version](https://badge.fury.io/js/%40ampgular%2Fschematics.svg)](https://badge.fury.io/js/%40ampgular%2Fschematics)


#### Main Features (Status 2018-06-09)
![build](https://img.shields.io/badge/build-%202%2F4%20-green.svg)  )   
![spider](https://img.shields.io/badge/spider-%205%2F7%20-green.svg)  
![seo](https://img.shields.io/badge/seo-%204%2F9%20-orange.svg)  
![deploy-static](https://img.shields.io/badge/static-%205%2F8%20-green.svg)  
![express-static](https://img.shields.io/badge/express-%206%2F9%20-green.svg)  
![deploy-dynmaic](https://img.shields.io/badge/deploy-%200%2Fx%20-red.svg)  

As per 09 June 2018 the major commands --build, --spider, --add-seo, --static, --express are already implemented.
Next steps:
    18 June: Next features bunch (seo)
    01 July: Cli interface served with the package 
             Medium Post explaining the features and the project



Net yet production ready !!!!!

## Table of Contents


* [How To Start](#how-to-start)
* [Main Concepts](#main-concepts)
* [Common Use Cases](#comon-use-cases)  
    to be done -- * [Client App with SEO](*client-app-with-seo)  
    to be done --  * [Client App to Prerendered Static Site with SEO ](*client-app-to-prerendered-static-site-with-seo)  
    to be done -- * [SSR App to Static Site with SEO ](*ssr-app-to-static-site-with-seo)  
    to be done --     * [SSR App to Dynamic Server with SEO ](*ssr-app-to-dynamic-server-with-seo)  
    to be done -- * [SSR App Mix Dynamic and Static Site with SEO ](*ssr-app-mix-dynamic-and-static-site-with-seo)  

* [Installation](#installation)
* [Usage](#usage)
* [Building a Server Side Rendered App](#building-a-server-side-rendered-app)
* [Serving in Development a Server Side Rendered App](#serving-in-development-a-server-side-rendered-app)
* [Spider the App Routes](#spider-the-app-routes)
* [SEO-ing your app](#seo-ing-your-app)
* [Deploy your app](#deploy-ing-your-app)
* [License](#license)



## How to Start

* New to Angular  
 If you just came to Angular I would suggest you start right away with the `serve side rendered`, being from begininng aware of the limitations will ensure you achieve a smooth server side render process and will give you the opportunity and follow the guide here.
 `/* to be done */`

* I have already a Client App (classical `ng app`)
 In this case propably the best way to achieve a good and quick result is to focus on prerendering your app to a static site

* I have already a Server Side Rendered App 
 Then you have the big part of the job done, Our package can support you with helper methods...
    - If you want a prerender site, with help our commands the `spider` and `static` you can automatic prepare your site for deployment. 



## Main Concepts

#### Client APP

A Client App is the classical Angular App, which will be bootstrapped and rendered in the browser. When we create with the CLI a `ng new myAwesomeApp` the result is a client app. 
* The user experience by first load is penalyzed because the user don´t see relevant content until app is bootstrapped.
* The Google Bot (responsibile for crawling pages and ) will index the pages and process teh relevant structure data without problems as is able to wait the boostrapp phase. 
* Other search Bots (bing, ask,..etc) won´t be able to index the content as their result when visit the page is a empty `<app-root></app-root>` 
* Social Sharing of content Twitter, Fcebook, etc.. will be disable too.

In Summary, if discovery by search boots, 

#### Server Side Rendered APP

The Server Side Render process happen  in a server environment (not in a browser) and return for each route the representation of the page as a html string. What we call then a Server Side Rendered App is an App which for each requested route have two parts.
1.  A html representation of page server rendered `<app-root> <h1> I am a rendered APP</h1>....</app-root>` 
2.  The client App as described above which after bootstrap will take control and behave like a normal client app.

The process by which the html 'screenshot' will be generated can be done dynamically 'on the fly' by the time the user request the page or prepared in advance for every route. The rendering in advance is also called "prerendering".


#### Static Sites aka Prerendered Sites

A prerendered site has for each _to discover Route_ a `html`document with the clien app (the same for every route) and the above mentioned `html screenshoot` which was p 

#### Server Side Rendered Sites



## Installation

First download and install the schematics package:
`npm i @ampgular/schematics` will install the reuired Files

Seecond generate the files with the angular cli: 
`ng g  @ampgular/schematics:ssr` will install the reuired Files
or 
`schematics @ampgular/schematics:ssr`


## Usage

In the future this package will be shift with a small cli for the ease of use, for now the utilization will be done through some npm run commands predefined and options, a brief summary od the commands

### What can you do then...

1.  You can *build* your app, the server and client bundles [build](#build)
       The options for the build will be picked from angular.json
       and only using one command

       `npm run ssr:client -- --build` or for universal rendering `npm run ssr:server -- --build`

       

2.  You can automatizally route scraping your own app to create a routes file with  
`npm run ssr:client -- --spider` or for universal rendering `npm run ssr:server -- --spider`

3.  You can with the command  with `npm run ssr:client -- --add-seo` or for universal rendering `npm run ssr:server -- --sadd-seo`
 SEO-ing your app whether you have a server side rendered.

4.  You can automatizally make your app a prerender static site file with  
`npm run ssr:client -- --static` or for universal rendering `npm run ssr:server -- --static`

5.  You can automatizally ake your app a prerender static site and spin a express server with  
`npm run ssr:client -- --express` or for universal rendering `npm run ssr:server -- --express`

## Building a Server Side Rendered App

The command  `npm run ssr:platform -- --build` will launch two parallell builds , the normal client side build `ng build` with the same options as 

### Status
✅ Command Structure  
✅ Schematics Files Creation  
🔴 Tests  
🔴 Documentation  



## Spider the App Routes

### Status
✅ Command Structure  
✅ Options Workflow  
✅ Schematics Files Creation  
✅ SSR Spider  
✅ Cliet App Spider  
🔴 Tests  
🔴 Documentation  


The command  `npm run ssr:build` will launch two parallell builds , the normal client side build `ng build` with the same options as 


## SEO-ing your app

### Status
✅ Command Structure  
✅ Options Workflow  
✅ Schematics Files Creation  
🔴 Index.html workflow  
✅ `sitemap.xml` generator  
🔴 Structure Data (JSON-LD) Infrastructure ready  
🔴 Environment Variable Clien Static preparation  
🔴 Tests  
🔴 Documentation  

## Deploy your app to static prerendered Sites
`npm run ssr:platform -- --static`

### Status
✅ Command Structure  
✅ Options Workflow  
🔴 Integrate SEO  
✅ Optimize html/css  
✅ Static Client Generation  
✅ Static SSR Generation  
🔴 Tests  
🔴 Documentation  

## Create a static prerendered Site and spin a express server to test
`npm run ssr:platform -- --express`


### Status
✅ Command Structure  
✅ Options Workflow  
🔴 Integrate SEO  
✅ Optimize html/css  
✅ Static Client Generation  
✅ Static SSR Generation 
✅ Spin Express Server 
🔴 Tests  
🔴 Documentation  

## SEO-ing your app



## Deploy your app to dynamic server side rendering
`npm run ssr:platform -- --deploy`

### Status
🔴 no yet started




## Licence
MIT




