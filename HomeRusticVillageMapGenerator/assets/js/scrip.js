window.CP && (window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 60000);
var ctx = c.getContext("2d");
var emojiFonts = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Noto Color Emoji", sans-serif'
var treez = null;//see init
var myTrees = [];
var flowers = ["🌹", "🌻", "🌼", "🌷", "🌾"];
var mountains = ["🗻", "⛰️", "🏔️"];//unused.(using modified image instead)
var houses = ["🏠", "🏡", "🏘️"];
var buildings = ["🏛️", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼"];
var mailboxes = ["📫", "📪", "📬", "📭", "📮"];
var desertAnimals = ["🦘", "🐊", "🦎", "🦏", "🐘", "🦛", "🐐", "🐪", "🐫", "🦙", "🐃"];
var greenAnimals = ["🐏", "🐑", "🐂", "🐄", "🦌", "🐎"];
var smallAnimals = ["🐿️", "🐦", "🦔", "🐇", "🦨"];
var ships = ["⛵", "🚢", "🛥️", "🐋", "🐳", "🦈", "🐡", "🐠", "🐟", "🦀", "🦞", "🦐"]
var minSize,
  maxSize,
  numForests,
  mtnPercent,
  mtnRanges,
  mtnGlyph,
  buildingPercent,
  treeRandomness,
  neighborhoodPercent,
  numRivers,
  numIslands,
  numCacti,
  cactiMinDist,
  hueVariation,
  sepiaMax,
  lakeMin,
  lakeMax,
  lakeOffset,
  lakePercent,
  totalLakes,
  greenMode,
  rainbowMode,
  islandMode,
  dinosaurPercent,
  wildFlowerPercent,
  flowersAtPercent,
  blue,
  trimColor,
  HUE,
  myData,
  trees;

var OK = true;

/*INITIALIZE THE VILLAGE*/
//window.onresize = init;
document.querySelector("#c").addEventListener("click", function (ev) {
  init();
});
window.onload = init;

async function init() {
  spinner.classList.add('lds-grid')
  await sleep(0)

  if (!mtnGlyph) {
    mtnGlyph = new Image();
    mtnGlyph.src = 'https://assets.codepen.io/1197275/mtnGlyph.png';
    await mtnGlyph.decode()
  }

  scaleCanvas();
  greenMode = chance()
  rainbowMode = chance()
  islandMode = chance(.6)

  if (rainbowMode) {
    HUE = rand(0, 360)
  }

  treez = ["🌳", "🌲", "🌴"];
  if (chance(.1)) treez.push("🎄")
  myTrees = chance(.2) ? treez : [pick(treez), pick(treez)]

  lakePercent = Math.random();
  lakeMinRadius = rand(islandMode ? 30 : 10, Math.min(c.height,c.width) / 6);
  lakeMaxRadius = lakeMinRadius * randFloat(1.25, 1.75)

  treeRandomness = chance() ? Math.random() * 0.1 : Math.random();
  neighborhoodPercent = Math.random() * 0.33;
  minSize = rand(20, 50);
  maxSize = rand(minSize, minSize + rand(10, 30));
  numForests = rand(5, chance(0.1) ? 10 : 30);
  mtnRanges = Math.random() * 0.1;
  mtnPercent = Math.random() * 0.1;
  numRivers = rand(1, islandMode?6:12);
  numIslands = rand(2,24)
  numCacti = rand(1, 20);
  cactiMinDist = c.width * Math.random() * 0.06;
  hueVariation = rand(0, 120);
  sepiaMax = rand(0, 100);
  dinosaurPercent = randFloat(.000, .005)
  totalLakes = 0;
  wildFlowerPercent = randFloat(0, .2)
  flowersAtPercent = randFloat(0, .25)
  trimColor = randColor()
  trees = [];

  //create RIVERS
  let actualCenters = []
  let otherColorAmount = rainbowMode ? 100 : 50;
  blue = `rgb(${rand(0, otherColorAmount)},${rand(0, otherColorAmount)},${rand(255 - otherColorAmount, 255 + otherColorAmount)}`

  ctx.fillStyle = blue
  ctx.strokeStyle = blue

  if (islandMode) {
    ctx.fillRect(0, 0, c.width, c.height)
    for (let i = 0; i < numIslands; i++) {
      actualCenters.push(new randomPoint())
      totalLakes++
    }
  } 

  //generate rivers
  if(!islandMode) actualCenters = await generateRivers(actualCenters)
    
  //create LAKES or ISLANDS
  if(islandMode){
    ctx.globalCompositeOperation = "destination-out"
  }
  for (let i = 0; i < totalLakes; i++) {
    await sleep(100)
    createLake(actualCenters[i])
  }

  ctx.globalCompositeOperation = "source-over"
  ctx.fillStyle = "blue"
  
  if(islandMode) await generateRivers(actualCenters)
  
  //add some glyphs to the lakes
  if(!islandMode) 
  for (let i = 0; i < totalLakes; i++) {
    if (islandMode || (lakeMinRadius > 100 && chance())) {
      ctx.save()
      ctx.font = `${rand(minSize, maxSize / 2)}px ${emojiFonts}`;
      let flip = chance()
      if (flip) ctx.scale(-1, 1);
      let offsetCenter = new Point(actualCenters[i].x + randFloat(-lakeMinRadius * .9, lakeMinRadius * .9), actualCenters[i].y + randFloat(-lakeMinRadius * .9, lakeMinRadius * .9))
      ctx.fillText(pick(ships), flip ? -offsetCenter.x : offsetCenter.x, offsetCenter.y)      
      ctx.restore();
    }
  }

  myData = ctx.getImageData(0, 0, c.width, c.height).data

  //forest
  generateForestsAndBuildings();

  //cacti, aminals
  if (!greenMode) {
    isolatedGlyphs(["🌵"], numCacti, cactiMinDist, false, minSize, maxSize);
    isolatedGlyphs(desertAnimals, rand(0, 20), cactiMinDist, false, 2 * minSize / 3, 2 * minSize / 3);
  } else {
    isolatedGlyphs(greenAnimals, rand(0, 20), cactiMinDist, false, 2 * minSize / 3, 2 * minSize / 3);
  }

  render()

  if (greenMode) {
    c.classList.add("green")
  } else {
    c.classList.remove("green")
  }
  spinner.classList.remove('lds-grid')
}

/*PRIMARY FUNCTIONS*/
async function generateRivers(startingPoints){
  for (let i = 0; i < numRivers; i++) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = rand(1, 6)
    let pts = getRiverPoints();
    if (!islandMode&&chance(lakePercent)) {
      startingPoints.push(pts[0])
      totalLakes++
    }
    connect(pts, false);
    await sleep(50)
    ctx.closePath();
    ctx.restore();
  }
  return startingPoints
}

function connect(points, closePath = false, strokeColor) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
    let start = points[i];
    let end = points[i + 1];

    let m = new LineMetrics(start, end);
    let x = start.x;
    let y = start.y;

    let xp1 = x + m.run / 4;
    let yp1 = m.m * xp1 + m.b;

    let xp2 = x + (3 / 4) * m.run;
    let yp2 = m.m * xp2 + m.b;

    let curveFactor = rand(0.5, 20);
    let cp1x = xp1 + -m.rise / curveFactor;
    let cp1y = yp1 + m.run / curveFactor;
    let cp2x = xp2 + m.rise / curveFactor;
    let cp2y = yp2 - m.run / curveFactor;
    ctx.bezierCurveTo(cp2x, cp2y, cp1x, cp1y, end.x, end.y);

  }

  /*let lw = ctx.lineWidth
  const SW = 2
  if(strokeColor){//outside stroke
    ctx.lineWidth = lw+SW
    ctx.strokeStyle = strokeColor
    ctx.stroke()
  }*/
  //ctx.strokeStyle = blue;
  //ctx.lineWidth = lw

  ctx.stroke();//inside<--

  if (closePath) {
    ctx.closePath();
    ctx.fill();
  }
}

function generateForestsAndBuildings() {
  for (let i = 0; i < numForests; i++) {
    addTrees();
  }
  function addTrees() {
    let t = [];
    let glyph = pick(myTrees);
    let numTrees = rand(10, 100)
    let isMtnRange = chance(mtnRanges);
    let isNeighborhood = !isMtnRange && numTrees < 50 && chance(neighborhoodPercent)
    let isFlower = !isMtnRange && !isNeighborhood && chance(wildFlowerPercent);
    if (isFlower) glyph = pick(flowers);
    let minRadius = rand(20, 100);
    let radius = rand(minRadius, minRadius + 30);
    for (let i = 0; i < numTrees; i++) {
      let x, y;
      if (chance(treeRandomness) || t.length == 0) {
        let pt = new randomPoint();
        x = pt.x;
        y = pt.y;
      } else {
        let existing = pick(t);
        x = rand(existing.x - radius, existing.x + radius);
        y = rand(existing.y - radius, existing.y + radius);
      }

      let w = rand(minSize, maxSize);
      //w = Math.random()*y*.1
      if (x > 0 && x < c.width && y > 0 && y < c.height) t.push({ x: x, y: y, w: w, glyph: glyph, isMtn: isMtnRange, isHood: isNeighborhood, isFlower: isFlower });
    }
    trees.push(...t);
  }
}

async function render() {
  trees.sort((a, b) => {
    return a.y - b.y;
  }).forEach(async (t) => {
    await sleep(0)
    _render(t)
  });
  async function _render(t) {
    //if(!OK) return false;
    ctx.font = `${t.w}px ${emojiFonts}`;
    ctx.filter = `hue-rotate(${rainbowMode ? HUE : rand(-hueVariation, hueVariation)}deg) sepia(${rand(0, 100)}%)`;

    let doMailbox = false
    let flip = false;
    let metric;

    if (t.isHood) {
      t.glyph = chance(.75) ? pick(houses) : pick(buildings);
      if (t.glyph != "🗼" && chance(.75)) doMailbox = true
      if (t.glyph == "🗼") ctx.font = `${rand(maxSize, maxSize * 4)}px ${emojiFonts}`;
      flip = chance()
    } else if (t.isMtn) {
      //t.glyph = chance(.03) ? "🌋" : pick(mountains);
      flip = chance()
      ctx.font = `${maxSize * rand(2, 5)}px ${emojiFonts}`;
    } else if (t.isFlower) {
      if (chance(.05)) { t.glyph = pick(smallAnimals); ctx.filter = "none"; }
      ctx.font = `${rand(minSize, maxSize) * .3}px ${emojiFonts}`;
      flip = chance()
    } else if (t.isolated) { //cactii and animals
      ctx.font = `${rand(2 * minSize / 3, minSize)}px ${emojiFonts}`;
      flip = chance()
    } else if (chance(dinosaurPercent)) { //"Life, uhhh, finds a way" - Dr. Ian Malcom
      t.glyph = pick(["🦖", "🦕"]);
      flip = chance()
    } else { //just a tree 
      if (chance(.01)) {
        flip = chance();
        t.glyph = "🏕️"
      }
    }
    //ctx.font = `${rand(minSize,maxSize)*(t.y*.005)}px ${emojiFonts}`;
    metric = ctx.measureText(t.glyph)

    if (isFree(t.x, t.y, metric.width, 1, flip)) {

      t.y = t.y - metric.actualBoundingBoxDescent / 2;//adjust ugly mtns up slightly (for text mtns)
      ctx.save()
      if (flip) ctx.scale(-1, 1);
      if (t.isMtn) {//image approach for mountains
        const RATIO = 1.4
        let h = metric.width / RATIO;
        ctx.drawImage(mtnGlyph, flip ? -t.x : t.x, t.y - h * .8, metric.width, h)
      }
      else {
        ctx.fillText(t.glyph, flip ? -t.x : t.x, t.y);
      }
      ctx.restore();

      if (flip) t.x = t.x - metric.width;
      let doFlowers = !t.isolated && t.glyph != "🗼" && !t.isFlower && !t.isMtn && ((t.isHood && chance(.66)) || chance(flowersAtPercent))
      if (doFlowers) flowersAt(t, metric);
      if (doMailbox) mailboxAt(t, metric)

    } else {
      if(islandMode&&chance(.005)){
        flip = chance()
        ctx.save()
        if (flip) ctx.scale(-1, 1);
        t.glyph = pick(ships)
        ctx.font = `${minSize/2}px ${emojiFonts}`;
        ctx.fillText(t.glyph, flip?-t.x-metric.width:t.x, t.y);//<--new strategy, move the x over by the width
        ctx.restore()
      }
    }
  }
}

function isolatedGlyphs(glyphs, num, minDist) {
  let p;
  for (let i = 0; i < num; i++) {
    let limit = 500;
    do {
      if (limit-- < 0) {
        console.log("break")
        break;
      }
      p = new randomPoint();
    } while (trees.some((t) => distance(t, p) < minDist));
    if (limit > 0) {
      p.glyph = pick(glyphs)
      p.isolated = true;
      trees.push(p);
    }
  }
}

/*function fillText(text,x,y,flip=false,metric){
  if (isFree(x, y, metric.width, 1)) {
      ctx.save()
      if(flip)ctx.scale(-1, 1);  
      ctx.fillText(text, flip?-x:x,y);
      ctx.restore();          
  }
}*/

function getRiverPoints() {
  let start = new randomPoint();
  let second;
  do {
    second = new randomPoint();
  } while (distance(start, second) > 100);

  let pts = [start, second];
  let point_index = 2;
  for (let i = 0; i < 200; i++) {
    let limit = 500;
    let maxDistToNextBend = rand(10, 100);
    do {
      if (limit-- < 0) break;
      var next = new randomPoint();
    } while (
      distance(next, pts[point_index - 1]) > maxDistToNextBend ||
      !sameDirection(pts[point_index - 2], pts[point_index - 1], next)
    );
    if (limit > 0) {
      pts.push(next);
      point_index++;
    }
  }
  return pts;
}

function getLakePoints(p, numPoints = 10) {
  let radius;
  let pts = [];

  for (let i = 0; i < numPoints; i++) {
    let rad = ((Math.PI * 2) / numPoints) * i;
    radius = rand(lakeMinRadius, lakeMaxRadius);
    pts.push(
      new Point(p.x + Math.cos(rad) * radius, p.y + Math.sin(rad) * radius)
    );
  }
  return pts;
}

function createLake(start) {
  let lakeOffset = rand(lakeMinRadius, lakeMaxRadius)
  let offset = new Point(
    start.x + rand(-lakeOffset, lakeOffset),
    start.y + rand(-lakeOffset, lakeOffset)
  );
  let offset2 = new Point(
    start.x + rand(-lakeOffset, lakeOffset),
    start.y + rand(-lakeOffset, lakeOffset)
  );

  //let bigLake = [];
  let radii = [rand(5, 20), rand(5, 20), rand(5, 20)]
  let lakePoints = [...getLakePoints(start, radii[0]), ...getLakePoints(offset, radii[1]), ...getLakePoints(offset2, radii[2])];
  connect(lakePoints, true)
}

function isFree(x, y, w, h, checkBackwards = false) {
  var i, j;
  var free = true;
  var r, g, b, a;
  if (checkBackwards) x = x - w;
  for (j = 0; j < h; j++) {
    var idx = Math.floor((x + (y + j) * c.width) * 4);
    if (idx < 0) {
      console.log("here")
    }
    for (i = 0; i < w; i++) {
      r = myData[idx++];
      g = myData[idx++];
      b = myData[idx++];
      a = myData[idx++];
      if (a != 0) {
        free = false;
        //console.log("not free")
      }
    }
  }
  return free;
}

/* OLD
function isFree(x, y, w, h){
  if(y<=0) return false;
  let data = ctx.getImageData(x,y,w,h).data
  return data.every(pix=>pix==0)
 }
*/

function mailboxAt(p, tm) {
  let m = new Point(p.x + randFloat(0, tm.width), p.y + tm.fontBoundingBoxDescent + rand(0, 5))
  if (isFree(m.x, m.y, tm.width, 1)) {
    ctx.font = `${tm.width * .2}px ${emojiFonts}`;
    ctx.fillText(pick(mailboxes), m.x, m.y)
  }
}

function flowersAt(p, tm) {
  for (let i = 0; i < rand(1, 10); i++) {
    let f = new Point(p.x + randFloat(0, tm.width), p.y + tm.fontBoundingBoxDescent + rand(0, 5))
    if (isFree(f.x, f.y, tm.width, 1)) {
      ctx.font = `${tm.width * randFloat(.15, .25)}px ${emojiFonts}`;
      let fl = chance(.05) ? pick(smallAnimals) : pick(flowers);
      //ctx.font = `${ctx.font.replace(/\D/g,'')*(t.y*.001)}px ${emojiFonts}`;
      ctx.fillText(fl, f.x, f.y)
    }
  }
}

/*UTILITY FUNCTIONS*/
function rand(min, max) {
  return Math.floor(randFloat(min, max));
}

function randFloat(min, max) {
  return (Math.random() * (max - min)) + min;
}

function randColor() {
  return `rgb(${rand(0, 255)},${rand(0, 255)},${rand(0, 255)}`
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function chance(limit = 0.5) {
  return Math.random() < limit;
}

function scaleCanvas() {
  let rect = document.querySelector("#c").getBoundingClientRect();
  c.width = rect.width;
  c.height = rect.height;
  ctx.clearRect(0, 0, c.width, c.height)

}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function randomPoint() {
  let p = new Point( Math.floor(c.width * Math.random()),Math.floor(c.height * Math.random()));
  return p;
}

function mark(x, y, color = "red") {
  ctx.save();
  ctx.moveTo(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 360);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function LineMetrics(start, end) {
  this.run = end.x - start.x;
  this.rise = end.y - start.y;
  this.m = this.rise / this.run;
  this.b = start.y - this.m * start.x;
  this.len = Math.sqrt(Math.pow(this.run, 2) + Math.pow(this.rise, 2));
}

function sameDirection(p1, p2, p3) {
  let down = p1.y - p2.y > 0;
  let right = p1.x - p2.x < 0;
  let vertGood, horGood;
  vertGood = down ? p2.y - p3.y > 0 : p2.y - p3.y < 0;
  horGood = right ? p2.x - p3.x < 0 : p2.x - p3.x > 0;
  return vertGood && horGood;
}

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function label(p, size, text, color = "white") {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.fillStyle = color;
  ctx.font = `${size}px sans-serif`;
  ctx.fillText(text, p.x, p.y);
  ctx.closePath();
  ctx.restore();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
