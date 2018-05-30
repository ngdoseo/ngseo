import {copy,emptyDir} from 'fs-extra';

// emptyDir(      'dist/public').then(x=>
//   copy('dist/browser','dist/public')
// );
// const filterFunc = (src, dest) => {
   
//   console.log(src)
//    return true;
//   }

deployCopy();


  export function deployCopy(){
  copy('dist/<%= projectName %>/index.html','dist/<%= projectName %>-server/index.html' )
   
  
    } 


  



