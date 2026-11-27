(function(){var v=document.getElementById('bgv');if(!v)return;
var dur=0,target=0,cur=0,ready=false;
function prog(){var m=Math.max(1,document.documentElement.scrollHeight-innerHeight);return Math.min(1,Math.max(0,scrollY/m));}
function init(){dur=v.duration||0;if(!dur)return;ready=true;target=prog()*(dur-.05);cur=target;v.currentTime=cur;}
v.addEventListener('loadedmetadata',init);v.addEventListener('loadeddata',function(){init();var p=v.play();if(p&&p.then)p.then(function(){v.pause();v.currentTime=cur;}).catch(function(){});});
addEventListener('pointerdown',function(){if(!ready)init();var p=v.play();if(p&&p.then)p.then(function(){v.pause();}).catch(function(){});},{once:true});
addEventListener('scroll',function(){if(dur)target=prog()*(dur-.05);},{passive:true});
(function loop(){if(ready){cur+=(target-cur)*.12;if(Math.abs(target-cur)<.002)cur=target;if(!v.seeking&&Math.abs(v.currentTime-cur)>.01)v.currentTime=cur;}requestAnimationFrame(loop);})();
if(v.readyState>=1)init();})();
