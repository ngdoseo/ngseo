import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';


const collectionPath = path.join(__dirname, '../collection.json');


describe('ssr', () => {
 
  it('works', () => {
    console.log(collectionPath);
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('ssr', {}, Tree.empty());

    expect(tree.files).toEqual([]);
  });
});
