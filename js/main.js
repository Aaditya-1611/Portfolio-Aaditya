(function(){
  var cv=document.getElementById('gl');
  if(!window.THREE){return;}
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
  R.setPixelRatio(Math.min(devicePixelRatio,2));
  var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(55,1,.1,200);C.position.set(0,0,9);
  var core=new THREE.Group();S.add(core);
  var ico=new THREE.Mesh(new THREE.IcosahedronGeometry(2,1),new THREE.MeshBasicMaterial({color:0x19d3f0,wireframe:true,transparent:true,opacity:.55}));
  var inner=new THREE.Mesh(new THREE.OctahedronGeometry(1.1,0),new THREE.MeshBasicMaterial({color:0xb86bff,wireframe:true}));
  var glow=new THREE.Mesh(new THREE.SphereGeometry(.55,24,24),new THREE.MeshBasicMaterial({color:0x19d3f0}));
  core.add(ico,inner,glow);
  var ring=new THREE.Mesh(new THREE.TorusGeometry(3.2,.012,8,120),new THREE.MeshBasicMaterial({color:0x19d3f0,transparent:true,opacity:.5}));
  ring.rotation.x=1.3;core.add(ring);
  var ring2=ring.clone();ring2.rotation.set(.4,.6,0);ring2.scale.setScalar(1.35);core.add(ring2);
  /* orbiting skill labels */
  var skills=['Python','PyTorch','LLMs','Generative AI','Agentic AI','Transformers','CodeT5','LangChain','Hugging Face','Prompt Engineering','RAG','OpenAI API','Pandas','NumPy','Flask','Deep Learning'];
  var labels=[];
  skills.forEach(function(t,i){
    var c=document.createElement('canvas');c.width=512;c.height=128;var g=c.getContext('2d');
    g.font='500 54px "Space Grotesk",sans-serif';g.textAlign='center';g.textBaseline='middle';
    g.shadowColor='#19d3f0';g.shadowBlur=18;g.fillStyle=i%3==0?'#d9b3ff':'#bff6ff';g.fillText(t,256,64);
    var tex=new THREE.CanvasTexture(c);
    var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
    sp.scale.set(2.6,.65,1);
    var ph=Math.acos(1-2*(i+.5)/skills.length),th=Math.PI*(1+Math.sqrt(5))*i;
    sp.userData={r:4.4+(i%3)*.5,ph:ph,th:th,sp:.12+(i%4)*.03};
    core.add(sp);labels.push(sp);
  });
  /* particles */
  var N=innerWidth<760?350:900,pos=new Float32Array(N*3);
  for(var i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*60;pos[i*3+1]=(Math.random()-.5)*60;pos[i*3+2]=(Math.random()-.5)*60-10;}
  var pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  var pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x6fe3f5,size:.06,transparent:true,opacity:.7}));S.add(pts);
  /* state */
  var mx=0,my=0,sy=0,t=0,warp=0,lastSy=0,down=false,shock=0,bi=0;
  var cur=document.getElementById('cur');
  var rainbow=false,ac=null,sOn=false;
  /* sound */
  function tone(f,d,type,v,slide){if(!sOn||!ac)return;var n=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,n);if(slide)o.frequency.exponentialRampToValueAtTime(slide,n+d);g.gain.setValueAtTime(v||.08,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(n+d);}
  function blip(){tone(520,.25,'sawtooth',.06,90);tone(900,.15,'sine',.05,200);}
  var snd=document.getElementById('snd');
  snd.addEventListener('click',function(e){e.stopPropagation();if(!ac){var A=window.AudioContext||window.webkitAudioContext;if(!A)return;ac=new A();}sOn=!sOn;if(ac.state==='suspended')ac.resume();snd.textContent='Sound: '+(sOn?'on':'off');snd.setAttribute('aria-pressed',sOn);tone(660,.12,'sine',.08);});
  snd.addEventListener('pointerdown',function(e){e.stopPropagation();});
  document.querySelectorAll('a,.card').forEach(function(el){el.addEventListener('mouseenter',function(){tone(1400,.04,'square',.02)});});
  /* secret mode: Konami code or tap the name 5 times */
  function secret(){if(rainbow)return;rainbow=true;for(var k=0;k<5;k++)setTimeout(function(){burst(Math.random(),Math.random())},k*150);[523,659,784,1046].forEach(function(f,i){setTimeout(function(){tone(f,.2,'square',.05)},i*110)});var tt=document.createElement('div');tt.className='toast';tt.textContent='Secret mode unlocked: rainbow core';document.body.appendChild(tt);setTimeout(function(){tt.remove()},3500);}
  var kc=[38,38,40,40,37,39,37,39,66,65],ki=0;
  addEventListener('keydown',function(e){ki=(e.keyCode===kc[ki])?ki+1:(e.keyCode===kc[0]?1:0);if(ki===kc.length){ki=0;secret();}});
  var taps=0,tapT;document.querySelector('h1').addEventListener('click',function(){taps++;clearTimeout(tapT);tapT=setTimeout(function(){taps=0},1200);if(taps>=5){taps=0;secret();}});
  /* demos, ask-me bot, terminal, contact */
  function $(i){return document.getElementById(i);}
  ['term','tbtn','demos','ask'].forEach(function(i){$(i).addEventListener('pointerdown',function(ev){ev.stopPropagation();});});
  function wait(ms){return new Promise(function(r){setTimeout(r,ms)});}
  function line(box,txt,cls){var d=document.createElement('div');d.textContent=txt;if(cls)d.className=cls;box.appendChild(d);box.scrollTop=box.scrollHeight;}
  var buggy='def average(nums):\n    return sum(nums) / (len(nums) + 1)   # bug',fixed='def average(nums):\n    return sum(nums) / len(nums)   # fixed',afBusy=false;
  $('afcode').textContent=buggy;
  $('afrun').addEventListener('click',async function(){
    if(afBusy)return;afBusy=true;var L=$('aflog'),code=$('afcode');L.textContent='';code.textContent=buggy;
    code.classList.add('hit');line(L,'1. Detect: bug found on line 2');await wait(900);
    line(L,'2. Generate: 3 candidate patches');await wait(700);
    var cands=[['sum(nums) / (len(nums) - 1)',false],['sum(nums)',false],['sum(nums) / len(nums)',true]];
    for(var i=0;i<cands.length;i++){line(L,'   patch '+(i+1)+': '+cands[i][0]+'  ->  tests '+(cands[i][1]?'PASS':'FAIL'),cands[i][1]?'ok':'bad');await wait(750);}
    line(L,'3. Select: patch 3 (all tests pass)');await wait(700);
    line(L,'4. Apply patch and re-test: PASS','ok');await wait(700);
    code.classList.remove('hit');code.textContent=fixed;line(L,'5. Output: validated fix','ok');afBusy=false;});
  var tri={'Fever and cough':['General physician','Today 4:30 PM or tomorrow 10:00 AM'],'Skin rash':['Dermatology','Tomorrow 11:30 AM or Sat 9:00 AM'],'Knee pain':['Orthopedics','Tomorrow 3:00 PM or Sat 12:00 PM'],'Severe headache':['Neurology','Sat 10:30 AM or Mon 2:00 PM'],'Chest pain':null};
  Object.keys(tri).forEach(function(k){var b=document.createElement('button');b.type='button';b.className='chipb';b.textContent=k;b.addEventListener('click',function(){var o=$('lout');o.textContent='';var r=tri[k];
    if(!r){line(o,'Emergency symptom detected: '+k,'bad');line(o,'Booking skipped. Case escalated to admin.','bad');}
    else{line(o,'Symptom: '+k);line(o,'Matched specialty: '+r[0],'ok');line(o,'Conflict-free slots: '+r[1]);line(o,'AI-drafted notes will wait for doctor approval.');}});$('ltags').appendChild(b);});
  var KB=[[/summary|who|about|yourself/,'Aaditya is a B.Tech Computer Science graduate with 24 months of hands-on experience in Generative AI, LLM applications and data science. He is looking for an entry-level AI Engineer role.'],
   [/project|built|autofixer|latrova/,'AutoFixer: an AI agent that detects bugs, generates candidate patches and picks the best fix with a test-driven loop (CodeT5, final year project). Latrova: an AI-assisted doctor appointment prototype with 3 role-based portals and emergency-symptom escalation.'],
   [/skill|tech|stack|language|tool/,'Python, Java, C, C++, JavaScript, SQL (basic), HTML, CSS. AI/ML: Generative AI, LLMs, prompt engineering, agentic AI, deep learning, Transformers. Libraries: PyTorch, Flask, LangChain, Hugging Face, OpenAI API, Pandas, NumPy, Matplotlib.'],
   [/experience|intern|work|job|role/,'Freelance AI/Tech at LOL Arena (Oct 2025 – Feb 2026), Generative AI at RevaTech (Jun – Aug 2025) and Data Science Trainee at Teachnook (Jul – Aug 2024).'],
   [/educat|study|college|degree|universit|school/,'B.Tech in Computer Science Engineering (AI Specialisation), Chhatrapati Shivaji Maharaj University, Navi Mumbai, 2023 – 2026.'],
   [/certif|course|certs/,'11 certifications, including Data Science (Teachnook, IIT Roorkee), Generative AI (RevaTech), Agentic AI (Sage University) and Advanced Excel (Cybrom Technology).'],
   [/contact|email|phone|reach|hire|mail|github|linkedin/,'Email aadityapasi1611@gmail.com, phone 8484903641, LinkedIn: aaditya-pasi-bb7a48317, GitHub: Aaditya-1611. Based in Navi Mumbai.']];
  function answer(q){q=q.toLowerCase();for(var i=0;i<KB.length;i++){if(KB[i][0].test(q))return KB[i][1];}return null;}
  var msgs=$('msgs');line(msgs,'Hi! Ask me about Aaditya’s projects, skills, experience, education, certifications or contact details.');
  function ask(q){q=q.trim();if(!q)return;line(msgs,'You: '+q);line(msgs,answer(q)||'I can answer questions about projects, skills, experience, education, certifications or contact details.','ok');}
  ['Projects','Skills','Experience','Education','Contact'].forEach(function(s){var b=document.createElement('button');b.type='button';b.className='chipb';b.textContent=s;b.addEventListener('click',function(){ask(s)});$('sug').appendChild(b);});
  $('go').addEventListener('click',function(){ask($('q').value);$('q').value='';});
  $('q').addEventListener('keydown',function(e){if(e.key==='Enter'){ask($('q').value);$('q').value='';}});
  var term=$('term'),tout=$('tout'),tin=$('tin');
  function tog(){term.hidden=!term.hidden;if(!term.hidden){tin.focus();if(!tout.childNodes.length)line(tout,'Type help to see commands.');}}
  $('tbtn').addEventListener('click',tog);
  addEventListener('keydown',function(e){if(e.key==='`'&&e.target.tagName!=='INPUT'){e.preventDefault();tog();}});
  tin.addEventListener('keydown',function(e){if(e.key!=='Enter')return;var c=tin.value.trim().toLowerCase();tin.value='';if(!c)return;line(tout,'$ '+c);
    if(c==='help'){line(tout,'about  skills  projects  experience  education  certs  contact  clear');return;}
    if(c==='clear'){tout.textContent='';return;}
    if(c==='sudo hire aaditya'){line(tout,'Permission granted. Email aadityapasi1611@gmail.com to continue.','ok');return;}
    var a=answer(c);line(tout,a||'command not found: '+c+'. Type help.',a?null:'bad');});
  $('cs').addEventListener('click',function(){var n=$('cn').value.trim(),m=$('cm').value.trim();window.open('mailto:aadityapasi1611@gmail.com?subject='+encodeURIComponent('Portfolio message from '+(n||'a visitor'))+'&body='+encodeURIComponent(m),'_top');});
  /* draggable 3D CV card */
  var cvc=document.getElementById('cvc'),cry=20,crx=-8,cvel=reduce?0:.4,cdrag=false,clx=0,cly=0;
  cvc.parentNode.addEventListener('pointerdown',function(e){cdrag=true;clx=e.clientX;cly=e.clientY;});
  addEventListener('pointermove',function(e){if(!cdrag)return;cry+=(e.clientX-clx)*.6;crx-=(e.clientY-cly)*.3;crx=Math.max(-40,Math.min(40,crx));clx=e.clientX;cly=e.clientY;});
  addEventListener('pointerup',function(){cdrag=false;});
  (function spin(){if(!cdrag)cry+=cvel;cvc.style.transform='rotateX('+crx+'deg) rotateY('+cry+'deg)';requestAnimationFrame(spin);})();
  var B=300,bp=new Float32Array(B*3),bv=new Float32Array(B*3),bl=new Float32Array(B);
  var bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(bp,3));
  var bm=new THREE.Points(bg,new THREE.PointsMaterial({color:0xffffff,size:.14,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));bm.frustumCulled=false;S.add(bm);
  function burst(nx,ny){
    var v=new THREE.Vector3(nx*2-1,-(ny*2-1),.5).unproject(C);var d=v.sub(C.position).normalize();var p=C.position.clone().add(d.multiplyScalar(8));
    for(var k=0;k<60;k++){var i=bi++%B;bp[i*3]=p.x;bp[i*3+1]=p.y;bp[i*3+2]=p.z;
      var a=Math.random()*6.283,b=Math.random()*3.1416,sp=.05+Math.random()*.14;
      bv[i*3]=Math.cos(a)*Math.sin(b)*sp;bv[i*3+1]=Math.cos(b)*sp;bv[i*3+2]=Math.sin(a)*Math.sin(b)*sp;bl[i]=1;}
    shock=1;blip();
  }
  addEventListener('pointerdown',function(e){down=true;burst(e.clientX/innerWidth,e.clientY/innerHeight);});
  addEventListener('pointerup',function(){down=false;});
  addEventListener('mousemove',function(e){cur.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)';});
  document.querySelectorAll('a,.card').forEach(function(el){el.addEventListener('mouseenter',function(){cur.classList.add('h')});el.addEventListener('mouseleave',function(){cur.classList.remove('h')});});
  /* scramble text */
  var chars='01<>/{}[]#$%&*';
  function scr(el){if(reduce)return;var f=el.getAttribute('data-t')||el.textContent;el.setAttribute('data-t',f);var n=0;var iv=setInterval(function(){n++;el.textContent=f.split('').map(function(c,i){return c===' '||i<n/2?c:chars[Math.random()*chars.length|0]}).join('');if(n>=f.length*2){el.textContent=f;clearInterval(iv)}},30);}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!e.target.dn){e.target.dn=1;scr(e.target)}})},{threshold:.6});
  document.querySelectorAll('h2,.role').forEach(function(el){io.observe(el)});
  var h1=document.querySelector('h1');h1.addEventListener('mouseenter',function(){h1.classList.remove('gl');void h1.offsetWidth;h1.classList.add('gl')});
  /* boot loader */
  var bar=document.querySelector('#bar i'),boot=document.getElementById('boot'),pc=0;
  var bt2=setInterval(function(){pc+=8+Math.random()*14;bar.style.width=Math.min(pc,100)+'%';if(pc>=100){clearInterval(bt2);boot.classList.add('off');setTimeout(function(){boot.remove()},900);h1.classList.add('gl');}},120);
  addEventListener('mousemove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});
  addEventListener('scroll',function(){sy=scrollY/Math.max(1,document.body.scrollHeight-innerHeight);document.getElementById('hint').style.opacity=scrollY>60?0:1;},{passive:true});
  function size(){var w=innerWidth,h=innerHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix();}
  addEventListener('resize',size);size();
  /* tilt cards */
  document.querySelectorAll('.card').forEach(function(el){
    el.addEventListener('mousemove',function(e){var b=el.getBoundingClientRect();var x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;el.style.transform='rotateY('+(x*14)+'deg) rotateX('+(-y*14)+'deg) translateZ(10px)';});
    el.addEventListener('mouseleave',function(){el.style.transform='';});
  });
  var cx=0,cr=0,cz=0;
  function frame(){
    if(!reduce)t+=.01;
    var side=innerWidth>760?Math.cos(sy*Math.PI*5)*3.2:0;   /* swing left/right per section */
    cx+=(side-cx)*.05;cr+=((sy*Math.PI*2)-cr)*.05;
    core.position.x=cx;core.position.y=Math.sin(t)*.15;
    core.rotation.y=cr+t*.3+mx*.8;core.rotation.x=my*.5+Math.sin(sy*6)*.2;
    inner.rotation.x=t*1.2;inner.rotation.y=t*.9;
    ico.rotation.y=-t*.2;ring.rotation.z=t*.5;ring2.rotation.z=-t*.35;
    glow.scale.setScalar(1+Math.sin(t*3)*.12);
    labels.forEach(function(s){var d=s.userData;var a=d.th+t*d.sp*6;
      s.position.set(d.r*Math.sin(d.ph)*Math.cos(a),d.r*Math.cos(d.ph),d.r*Math.sin(d.ph)*Math.sin(a));
      s.material.opacity=.35+.65*((s.position.z/d.r+1)/2);});
    var dsy=Math.abs(sy-lastSy);lastSy=sy;
    var wt=down?1:Math.min(1,dsy*80);warp+=(wt-warp)*.08;
    C.fov=55+warp*35;C.updateProjectionMatrix();
    var pa=pg.attributes.position.array;
    for(var i=0;i<N;i++){pa[i*3+2]+=(reduce?0:.05)+warp*1.4;if(pa[i*3+2]>10){pa[i*3+2]=-50;}}
    pg.attributes.position.needsUpdate=true;
    pts.material.size=.06+warp*.1;
    pts.rotation.y=t*.02+sy*1.2;
    var ba=bg.attributes.position.array;
    for(var i=0;i<B;i++){if(bl[i]>0){bl[i]-=.012;ba[i*3]+=bv[i*3];ba[i*3+1]+=bv[i*3+1];ba[i*3+2]+=bv[i*3+2];}else{ba[i*3]=ba[i*3+1]=ba[i*3+2]=9999;}}
    bg.attributes.position.needsUpdate=true;
    shock*=.92;core.scale.setScalar(1+shock*.35);ico.material.color.setHSL(((rainbow?t*.25:.52)+shock*.3+warp*.1)%1,1,.55);
    C.position.z=9-sy*1.5;
    C.position.x=mx*.8;C.position.y=-my*.5;C.lookAt(0,0,0);
    R.render(S,C);requestAnimationFrame(frame);
  }
  frame();
})();
