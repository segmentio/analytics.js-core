import {readFileSync} from 'fs'
export function parse(){
    var obj = JSON.parse(readFileSync('test_data/sample.har', 'utf8'));
    console.log(obj.entries)
}

