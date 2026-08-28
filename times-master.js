(() => {
  const layoutSelect = document.getElementById('layoutMode');
  const poster = document.getElementById('poster');
  if (!layoutSelect || !poster || typeof window.renderPoster !== 'function') return;

  const originalRenderPoster = window.renderPoster;
  const originalMarkup = poster.innerHTML;
  const originalClassName = poster.className;
  let timesActive = false;

  const monthEnglish = {
    '一月':'JANUARY','二月':'FEBRUARY','三月':'MARCH','四月':'APRIL','五月':'MAY','六月':'JUNE',
    '七月':'JULY','八月':'AUGUST','九月':'SEPTEMBER','十月':'OCTOBER','十一月':'NOVEMBER','十二月':'DECEMBER'
  };
  const monthNumber = {
    '一月':'01','二月':'02','三月':'03','四月':'04','五月':'05','六月':'06',
    '七月':'07','八月':'08','九月':'09','十月':'10','十一月':'11','十二月':'12'
  };

  const safe = (value='') => escapeHtml(String(value || ''));
  const shortText = (value='', max=96) => {
    const text = String(value || '').trim();
    return text.length > max ? `${text.slice(0,max)}…` : text;
  };
  const fallback = (index) => [
    {title:'把英文放進生活裡',text:'讓英文自然出現在每天的遊戲、共讀與對話裡。'},
    {title:'自然開口的小進步',text:'從模仿到主動表達，每一次開口都是成長。'},
    {title:'從聽歌到跟讀',text:'先聽熟、再跟著說，讓語言慢慢變成生活的一部分。'},
    {title:'放下趕進度',text:'給孩子時間探索，學習反而更自在、更投入。'},
    {title:'本月學習亮點',text:'把這個月最值得留下的小進步記錄下來。'},
    {title:'小小觀察家',text:'生活裡的每個好奇心，都可能是新的學習入口。'},
  ][index] || {title:'本月紀錄',text:'把這個月最想留下的故事記錄下來。'};

  function itemAt(index){
    const item = (typeof sections !== 'undefined' && sections[index]) ? sections[index] : fallback(index);
    return {
      title: item?.title || fallback(index).title,
      text: item?.text || fallback(index).text,
      asset: item?.asset || 'watercolor-parent-reading',
      imageUrl: item?.imageUrl || ''
    };
  }

  function heroSrc(){
    const choice = document.getElementById('heroChoice')?.value || 'default';
    if (choice === 'custom' && typeof customHeroDataUrl !== 'undefined' && customHeroDataUrl) return customHeroDataUrl;
    if (choice !== 'none' && choice !== 'custom' && choice !== 'default') return assetUrl(choice);
    return './assets/illustrations/watercolor-parent-reading.jpg';
  }

  function sectionImage(item){
    const mode = document.querySelector('input[name="illustrationMode"]:checked')?.value || 'fixed';
    if (mode === 'ai' && item.imageUrl) return safeImageUrl(item.imageUrl);
    return assetUrl(item.asset || 'watercolor-parent-reading');
  }

  function renderTimesPoster(){
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const principal = document.getElementById('principal').value;
    const period = document.getElementById('period').value;
    const theme = document.getElementById('theme').value;
    const childName = document.getElementById('childName').value;
    const childInfo = document.getElementById('childInfo').value;
    const closing = document.getElementById('closing').value;
    const cover = itemAt(0);
    const highlights = [itemAt(1),itemAt(2),itemAt(3),itemAt(4)];
    const learning = itemAt(5);
    const story = itemAt(6);
    const hero = heroSrc();

    poster.className = 'poster layout-times-master';
    poster.innerHTML = `
      <div class="tm-paper-speckles"></div>
      <header class="tm-header">
        <div class="tm-date-box">
          <b>${safe(monthEnglish[month] || 'MONTH')}</b>
          <span>${safe(year)}</span>
          <span>VOL.${safe(monthNumber[month] || '01')}</span>
          <em>精選分享</em>
        </div>
        <div class="tm-brand">威利兄弟會 3.0 一起玩</div>
        <div class="tm-sun">☀</div>
        <div class="tm-title-frame"><h1>園長日記</h1></div>
        <div class="tm-subtitle">${safe(month)}份精選分享</div>
      </header>

      <section class="tm-feature">
        <div class="tm-feature-copy">
          <div class="tm-ribbon">本月封面故事</div>
          <div class="tm-cover-en">COVER STORY ★★★</div>
          <h2>${safe(cover.title)}</h2>
          <p>${safe(shortText(cover.text,110))}</p>
          <div class="tm-meta-lines">
            <span>園長｜${safe(principal)}</span>
            <span>紀錄｜${safe(period)}</span>
            <span>主題｜${safe(theme)}</span>
          </div>
        </div>
        <div class="tm-hero-wrap">
          <img src="${safe(hero)}" alt="本月封面主圖">
          <div class="tm-hero-caption">${safe(childName)} · ${safe(childInfo)}</div>
        </div>
      </section>

      <section class="tm-highlight-list">
        ${highlights.map((item,index)=>`
          <article class="tm-highlight tm-h${index+1}">
            <div class="tm-num">0${index+1}</div>
            <div class="tm-highlight-copy">
              <h3>${safe(item.title)}</h3>
              <p>${safe(shortText(item.text,72))}</p>
            </div>
            <img src="${safe(sectionImage(item))}" alt="${safe(item.title)}插圖">
          </article>
        `).join('')}
      </section>

      <section class="tm-bottom-grid">
        <article class="tm-note-card">
          <div class="tm-tape"></div>
          <h3>本月學習亮點 ✦</h3>
          <p>${safe(shortText(learning.text,150))}</p>
          <div class="tm-checks">✓ 看見小小進步　✓ 保留生活感　✓ 不趕進度</div>
        </article>
        <article class="tm-photo-card">
          <img src="${safe(sectionImage(story))}" alt="本月小故事插圖">
          <strong>${safe(story.title)}</strong>
          <span>${safe(shortText(story.text,68))}</span>
        </article>
        <article class="tm-consultant-card">
          <span class="tm-new">NEW</span>
          <h3>顧問也能快速<br>生成海報日記</h3>
          <p>貼上內容 → 選風格 → 自動排版 → 直接下載</p>
          <div class="tm-laptop">▰</div>
        </article>
      </section>

      <footer class="tm-footer">
        <span>記錄今天的小進步，成為明天的大自信。</span>
        <strong>${safe(closing)}</strong>
      </footer>
    `;
    const help = document.getElementById('layoutHelp');
    if(help) help.textContent = '復古童趣雜誌封面：固定母版＋自動套入內容。';
    timesActive = true;
  }

  function restoreDefaultPoster(){
    if (!timesActive) return;
    poster.className = originalClassName;
    poster.innerHTML = originalMarkup;
    timesActive = false;
  }

  window.renderPoster = function(...args){
    if (layoutSelect.value === 'times') {
      renderTimesPoster();
      return;
    }
    restoreDefaultPoster();
    originalRenderPoster(...args);
  };

  const keepChosenStyle = () => {
    const chosen = layoutSelect.value;
    setTimeout(() => {
      if (chosen === 'times') {
        layoutSelect.value = 'times';
        window.renderPoster();
      }
    }, 120);
  };

  document.getElementById('smartOrganize')?.addEventListener('click', keepChosenStyle);
  layoutSelect.addEventListener('input', () => window.renderPoster());
  layoutSelect.addEventListener('change', () => window.renderPoster());

  const draft = (() => { try { return JSON.parse(localStorage.getItem('williePrincipalDiaryDraft') || '{}'); } catch { return {}; } })();
  const requested = new URLSearchParams(location.search).get('layout');
  if (requested === 'times' || draft.layoutMode === 'times') layoutSelect.value = 'times';

  window.renderPoster();
})();
