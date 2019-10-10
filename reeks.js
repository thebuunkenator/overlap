// npm i csv-parse
// lees file reeks.tsv met 2 kolommen, start en eind waarde

var fs = require('fs');
var parse = require('csv-parse');

var inputFile='reeks.tsv';

var reeks=[];
fs.createReadStream(inputFile)
    .pipe(parse({delimiter: ","}))
    .on('data', function(csvrow) {
        reeks.push([parseInt(csvrow[0]), parseInt(csvrow[1])]);
    })
    .on('end',function() {
      // findOverlap();
      printReeksen(reeks);
      findOverlapV2(reeks);
    });

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

function findOverlapV2(arr) {
  min = 3153600000999
  max = 0

  for(let i = 0; i<arr.length; i++) {
    if (arr[i][0] < min) {
      min=arr[i][0];
    }

    if (arr[i][1] > max) {
      max=arr[i][1];
    }

  }
  let overlap=[];
  for (let i=min; i<=max; i++) {
    overlap[i]=0;
    for(let j = 0; j<arr.length; j++) {
      if (hasOverlap(arr[j], [i,i] )) {
        overlap[i]++;
      }
    }
  }
  console.log('klaar met overlap berekenen');
  // console.log(overlap);
  console.log('Max concurrent: ' + getMax(overlap));
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
  console.log(overlap);

  console.log('Max concurrent: ' + getMax(overlap));
}
// const reeks = [[1,2],[3,5],[7,13],[5,10],[23,50],[2,55],[4,23],[6,12]];

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
