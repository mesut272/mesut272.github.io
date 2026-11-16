export function fitToScreen(contentHeight,availableHeight){
 if(!(contentHeight>0)||!(availableHeight>0))return {scale:1,top:0};
 const scale=Math.min(1,availableHeight/contentHeight);
 return {scale,top:Math.max(0,(availableHeight-contentHeight*scale)/2)};
}
