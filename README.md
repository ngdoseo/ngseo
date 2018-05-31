# Angular 6 Server Side Rendering Out of the box

This repository is an extension of @schematics/angular including the universal side rendering tutorial steps in Angular.io and some helper methods to ease the use of Universal Server Side Rendering with Angular

### STATUS

#### devOps
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![CircleCI](https://circleci.com/gh/ampgular/schematics/tree/master.svg?style=svg)](https://circleci.com/gh/ampgular/schematics/tree/master)
[![npm version](https://badge.fury.io/js/%40ampgular%2Fschematics.svg)](https://badge.fury.io/js/%40ampgular%2Fschematics)

#### Main Features
![build](https://img.shields.io/badge/build-%201%2F1%20-brightgreen.svg)  
![serve](https://img.shields.io/badge/serve-%200%2F1%20-red.svg)  
![deploy-server](https://img.shields.io/badge/deployserver-%201%2F4%20-red.svg)  
![deploy-static](https://img.shields.io/badge/deploystatic-%201%2F5%20-red.svg)  
![spider](https://img.shields.io/badge/spider-%201%2F4%20-yellowgreen.svg)  
![seo-client](https://img.shields.io/badge/seoclient-%201%2F5%20-red.svg)  
![seo-server](https://img.shields.io/badge/seoserver-%201%2F5%20-red.svg)  

Net yet production ready !!!!!

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Generating a New Project](#generating-and-serving-an-angular-project-via-a-development-server)
* [Generating Components, Directives, Pipes and Services](#generating-components-directives-pipes-and-services)
* [Updating Angular CLI](#updating-angular-cli)
* [Development Hints for working on Angular CLI](#development-hints-for-working-on-angular-cli)
* [Documentation](#documentation)
* [License](#license)


### Get Started
Install
`npm i @ampgular/schematics` will install the reuired Files

Files Generation
`ng g  @ampgular/schematics:ssr` will install the reuired Files
or 
`schematics @ampgular/schematics:ssr`

### What can you do then...

1) You can *build* your app, the server and client bundles [build](#build)
       The options for the build will be picked from angular.json
       and only using one command
       `npm run build`


2) You can *serve* your server side app as you would normally ng serve, now here behind the scenes
       we are building on --watch mode, webpacking and serving


`npm run ssr` will run client and server builds and run a express server with the

`npm run static` will creaate the static site following the predfined routes

`npm run spider` will scrap the app returning the app-routes



`npm run seo` will add the relevant files to improve SEO


sdasdas+

sadasd





 bla bla bla bla
 ## SEO
