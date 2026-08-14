const $ = (id) => document.getElementById(id);

const illustrationAssets = [
  { value:"auto", label:"依內容自動配圖" },
  { value:"guide", label:"共學引導老師" },
  { value:"clap-siblings", label:"手足拍手唱歌" },
  { value:"family-parachute", label:"親子彩虹傘遊戲" },
  { value:"talking-pen", label:"點讀筆與圖卡" },
  { value:"tablet-story", label:"平板看英文故事" },
  { value:"parent-reading", label:"親子共讀" },
  { value:"video-call", label:"家庭視訊互動" },
  { value:"dancing-child", label:"孩子唱跳" },
  { value:"teddy-books", label:"熊熊與書本" },
  { value:"picture-book", label:"繪本與自然" },
  { value:"growing-plant", label:"成長小芽" },
  { value:"decorations", label:"愛心星星裝飾" },
  { value:"none", label:"不放插圖" }
];

const heroChoices = [
  { value:"default", label:"預設家庭共學情境" },
  { value:"none", label:"不顯示主圖（自動收合）" },
  { value:"custom", label:"自行上傳照片" },
  ...illustrationAssets.filter(item=>!["auto","none"].includes(item.value))
];

const defaultHeroMarkup = `
  <div class="family-scene">
    <div class="scene-people">👩‍👧‍👦</div>
    <div class="scene-book">📘</div>
    <div class="scene-notes">♪ ♫ ✦</div>
    <p>一起聽・一起玩・一起把英文留在生活裡</p>
  </div>
`;

let customHeroDataUrl = "";

const defaultSections = [
  { icon:"📚", asset:"picture-book", title:"越來越熟悉，節奏更自在", text:"使用進入第二個月，孩子對教材越來越熟悉，連帶整個帶領的節奏也更自在。以前還會擔心有沒有照著流程走，現在反而能放鬆跟著感覺帶，和孩子一起享受學習的過程。" },
  { icon:"🎵", asset:"clap-siblings", title:"聽熟之後，自然開始跟唱", text:"最近最大的收穫，是孩子已經把歌曲聽得非常熟。熟悉感建立後，開口不再像是一項任務，而是生活裡自然發生的回應。" },
  { icon:"🌱", asset:"growing-plant", title:"相信自然吸收，給孩子時間", text:"孩子有時咬字還不清楚，但我開始提醒自己不用急著糾正。先讓孩子大量接觸、自然吸收，保留她願意開口的信心。" },
  { icon:"☎️", asset:"video-call", title:"把英文放進生活互動", text:"電話美語、洗澡唱歌、走路時玩口令，都變成孩子很期待的活動。語言不只出現在教材裡，也可以存在每天自然發生的小事中。" },
  { icon:"✨", asset:"talking-pen", title:"這個月的小亮點", text:"孩子開始主動拿卡片、跟著錄音，也會把熟悉的英文句子放進遊戲。這些小小的變化，讓我看到反覆輸入正在慢慢累積。" },
  { icon:"❤️", asset:"parent-reading", title:"身為家長，最大的改變", text:"一路使用下來，最大的改變不只是孩子學了多少，而是身為家長的我越來越放鬆，也越來越相信孩子會照著自己的節奏成長。" }
];

let sections = structuredClone(defaultSections);

function escapeHtml(s=""){
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

function safeImageUrl(url=""){
  const value = String(url).trim();
  return /^(https?:\/\/|data:image\/(png|jpe?g|webp|gif);base64,)/i.test(value) ? value : "";
}

function illustrationFor(text=""){
  const t = text.toLowerCase();
  if(/電話|call|phone/.test(t)) return "☎️";
  if(/洗澡|水|bath|cup/.test(t)) return "🛁";
  if(/睡前|故事|book|read|繪本/.test(t)) return "📚";
  if(/唱|歌|music|song|聽/.test(t)) return "🎵";
  if(/卡|flash|點讀/.test(t)) return "🪄";
  if(/跳|舞|dance|動作/.test(t)) return "💃";
  if(/姊|哥哥|妹妹|弟弟|手足/.test(t)) return "👧🏻👦🏻";
  if(/戶外|走路|公園|outside/.test(t)) return "🌳";
  if(/玩|遊戲|game/.test(t)) return "🧸";
  return "✨";
}

function assetFor(text=""){
  if(/電話|視訊|Face Call|video|call/i.test(text)) return "video-call";
  if(/點讀|圖卡|卡片|flash/i.test(text)) return "talking-pen";
  if(/平板|影片|卡通|tablet/i.test(text)) return "tablet-story";
  if(/繪本|共讀|故事|閱讀|read|book/i.test(text)) return "parent-reading";
  if(/跳|舞|律動|dance/i.test(text)) return "dancing-child";
  if(/唱|歌|拍手|music|song|聽/i.test(text)) return "clap-siblings";
  if(/親子|家人|爸爸|媽媽|遊戲|game/i.test(text)) return "family-parachute";
  if(/成長|進步|慢慢|時間|吸收/i.test(text)) return "growing-plant";
  return "decorations";
}

function assetUrl(asset){
  if(!asset || asset === "none") return "";
  return `./assets/illustrations/${asset}.png`;
}

function renderHero(){
  const hero = $("heroVisual");
  const choice = $("heroChoice").value || "default";
  const hidden = choice === "none";
  hero.classList.toggle("is-hidden",hidden);
  $("heroFileLabel").classList.toggle("is-active",choice === "custom");

  if(hidden){
    hero.innerHTML = "";
  }else if(choice === "default"){
    hero.innerHTML = defaultHeroMarkup;
  }else if(choice === "custom"){
    hero.innerHTML = customHeroDataUrl
      ? `<img src="${customHeroDataUrl}" alt="自行上傳的主圖">`
      : `<div class="hero-placeholder">請在左側選擇要上傳的照片</div>`;
  }else{
    const selected = heroChoices.find(item=>item.value === choice);
    hero.innerHTML = `
      <div class="hero-asset-frame">
        <img src="${assetUrl(choice)}" alt="${escapeHtml(selected?.label || "童趣主圖")}">
      </div>
    `;
  }
}

function renderEditors(){
  const host = $("sectionEditors");
  host.innerHTML = "";
  sections.forEach((s,index)=>{
    const node = $("sectionEditorTemplate").content.cloneNode(true);
    const root = node.querySelector(".section-editor");
    const icon = node.querySelector(".icon-input");
    const title = node.querySelector(".title-input");
    const text = node.querySelector(".text-input");
    const asset = node.querySelector(".asset-select");
    icon.value = s.icon;
    title.value = s.title;
    text.value = s.text;
    illustrationAssets.forEach(item=>asset.add(new Option(item.label,item.value)));
    asset.value = s.asset || "auto";

    icon.addEventListener("input",()=>{ sections[index].icon=icon.value; renderPoster(); });
    title.addEventListener("input",()=>{ sections[index].title=title.value; renderPoster(); });
    text.addEventListener("input",()=>{ sections[index].text=text.value; renderPoster(); });
    asset.addEventListener("change",()=>{ sections[index].asset=asset.value; renderPoster(); saveDraft(); });

    node.querySelector(".move-up").addEventListener("click",()=>{
      if(index===0) return;
      [sections[index-1],sections[index]]=[sections[index],sections[index-1]];
      renderEditors(); renderPoster();
    });
    node.querySelector(".move-down").addEventListener("click",()=>{
      if(index===sections.length-1) return;
      [sections[index+1],sections[index]]=[sections[index],sections[index+1]];
      renderEditors(); renderPoster();
    });
    node.querySelector(".delete-section").addEventListener("click",()=>{
      sections.splice(index,1); renderEditors(); renderPoster();
    });

    host.appendChild(node);
  });
}

function renderPoster(){
  const issue = `${$("year").value}年${$("month").value}號`;
  $("issueLabel").textContent = `${issue}｜精選分享`;
  $("issueMetaView").textContent = issue;
  $("principalView").textContent = $("principal").value;
  $("principalFooter").textContent = `— ${$("principal").value}`;
  $("childNameView").textContent = $("childName").value;
  $("childInfoView").textContent = $("childInfo").value;
  $("periodView").textContent = `使用期間｜${$("period").value}`;
  $("themeView").textContent = $("theme").value;
  $("closingView").textContent = $("closing").value;
  renderHero();

  const grid = $("diaryCards");
  grid.innerHTML = "";
  const mode = document.querySelector('input[name="illustrationMode"]:checked')?.value || "fixed";

  sections.forEach((s,index)=>{
    const card = document.createElement("article");
    card.className = "diary-card";
    if(sections.length % 2 === 1 && index === sections.length-1) card.classList.add("wide");
    const selectedAsset = s.asset === "auto" || !s.asset ? assetFor(s.text) : s.asset;
    const imageUrl = mode === "ai" ? safeImageUrl(s.imageUrl) : assetUrl(selectedAsset);
    const art = s.icon || illustrationFor(s.text);
    const illustrationHtml = selectedAsset === "none" ? "" : `
      <div class="card-illustration">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(s.title)}插圖">` : escapeHtml(art)}</div>
    `;
    card.innerHTML = `
      <div class="card-head">
        <span class="card-no">${index+1}</span>
        <h2>${escapeHtml(s.title)}</h2>
      </div>
      <p>${escapeHtml(s.text)}</p>
      ${illustrationHtml}
    `;
    grid.appendChild(card);
  });
}

function localSmartOrganize(raw){
  const clean = raw.replace(/\r/g,"").trim();
  if(!clean) return structuredClone(defaultSections);

  const sentences = clean
    .split(/\n+|(?<=[。！？!?])\s*/)
    .map(s=>s.trim())
    .filter(Boolean);

  const groups = [];
  const target = Math.min(6, Math.max(4, Math.ceil(sentences.length/2)));
  const per = Math.max(1, Math.ceil(sentences.length/target));

  for(let i=0;i<sentences.length;i+=per){
    const chunk = sentences.slice(i,i+per).join("");
    if(chunk) groups.push(chunk);
  }

  const titleFor = (text,i) => {
    if(/唱|歌|聽|music|song/i.test(text)) return "聽熟之後，自然開始跟著說";
    if(/洗澡|走路|生活|日常|電話|玩/i.test(text)) return "把英文放進生活情境";
    if(/主動|自己|拿|跟著|模仿/i.test(text)) return "孩子開始主動參與";
    if(/不急|時間|慢慢|吸收|糾正/i.test(text)) return "相信自然吸收，給孩子時間";
    if(/媽媽|爸爸|家長|我覺得|我發現/i.test(text)) return "身為家長，我也在改變";
    return ["這個月，我們更熟悉彼此的節奏","生活裡的小小英語時刻","本月看見的成長","有趣的小記事"][i%4];
  };

  return groups.slice(0,7).map((text,i)=>({
    icon: illustrationFor(text),
    asset: assetFor(text),
    title:titleFor(text,i),
    text
  }));
}

async function organizeDiary(){
  const raw = $("rawDiary").value.trim();
  if(!raw){
    alert("請先貼上家長原始日記。");
    return;
  }

  const apiBase = $("apiBase").value.trim().replace(/\/$/,"");
  if(apiBase){
    try{
      const res = await fetch(`${apiBase}/organize`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          rawDiary: raw,
          childName:$("childName").value,
          childInfo:$("childInfo").value,
          issue:`${$("year").value}年${$("month").value}號`
        })
      });
      if(!res.ok) throw new Error("API error");
      const data = await res.json();
      if(Array.isArray(data.sections) && data.sections.length){
        sections = data.sections.map(s=>({
          icon:s.icon || illustrationFor(s.text || ""),
          title:s.title || "本月紀錄",
          text:s.text || s.content || "",
          imageUrl:s.imageUrl || "",
          asset:s.asset || assetFor(s.text || s.content || "")
        }));
        if(data.closing) $("closing").value=data.closing;
        renderEditors(); renderPoster(); saveDraft();
        return;
      }
    }catch(err){
      console.warn(err);
      alert("AI 後端目前無法使用，已改成本機智慧整理。");
    }
  }

  sections = localSmartOrganize(raw);
  renderEditors();
  renderPoster();
  saveDraft();
}

function saveDraft(){
  const data = {
    year:$("year").value, month:$("month").value, principal:$("principal").value,
    period:$("period").value, theme:$("theme").value,
    childName:$("childName").value, childInfo:$("childInfo").value,
    rawDiary:$("rawDiary").value, closing:$("closing").value, apiBase:$("apiBase").value,
    heroChoice:$("heroChoice").value,
    sections
  };
  localStorage.setItem("williePrincipalDiaryDraft",JSON.stringify(data));
}

function loadDraft(){
  const raw = localStorage.getItem("williePrincipalDiaryDraft");
  if(!raw) return;
  try{
    const d=JSON.parse(raw);
    ["year","month","principal","period","theme","childName","childInfo","rawDiary","closing","apiBase","heroChoice"].forEach(k=>{
      if(d[k]!==undefined && $(k)) $(k).value=d[k];
    });
    if(Array.isArray(d.sections)) sections=d.sections;
  }catch{}
}

function imagePreview(input){
  const file=input.files?.[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    customHeroDataUrl=e.target.result;
    $("heroChoice").value="custom";
    renderHero();
    saveDraft();
  };
  reader.readAsDataURL(file);
}

["year","month","principal","period","theme","childName","childInfo","closing","apiBase"].forEach(id=>{
  $(id).addEventListener("input",()=>{renderPoster(); saveDraft();});
});
document.querySelectorAll('input[name="illustrationMode"]').forEach(el=>el.addEventListener("change",renderPoster));

heroChoices.forEach(item=>$("heroChoice").add(new Option(item.label,item.value)));
$("heroChoice").addEventListener("change",()=>{renderHero();saveDraft();});
$("heroFile").addEventListener("change",e=>imagePreview(e.target));
$("smartOrganize").addEventListener("click",organizeDiary);
$("clearRaw").addEventListener("click",()=>{$("rawDiary").value="";saveDraft();});
$("addSection").addEventListener("click",()=>{
  sections.push({icon:"⭐",asset:"auto",title:"新增段落",text:"請輸入家長日記內容。"});
  renderEditors();renderPoster();
});
$("saveDraft").addEventListener("click",()=>{saveDraft();alert("已儲存在這台裝置的瀏覽器。");});
$("printPdf").addEventListener("click",()=>window.print());

$("exportPng").addEventListener("click",async()=>{
  if(typeof html2canvas==="undefined"){
    alert("PNG 功能需要連網載入 html2canvas；可先使用列印／PDF。");
    return;
  }
  const canvas=await html2canvas($("poster"),{scale:2,useCORS:true,backgroundColor:null});
  const a=document.createElement("a");
  a.download=`園長日記_${$("year").value}年${$("month").value}號_${$("childName").value||"未命名"}.png`;
  a.href=canvas.toDataURL("image/png");
  a.click();
});

loadDraft();
renderEditors();
renderPoster();
