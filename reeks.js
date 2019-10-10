// npm i csv-parse
// lees file reeks.tsv met 2 kolommen, start en eind waarde

const fs = require('fs');
const parse = require('csv-parse');

/**
 * Configure these constants
 */
const inputFile='stata.tsv';
const outputFile = 'output.tsv';
const col_num_start = 2;
const col_num_end = 3;
const sample = 60; // stappen van een minuut

/**
 * Main
 */

let reeks=[];
fs.createReadStream(inputFile)
    .pipe(parse({delimiter: "\t"}))
    .on('data', function(csvrow) {
        reeks.push([parseInt(csvrow[col_num_start]), parseInt(csvrow[col_num_end])]);
    })
    .on('end',function() {
      // findOverlap();
      // printReeksen(reeks);
      findOverlapV2(reeks);
    });


/**
 * Print reeks. Alleen voor kleine datasets
 * @param {ON} reeks 
 */
function printReeksen(reeks){
  console.log('reeksen');
  for (let i=0; i<reeks.length; i++){
    str = '';
    for(let j=0; j<reeks[i][0]-1; j++) {
      str +=" "
    }
    str +='|';
    for(let j=reeks[i][0]; j<reeks[i][1]-1; j++) {
      str +="-"
    }
    str +='|';
    console.log(str);

  }
}
/**
 * Zoek naar concurrent overlap
 * @param {array met 2 kolommen met start en eind tijd} arr 
 */
function findOverlapV2(arr) {
  min = 3153600000999
  max = 0
  var fs = require('fs');
  fs.writeFileSync(outputFile, "timestamp\tnum_concurrent\n"); 

  // console.log('getting range');
  for(let i = 0; i<arr.length; i++) {
    if (arr[i][0] < min) {
      min=arr[i][0];
    }

    if (arr[i][1] > max) {
      max=arr[i][1];
    }
  }

  console.log('Calculation overlap of ' + max + ' records\n');
  let overlap=[];
  for (let i=min; i<=max; i=i+sample) { 
    const percentage = 100*(1-(max-i)/(max-min));
    progressBar(percentage);
    // console.log('\033[Fiteration: '+ percentage.toFixed(2) + '%');
    overlap[i]=0;
    for(let j = 0; j<arr.length; j++) {

      if (hasOverlap(arr[j], [i,i] )) {
        overlap[i]++;
      }
    }
    // use synchronous writing. This is slow but prevents opening too many streams
    fs.appendFileSync(outputFile, `${i}\t${overlap[i]}\n`);
  }

  console.log('Klaar met overlap berekenen');
  console.log('Overlaps written to file: ' + outputFile);
  
  // console.log('Max concurrent: ' + getMax(overlap));
}

function findOverlap() {
  let overlap=[];
  for (let a = 0; a < reeks.length; a++) {
    overlap[a]=0;
    console.log('----')
    for (let b = a+1; b < reeks.length; b++) {
      if(hasOverlap(reeks[a],reeks[b])) {
        overlap[a]++;
      }
    }
  }

  console.log('klaar met overlap berekenen');
  
  // this function is slow for large datasets
  // console.log('Max concurrent: ' + getMax(overlap));
}

function getMax(arr){
  return arr.reduce(function (p, v) {
    return ( p > v ? p : v );
  });
}

function getMin(arr){
  return arr.reduce(function (p, v) {
    return ( p < v ? p : v );
  });
}

function hasOverlap(a,b) {
  if (a[0] > b[1] || b[0]>a[1]) {
    // console.log(`geen overlap: ${a}---${b}`);
    return false;
  } else {
    // console.log(`overlap: ${a}---${b}`);
    return true;
  }
}
/**
 * Console logs progress bar
 * @param {perctage in % of fraction} percentage 
 */
function progressBar(percentage) {
  const barLength = 50;
  const empty = '·'; 
  const full = '▉';

  // percentage <= 1: fraction but if it is larger it is a percentage
  if(percentage>1) {
    percentage = percentage / 100;
  }

  const lengthOfDone = parseInt(percentage * barLength);
  const start = full.repeat(lengthOfDone);
  const end = empty.repeat(barLength - lengthOfDone)
  console.log ('\033[F' +' [' + start + end + '] (' + (100*percentage).toFixed(2) + '%)      ' );
  
}