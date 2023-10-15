// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;
var username=args.widgetParameter;
var gameTypes={
  Bullet:false,
  Blitz:true,
  Rapid:true,
  Classical:true,
  Correspondence:true,
  Puzzles:true
}

if(!username){
  username="your lichess username here";
}

let icons={
  "Puzzles":"🧩",
  "Blitz":"🔥",
  "Correspondence":"✉",
  "Rapid":"🐇",
  "Classical":"🐢",
  "Bullet":"🔫"
}


var url="https://lichess.org/api/user/"+username+"/rating-history"

let detailColor = Color.white();
let detailFontSize = 16
let headerFontSize = 16
let footerFontSize = 12

let startColor = new Color("0C0E22")
let endColor=new Color("2B374E")
let gradient = new LinearGradient()
gradient.colors = [startColor,endColor]// 
gradient.locations = [0,0.5,1]

let widget = new ListWidget();// 
widget.url="https://www.lichess.org" //if needed, add this for statistics page /@/"+username
widget.backgroundGradient=gradient


let data=new Array()
var request = new Request(url)
var json=await request.loadJSON()
json.forEach((element)=>{
  if(gameTypes[element.name] && element.points.length>0)
  {  
    var points=element.points.map((entry)=>{
      var history=convertArrayToDate(entry)
     return history
    })
    data.push({
      name:element.name,points:points[points.length-1][1], 
      change:getChange(points)
    })    
  }
})   

let stack=widget.addStack();
generateMediumWidget(stack);

Script.setWidget(widget);
widget.presentMedium();
Script.complete();

function generateMediumWidget(parentStack){
  parentStack.layoutVertically()

  let headerStack=parentStack.addStack()
  addHeaderStack(headerStack, username)
  
  let statStack=parentStack.addStack()
  addStatStack(statStack,data)
  
  let footerStack=parentStack.addStack()
  footerStack.layoutHorizontally()
  addFooterStack(footerStack)
}

function addHeaderStack(headerStack, username){
  headerStack.addSpacer()
  var text=headerStack.addText("lichess statistics for "+username)
  text.textColor=detailColor;
  text.font=Font.boldSystemFont(headerFontSize)
  headerStack.addSpacer()
  headerStack.setPadding(0,0,10,0)
}

function addFooterStack(footerStack){
  footerStack.addSpacer()
  let date=new Date()
  var minutes=date.getMinutes()
  if(minutes<10){
    minutes = "0"+minutes;
  }
  let time= date.getHours()+":"+minutes
  var text=footerStack.addText("Last updated: "+time )
  text.textColor=detailColor;
  text.font=Font.boldSystemFont(footerFontSize)
  footerStack.setPadding(10,0,0,0)
}

function addStatStack(mainStack,data){
  mainStack.addSpacer()
  data.forEach(element=>{
  if(icons[element.name]){
    let stack=mainStack.addStack()
    stack.layoutVertically()
    var text=stack.addText(" "+icons[element.name])
    text.textColor=detailColor;
    stack.addSpacer(15)
    text=stack.addText(element.points+"")
    text.textColor=detailColor
    text.font=Font.boldSystemFont(detailFontSize)
    var changeText=element.change;
    if(changeText=="0"){
      changeText="-";
    }else if(changeText>0)
    {
      changeText="⬈"+changeText;
    }else if(changeText<0){
      changeText="⬊"+changeText;
    }
    text=stack.addText(changeText)
    text.textColor=detailColor
    if(element.change>0){
      text.textColor=Color.green();
    }else if(element.change<0){
      text.textColor=Color.red();
    }
    mainStack.addSpacer()
  }
});

}

function getChange(arr){
  if(arr.length<2){
    return "-"
  }
  return arr[arr.length-1][1]-arr[arr.length-2][1]
}

//lichess liefert datum in stringkomponenten, diese funktion wandelt das in dates um
function convertArrayToDate(entry){
  var arr=new Array()
      var date = new Date()
      date.setFullYear(entry[0])
      date.setMonth(entry[1])
      date.setDate(entry[2])
      arr.push(date)
      arr.push(entry[3])
      return arr;
}
