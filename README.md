# Angular 6 Prerender & Server Side Rendering Out of the box

This repository is an extension of @schematics/angular including the universal side rendering tutorial steps in Angular.io and some helper methods to ease the use of Universal Server Side Rendering with Angular

### STATUS

#### devOps
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![CircleCI](https://circleci.com/gh/ampgular/schematics/tree/master.svg?style=svg)](https://circleci.com/gh/ampgular/schematics/tree/master)
[![npm version](https://badge.fury.io/js/%40ampgular%2Fschematics.svg)](https://badge.fury.io/js/%40ampgular%2Fschematics)

#### Main Features
![build](https://img.shields.io/badge/build-%201%2F1%20-brightgreen.svg)  
![serve](https://img.shields.io/badge/serve-%200%2F1%20-red.svg)   
![spider](https://img.shields.io/badge/spider-%203%2F6%20-yellowgreen.svg)  
![seo](https://img.shields.io/badge/seo-%201%2F8%20-red.svg)  
![deploy](https://img.shields.io/badge/deploy-%201%2F4%20-orange.svg)
![deploy-client](https://img.shields.io/badge/deployclient-%200%2F1%20-red.svg)
![deploy-server](https://img.shields.io/badge/deployserver-%200%2F1%20-red.svg)
![deploy-static](https://img.shields.io/badge/deploystatic-%200%2F1%20-red.svg)


Net yet production ready !!!!!

## Table of Contents

* [Main Concepts](#main-concepts)
* [Common Use Cases](#comon-use-cases)
    * [Client App with SEO](*client-app-with-seo)
    * [Client App to Prerendered Static Site with SEO ](*client-app-to-prerendered-static-site-with-seo)
    * [SSR App to Static Site with SEO ](*ssr-app-to-static-site-with-seo)
    * [SSR App to Dynamic Server with SEO ](*ssr-app-to-dynamic-server-with-seo)
    * [SSR App Mix Dynamic and Static Site with SEO ](*ssr-app-mix-dynamic-and-static-site-with-seo)
* [Installation](#installation)
* [Usage](#usage)
* [Building a Server Side Rendered App](#building-a-server-side-rendered-app)
* [Serving in Development a Server Side Rendered App](#serving-in-development-a-server-side-rendered-app)
* [Spider the App Routes](#spider-the-app-routes)
* [SEO-ing your app](#seo-ing-your-app)
* [Deploy your app](#deploy-ing-your-app)
* [License](#license)


## Main Concepts

#### Client APP

A Client App is the classical Angular App, which will be bootstrapped and rendered in the browser. When we create with the CLI a `ng new myAwesomeApp` the result is a client app. 
* The user experience by first load is penalyzed because the user don´t see relevant content until app is bootstrapped.
* The Google Bot (responsibile for crawling pages and ) will index the pages and process teh relevant structure data without problems as is able to wait the boostrapp phase. 
* Other search Bots (bing, ask,..etc) won´t be able to index the content as their result when visit the page is a empty `<app-root></app-root>` 
* Social Sharing of content Twitter, Fcebook, etc.. will be disable too.

In Summary, if discovery by search boots, 

#### Server Side Rendered APP

The Server Side Render process happen  in a server environment (not in a browser) and return for each route the representtion of the page as a html string. What we call then a Server Side Rendered App is an App which for each requested route have two parts.
1.  A html representation of page server rendered `<app-root> <h1> I am a rendered APP</h1>....</app-root>` 
2.  The client App as described above which after bootstrap will take control and behave like a normal client app.






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
       `npm run ssr:build`

2.  You can *serve* your server side app as you would normally ng serve, now here behind the scenes
       we are building on --watch mode, webpacking and serving with the command    `npm run ssr:serve

3.  You can automatizally route scraping your own app to create a routes file with `npm run ssr:spider`

4.  You can with the command  with `npm run ssr:seo` SEO-ing your app whether you have a server side sendered `--server` or a client `--client`

5.  You can make your app deploy ready with one command `npm run ssr:deploy` 

## Building a Server Side Rendered App

The command  `npm run ssr:build` will launch two parallell builds , the normal client side build `ng build` with the same options as 

### Status
✅ Command Structure  
✅ Schematics Files Creation  
🔴 Tests  
🔴 Documentation  

## Serving in Development a Server Side Rendered App

### Status
✅ Command Structure  
✅ Schematics Files Creation  
🔴 Spawn the Processes  
🔴 Tests  
🔴 Documentation  

## Spider the App Routes

### Status
✅ Command Structure  
🔴 Options Workflow  
✅ Schematics Files Creation  
✅ SSR Spider  
🔴 Cliet App Spider  
🔴 Tests  
🔴 Documentation  


## SEO-ing your app

### Status
✅ Command Structure  
🔴 Options Workflow  
🔴 Schematics Files Creation  
🔴 Index.html workflow  
🔴 `sitemap.xml` generator  
🔴 Structure Data (JSON-LD) Infrastructure ready  
🔴 Environment Variable Clien Static preparation  
🔴 Tests  
🔴 Documentation  

## Deploy your app

### Status
✅ Command Structure  
🔴 Options Workflow  
🔴 Integrate SEO  
🔴 Optimize html/css  
🔴 Static Client Generation  
🔴 Static SSR Generation  
🔴 Dynamic SSR  
🔴 Tests  
🔴 Documentation  


## Licence
MIT




