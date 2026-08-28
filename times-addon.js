(() => {
  const layoutSelect = document.getElementById('layoutMode');
  const poster = document.getElementById('poster');
  if (!layoutSelect || !poster || typeof window.renderPoster !== 'function') return;

  if (![...layoutSelect.options].some(option => option.value === 'times')) {
    const option = new Option('TiMES 特刊版｜復古童趣封面', 'times');
    layoutSelect.add(option, 0);
  }

  const monthEnglish = {
    '一月':'JANUARY','二月':'FEBRUARY','三月':'MARCH','四月':'APRIL','五月':'MAY','六月':'JUNE',
    '七月':'JULY','八月':'AUGUST','九月':'SEPTEMBER','十月':'OCTOBER','十一月':'NOVEMBER','十二月':'DECEMBER'
  };
  const monthNumber = {
    '一月':'01','二月':'02','三月':'03','四月':'04','五月':'05','六月':'06',
    '七月':'07','八月':'08','九月':'09','十月':'10','十一月':'11','十二月':'12'
  };

  const header = poster.querySelector('header');
  const stamp = document.createElement('div');
  stamp.className = 'times-date-stamp';
  stamp.innerHTML = '<b class="times-month"></b><span class="times-year"></span><span class="times-vol"></span><em>精選分享</em>';
  header.appendChild(stamp);

  const coverLabel = document.createElement('div');
  coverLabel.className = 'times-cover-label';
  coverLabel.innerHTML = '<strong>本月封面故事</strong><span>COVER STORY</span>';
  header.appendChild(coverLabel);

  const originalRenderPoster = window.renderPoster;
  window.renderPoster = function(...args){
    originalRenderPoster(...args);
    const layout = layoutSelect.value;
    poster.classList.toggle('layout-times', layout === 'times');

    if (layout === 'times') {
      const month = document.getElementById('month').value;
      const year = document.getElementById('year').value;
      poster.querySelector('.times-month').textContent = monthEnglish[month] || 'MONTH';
      poster.querySelector('.times-year').textContent = year;
      poster.querySelector('.times-vol').textContent = `VOL.${monthNumber[month] || '01'}`;
      document.getElementById('layoutHelp').textContent = '復古童趣月刊封面：大標題、封面故事、主視覺與本月重點，最接近你指定的 TiMES 特刊設計。';
      document.getElementById('posterTitle').textContent = '園長日記';
      document.getElementById('posterLead').textContent = '把英文放進生活裡，記錄孩子與爸媽的小小進步。';
      document.getElementById('issueLabel').textContent = `${month}份精選分享`;
    }
  };

  const draft = (() => {
    try { return JSON.parse(localStorage.getItem('williePrincipalDiaryDraft') || '{}'); }
    catch (_err) { return {}; }
  })();
  const requestedLayout = new URLSearchParams(location.search).get('layout');
  if (requestedLayout === 'times' || draft.layoutMode === 'times') {
    layoutSelect.value = 'times';
  }

  layoutSelect.addEventListener('input', () => window.renderPoster());
  layoutSelect.addEventListener('change', () => window.renderPoster());

  const organizeButton = document.getElementById('smartOrganize');
  if (organizeButton) {
    organizeButton.addEventListener('click', () => {
      const keepTimes = layoutSelect.value === 'times';
      if (!keepTimes) return;
      setTimeout(() => {
        layoutSelect.value = 'times';
        window.renderPoster();
        try {
          const saved = JSON.parse(localStorage.getItem('williePrincipalDiaryDraft') || '{}');
          saved.layoutMode = 'times';
          localStorage.setItem('williePrincipalDiaryDraft', JSON.stringify(saved));
        } catch (_err) {}
      }, 80);
    });
  }

  window.renderPoster();
})();
