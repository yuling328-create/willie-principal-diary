const $ = (id) => document.getElementById(id);

const illustrationAssets = [
  { value:"auto", label:"依內容自動配圖" },
  { value:"guide", label:"英語陪伴老師" },
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
  { value:"watercolor-parent-reading", label:"收藏風｜親子共讀與熊熊" },
  { value:"watercolor-singing-child", label:"收藏風｜孩子唱歌" },
  { value:"watercolor-sisters-talking-pen", label:"收藏風｜手足點讀" },
  { value:"watercolor-outdoor-father-son", label:"收藏風｜親子戶外互動" },
  { value:"watercolor-boy-talking-pen-book", label:"收藏風｜小男孩點讀繪本" },
  { value:"watercolor-boy-tablet", label:"收藏風｜小男孩使用平板" },
  { value:"watercolor-boy-talking-pen-cards", label:"收藏風｜小男孩點讀圖卡" },
  { value:"none", label:"不放插圖" }
];

const heroChoices = [
  { value:"default", label:"預設收藏風親子共讀" },
  { value:"none", label:"不顯示主圖（自動收合）" },
  { value:"custom", label:"自行上傳照片" },
  ...illustrationAssets.filter(item=>!["auto","none"].includes(item.value))
];

const defaultHeroMarkup = `
  <div class="hero-asset-frame default-watercolor-hero">
    <img src="./assets/illustrations/watercolor-parent-reading.jpg" alt="收藏風親子共讀插畫">
  </div>
`;

let customHeroDataUrl = "";

const defaultSections = [
  { icon:"📚", asset:"watercolor-parent-reading", title:"越來越熟悉，節奏更自在", text:"使用進入第二個月，孩子對教材越來越熟悉，連帶整個帶領的節奏也更自在。以前還會擔心有沒有照著流程走，現在反而能放鬆跟著感覺帶，和孩子一起享受學習的過程。" },
  { icon:"🎵", asset:"watercolor-singing-child", title:"聽熟之後，自然開始跟唱", text:"最近最大的收穫，是孩子已經把歌曲聽得非常熟。熟悉感建立後，開口不再像是一項任務，而是生活裡自然發生的回應。" },
  { icon:"🌱", asset:"watercolor-outdoor-father-son", title:"相信自然吸收，給孩子時間", text:"孩子有時咬字還不清楚，但我開始提醒自己不用急著糾正。先讓孩子大量接觸、自然吸收，保留她願意開口的信心。" },
  { icon:"☎️", asset:"watercolor-parent-reading", title:"把英文放進生活互動", text:"電話美語、洗澡唱歌、走路時玩口令，都變成孩子很期待的活動。語言不只出現在教材裡，也可以存在每天自然發生的小事中。" },
  { icon:"✨", asset:"watercolor-sisters-talking-pen", title:"這個月的小亮點", text:"孩子開始主動拿卡片、跟著錄音，也會把熟悉的英文句子放進遊戲。這些小小的變化，讓我看到反覆輸入正在慢慢累積。" },
  { icon:"❤️", asset:"watercolor-parent-reading", title:"身為家長，最大的改變", text:"一路使用下來，最大的改變不只是孩子學了多少，而是身為家長的我越來越放鬆，也越來越相信孩子會照著自己的節奏成長。" }
];

const quickSections = {
  highlight:{ icon:"⭐", asset:"decorations", type:"story", title:"本月亮點", text:"請寫下這個月最想留下的亮點。" },
  reflection:{ icon:"🌿", asset:"watercolor-parent-reading", type:"reflection", title:"家長反思", text:"請寫下陪伴過程中的觀察與心情。" },
  favorite:{ icon:"😊", asset:"watercolor-singing-child", type:"story", title:"孩子最享受", text:"請記錄孩子最投入、最喜歡的活動。" },
  challenge:{ icon:"💭", asset:"watercolor-outdoor-father-son", type:"reflection", title:"較抗拒／還在適應", text:"請記錄孩子目前較抗拒，或仍需要時間適應的部分。" },
  plan:{ icon:"📘", asset:"picture-book", type:"plan", title:"下個月計畫", text:"請寫下想繼續保留、減少或新增的內容。" },
  scene:{ icon:"📅", asset:"watercolor-outdoor-father-son", type:"scene", date:"請填日期／情境", title:"觀察情境", text:"請記錄當天發生的事情，以及孩子自然使用英文的反應。" },
  song:{ icon:"🎵", asset:"watercolor-singing-child", type:"song", title:"歌曲紀錄", text:"請記錄歌曲名稱、孩子喜歡的動作或自然跟唱的片段。" },
  quote:{ icon:"💬", asset:"watercolor-sisters-talking-pen", type:"quote", title:"英文金句", text:"請記錄孩子這個月自然說出的英文句子。" },
  question:{ icon:"❓", asset:"watercolor-parent-reading", type:"question", title:"園長提問", text:"請寫下想請園長協助觀察或回應的問題。" }
};

const layoutHelp = {
  cute:"三欄重點整理，適合一頁快速閱讀。",
  story:"雙欄長文敘述，適合保留完整家長故事。",
  observation:"依日期呈現事件，插圖與情境紀錄左右分區。",
  siblings:"分開呈現兩位孩子的故事，最後保留共同總結。",
  collage:"用大小卡片整理歌曲、活動、金句與互動片段。",
  structured:"以目標、操作方式、日常紀錄與園長提問清楚呈現。"
};

let sections = structuredClone(defaultSections);

const childAvatarIcons = {
  girl:"👧🏻",
  boy:"👦🏻",
  baby:"👶🏻"
};

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
  if(/男孩|兒子|弟弟/.test(text) && /點讀|圖卡|卡片|flash/i.test(text)) return "watercolor-boy-talking-pen-cards";
  if(/男孩|兒子|弟弟/.test(text) && /平板|pad|影片|卡通|tablet/i.test(text)) return "watercolor-boy-tablet";
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
  const extension = asset.startsWith("watercolor-") ? "jpg" : "png";
  return `./assets/illustrations/${asset}.${extension}`;
}

function sentenceSegments(text=""){
  return text
    .replace(/\r/g,"")
    .split(/\n+/)
    .flatMap(line=>line.match(/[^。！？!?]+[。！？!?]?/g) || [])
    .map(point=>point.trim())
    .filter(Boolean);
}

function textPoints(text=""){
  return sentenceSegments(text);
}

function cardTextHtml(text="",layout="cute"){
  const points = textPoints(text);
  if(layout === "structured" && points.length > 1){
    return `<ol class="structured-points">${points.map(point=>`<li>${escapeHtml(point)}</li>`).join("")}</ol>`;
  }
  if(layout !== "cute") return `<p>${escapeHtml(text)}</p>`;
  if(points.length < 2) return `<p class="cute-copy">${escapeHtml(text)}</p>`;
  return `<ul class="diary-points">${points.map(point=>`<li>${escapeHtml(point)}</li>`).join("")}</ul>`;
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
    const type = node.querySelector(".type-select");
    const date = node.querySelector(".date-input");
    const child = node.querySelector(".child-select");
    icon.value = s.icon;
    title.value = s.title;
    text.value = s.text;
    illustrationAssets.forEach(item=>asset.add(new Option(item.label,item.value)));
    asset.value = s.asset || "auto";
    type.value = s.type || "story";
    date.value = s.date || "";
    child.value = s.child || "main";

    icon.addEventListener("input",()=>{ sections[index].icon=icon.value; renderPoster(); });
    title.addEventListener("input",()=>{ sections[index].title=title.value; renderPoster(); });
    text.addEventListener("input",()=>{ sections[index].text=text.value; renderPoster(); });
    asset.addEventListener("change",()=>{ sections[index].asset=asset.value; renderPoster(); saveDraft(); });
    type.addEventListener("change",()=>{ sections[index].type=type.value; renderPoster(); saveDraft(); });
    date.addEventListener("input",()=>{ sections[index].date=date.value; renderPoster(); saveDraft(); });
    child.addEventListener("change",()=>{ sections[index].child=child.value; renderPoster(); saveDraft(); });

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
  const layout = $("layoutMode").value || "cute";
  const colorTheme = $("colorTheme").value || "peach";
  const poster = $("poster");
  ["cute","story","observation","siblings","collage","structured"].forEach(name=>{
    poster.classList.toggle(`layout-${name}`,layout === name);
  });
  ["peach","meadow","sunshine","sky"].forEach(name=>{
    poster.classList.toggle(`theme-${name}`,colorTheme === name);
  });
  $("layoutHelp").textContent = layoutHelp[layout] || "";
  const issue = `${$("year").value}年${$("month").value}號`;
  $("issueLabel").textContent = `${issue}｜精選分享`;
  $("principalView").textContent = $("principal").value;
  $("principalFooter").textContent = `— ${$("principal").value}`;
  $("childNameView").textContent = $("childName").value;
  $("childInfoView").textContent = $("childInfo").value;
  $("childAvatarView").textContent = childAvatarIcons[$("childAvatar").value] || childAvatarIcons.girl;
  const hasSecondChild = Boolean($("childName2").value.trim());
  $("child2View").classList.toggle("is-hidden",!hasSecondChild);
  $("childName2View").textContent = $("childName2").value;
  $("childInfo2View").textContent = $("childInfo2").value;
  $("childAvatar2View").textContent = childAvatarIcons[$("childAvatar2").value] || childAvatarIcons.girl;
  $("periodView").textContent = $("period").value;
  $("themeView").textContent = $("theme").value;
  $("closingView").textContent = $("closing").value;
  renderHero();

  const grid = $("diaryCards");
  grid.innerHTML = "";
  const mode = document.querySelector('input[name="illustrationMode"]:checked')?.value || "fixed";

  sections.forEach((s,index)=>{
    const card = document.createElement("article");
    card.className = "diary-card";
    card.dataset.type = s.type || "story";
    if(layout === "story" && sections.length % 2 === 1 && index === sections.length-1) card.classList.add("wide");
    if(layout === "cute" && /下個月|計畫/.test(s.title)) card.classList.add("planning-card");
    if(layout === "siblings" && (s.child || "main") === "shared") card.classList.add("shared-card");
    const selectedAsset = s.asset === "auto" || !s.asset ? assetFor(s.text) : s.asset;
    const imageUrl = mode === "ai" ? safeImageUrl(s.imageUrl) : assetUrl(selectedAsset);
    if(selectedAsset === "none") card.classList.add("no-art");
    if(selectedAsset.startsWith("watercolor-")) card.classList.add("watercolor-art");
    const art = s.icon || illustrationFor(s.text);
    const childLabel = s.child === "second"
      ? ($("childName2").value || "第二位孩子")
      : s.child === "shared"
        ? "共同紀錄"
        : ($("childName").value || "第一位孩子");
    const dateHtml = s.date ? `<span class="section-date">${escapeHtml(s.date)}</span>` : "";
    const childHtml = layout === "siblings" ? `<span class="section-child">${escapeHtml(childLabel)}</span>` : "";
    const illustrationHtml = selectedAsset === "none" ? "" : `
      <div class="card-illustration">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(s.title)}插圖">` : escapeHtml(art)}</div>
    `;
    card.innerHTML = `
      <div class="card-head">
        <span class="card-no">${index+1}</span>
        <div class="card-title-copy">${dateHtml}${childHtml}<h2>${escapeHtml(s.title)}</h2></div>
      </div>
      ${cardTextHtml(s.text,layout)}
      ${illustrationHtml}
    `;
    grid.appendChild(card);
  });
}

function localSmartOrganize(raw){
  const clean = raw.replace(/\r/g,"").trim();
  if(!clean) return structuredClone(defaultSections);

  const sentences = sentenceSegments(clean);

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
    type:"story",
    date:"",
    child:"main",
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
          asset:s.asset || assetFor(s.text || s.content || ""),
          type:s.type || "story",
          date:s.date || "",
          child:s.child || "main"
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
    childName2:$("childName2").value, childInfo2:$("childInfo2").value,
    childAvatar:$("childAvatar").value, childAvatar2:$("childAvatar2").value,
    rawDiary:$("rawDiary").value, closing:$("closing").value, apiBase:$("apiBase").value,
    heroChoice:$("heroChoice").value, layoutMode:$("layoutMode").value,
    colorTheme:$("colorTheme").value,
    sections
  };
  localStorage.setItem("williePrincipalDiaryDraft",JSON.stringify(data));
}

function loadDraft(){
  const raw = localStorage.getItem("williePrincipalDiaryDraft");
  if(!raw) return;
  try{
    const d=JSON.parse(raw);
    if(["家庭英語共學","陪你一起孵出英語母語寶寶共學"].includes(d.theme)){
      d.theme="陪你一起孵出英語母語寶寶";
    }
    ["year","month","principal","period","theme","childName","childInfo","childName2","childInfo2","childAvatar","childAvatar2","rawDiary","closing","apiBase","heroChoice","layoutMode","colorTheme"].forEach(k=>{
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

["year","month","principal","period","theme","childName","childInfo","childName2","childInfo2","childAvatar","childAvatar2","closing","apiBase","layoutMode","colorTheme"].forEach(id=>{
  $(id).addEventListener("input",()=>{renderPoster(); saveDraft();});
});
document.querySelectorAll('input[name="illustrationMode"]').forEach(el=>el.addEventListener("change",renderPoster));

async function preparePosterExport(){
  renderPoster();
  if(document.fonts?.ready) await document.fonts.ready;
  const images = [...$("poster").querySelectorAll("img")];
  await Promise.all(images.map(async img=>{
    if(!img.complete){
      await new Promise(resolve=>{
        img.addEventListener("load",resolve,{once:true});
        img.addEventListener("error",resolve,{once:true});
      });
    }
    if(img.decode){
      try{ await img.decode(); }catch(_err){ /* html2canvas will use the loaded fallback */ }
    }
  }));
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
}

heroChoices.forEach(item=>$("heroChoice").add(new Option(item.label,item.value)));
$("heroChoice").addEventListener("change",()=>{renderHero();saveDraft();});
$("heroFile").addEventListener("change",e=>imagePreview(e.target));
$("smartOrganize").addEventListener("click",organizeDiary);
$("clearRaw").addEventListener("click",()=>{$("rawDiary").value="";saveDraft();});
$("addSection").addEventListener("click",()=>{
  sections.push({icon:"⭐",asset:"auto",type:"story",child:"main",date:"",title:"新增段落",text:"請輸入家長日記內容。"});
  renderEditors();renderPoster();
});
$("addQuickSection").addEventListener("click",()=>{
  const preset = quickSections[$("quickSection").value];
  if(!preset) return;
  sections.push({...preset});
  renderEditors();
  renderPoster();
  saveDraft();
});
$("applyWatercolorArt").addEventListener("click",()=>{
  const collection = [
    "watercolor-parent-reading",
    "watercolor-singing-child",
    "watercolor-sisters-talking-pen",
    "watercolor-outdoor-father-son",
    "watercolor-boy-talking-pen-book",
    "watercolor-boy-tablet",
    "watercolor-boy-talking-pen-cards"
  ];
  sections = sections.map((section,index)=>({
    ...section,
    asset:/唱|歌|music|song/i.test(section.text + section.title)
      ? "watercolor-singing-child"
      : /戶外|走路|公園|旅行|生活/i.test(section.text + section.title)
        ? "watercolor-outdoor-father-son"
        : /點讀|圖卡|卡片|手足|姊|妹/i.test(section.text + section.title)
          ? "watercolor-sisters-talking-pen"
          : collection[index % collection.length]
  }));
  $("heroChoice").value="default";
  renderEditors();
  renderPoster();
  saveDraft();
});
$("saveDraft").addEventListener("click",()=>{saveDraft();alert("已儲存在這台裝置的瀏覽器。");});
$("printPdf").addEventListener("click",async()=>{
  if(typeof html2canvas === "undefined" || !window.jspdf?.jsPDF){
    alert("PDF 功能需要連網載入轉檔工具，請確認網路後再試一次。");
    return;
  }

  const button = $("printPdf");
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "PDF 製作中…";

  try{
    await preparePosterExport();
    const canvas = await html2canvas($("poster"),{
      scale:1,
      useCORS:true,
      backgroundColor:"#fffaf1",
      logging:false
    });
    const { jsPDF } = window.jspdf;
    const pageWidth = 210;
    const pageHeight = 297;
    const ratio = Math.min(pageWidth / canvas.width,pageHeight / canvas.height);
    const imageWidth = canvas.width * ratio;
    const imageHeight = canvas.height * ratio;
    const imageX = (pageWidth - imageWidth) / 2;
    const imageY = (pageHeight - imageHeight) / 2;
    const pdf = new jsPDF({
      orientation:"portrait",
      unit:"mm",
      format:"a4"
    });
    pdf.addImage(canvas.toDataURL("image/jpeg",0.94),"JPEG",imageX,imageY,imageWidth,imageHeight);
    pdf.save(`園長日記_${$("year").value}年${$("month").value}號_${$("childName").value||"未命名"}.pdf`);
  }catch(err){
    console.error(err);
    alert("PDF 製作失敗，請重新整理頁面後再試一次。");
  }finally{
    button.disabled = false;
    button.textContent = originalLabel;
  }
});

$("exportPng").addEventListener("click",async()=>{
  if(typeof html2canvas==="undefined"){
    alert("PNG 功能需要連網載入 html2canvas；可先使用列印／PDF。");
    return;
  }
  const button = $("exportPng");
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "PNG 製作中…";
  try{
    await preparePosterExport();
    const canvas=await html2canvas($("poster"),{scale:2,useCORS:true,backgroundColor:"#fffaf1",logging:false});
    const a=document.createElement("a");
    a.download=`園長日記_${$("year").value}年${$("month").value}號_${$("childName").value||"未命名"}.png`;
    a.href=canvas.toDataURL("image/png");
    a.click();
  }catch(err){
    console.error(err);
    alert("PNG 製作失敗，請重新整理頁面後再試一次。");
  }finally{
    button.disabled = false;
    button.textContent = originalLabel;
  }
});

loadDraft();
renderEditors();
renderPoster();
