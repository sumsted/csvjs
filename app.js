import GoCsv from './csvjs.js';

function csvCallback(data){
    console.log('csvCallback');
    console.log(data);
    gc.csvForDownload('yo.csv',data);
};

const gc = new GoCsv();
gc.loadFileOnChange('csv',csvCallback);