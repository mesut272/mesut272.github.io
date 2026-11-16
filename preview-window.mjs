export function getPreviewWindow(track,mediaDuration){
 const available=Number.isFinite(mediaDuration)&&mediaDuration>0?mediaDuration:30;
 const requested=track?.highlight?.duration;
 const duration=Math.min(available,Number.isFinite(requested)&&requested>0?requested:14);
 const desired=track?.highlight?.start;
 const start=Math.max(0,Math.min(Number.isFinite(desired)?desired:0,available-duration));
 return {start,end:start+duration,duration};
}
