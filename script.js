(function () {
  'use strict';

  // Constants
  const DATA_JSON_PATH = 'KW_Masterarbeit_Test.detectora.json';
  const DATA_JSON_URL = encodeURI(DATA_JSON_PATH);
  const LS_KEY = `campuslektor:reportId:${location.pathname}`;

  // Utility Functions
  const setText = (selector, text) => {
    document.querySelectorAll(selector).forEach(el => el.textContent = text);
  };

  const formatInt = (num) => Number(num || 0).toLocaleString('de-DE');

  const escapeHTML = (str) => String(str ?? '')
    .replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));

  // Set current date for report and stand date
  const today = new Date().toLocaleDateString('de-DE');
  setText('#report-date', today);
  setText('#stand-date', today);

  // Assigns a unique report ID based on data or random generation
  async function assignReportId(data) {
    let id = '';

    // Try to extract ID from data
    if (data) {
      const candidates = [
        data.report_id,
        data.document_id,
        data.id,
        data.meta?.report_id,
        data.meta?.document_id
      ];
      id = candidates.find(v => v && String(v).trim().length >= 6)?.trim() || '';
    }

    // Fallback: Generate ID from data hash
    if (!id && data) {
      try {
        const bytes = new TextEncoder().encode(JSON.stringify(data));
        if (crypto?.subtle) {
          const hash = await crypto.subtle.digest('SHA-256', bytes);
          id = Array.from(new Uint8Array(hash))
            .slice(0, 6)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
        }
      } catch (e) {
        console.error('Hash generation failed:', e);
      }
    }

    // Fallback: Use stored ID from localStorage
    if (!id) {
      try {
        id = localStorage.getItem(LS_KEY) || '';
      } catch (e) {
        console.error('localStorage access failed:', e);
      }
    }

    // Fallback: Generate random ID
    if (!id) {
      const rnd = new Uint8Array(6);
      if (crypto?.getRandomValues) {
        crypto.getRandomValues(rnd);
      } else {
        for (let i = 0; i < 6; i++) {
          rnd[i] = Math.floor(Math.random() * 256);
        }
      }
      id = Array.from(rnd)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
    }

    // Update DOM and store ID
    setText('#document-id', id);
    setText('#report-id', id);
    try {
      localStorage.setItem(LS_KEY, id);
    } catch (e) {
      console.error('localStorage save failed:', e);
    }

    return id;
  }

  // Renders analysis results to the DOM
  function render(data) {
    const sections = Array.isArray(data?.section_results) ? data.section_results : [];

    // Update total sections count
    setText('#meta-total', formatInt(sections.length));
    setText('#kpi-total', formatInt(sections.length));

    // Calculate AI probability for each section
    const readProbability = (section) => {
      let prob = section?.fake_probability ??
                section?.ai_probability ??
                section?.probability ??
                section?.score ?? 0;
      prob = Number(prob) || 0;
      if (prob > 1) prob /= 100;
      return Math.max(0, Math.min(1, prob));
    };

    // Filter sections with >= 50% AI probability
    const aiSections = sections
      .map((s, idx) => ({ ...s, __p: readProbability(s), __idx: idx + 1 }))
      .filter(s => s.__p >= 0.5);

    setText('#kpi-ai', formatInt(aiSections.length));

    // Calculate AI content share for donut chart
    const sum = (arr, fn) => arr.reduce((a, x) => a + (Number(fn(x)) || 0), 0);
    const tokenKey = (s) => s.all_tokens ?? s.tokens ?? s.token_count ?? 0;
    const totalTokens = sum(sections, tokenKey);
    const aiTokens = sum(aiSections, tokenKey);
    const share = totalTokens > 0 ? aiTokens / totalTokens : (sections.length ? aiSections.length / sections.length : 0);

    // Update donut chart
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const arcDash = share * circumference;
    const arc = document.getElementById('arc');
    if (arc) {
      arc.setAttribute('stroke-dasharray', `${arcDash.toFixed(2)} ${circumference - arcDash.toFixed(2)}`);
    }
    const percentCenter = document.getElementById('percent-center');
    if (percentCenter) {
      percentCenter.textContent = (share * 100).toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + '%';
    }

    // Populate AI sections table
    const tbody = document.getElementById('ai-rows');
    if (tbody) {
      tbody.innerHTML = '';
      aiSections
        .sort((a, b) => b.__p - a.__p)
        .forEach((section, index) => {
          const content = (section.section || '').replace(/\s+/g, ' ').trim();
          const probability = (section.__p * 100).toLocaleString('de-DE', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          }) + '%';
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="rank">${index + 1}</td>
            <td class="serial">${section.__idx}</td>
            <td class="probability">${probability}</td>
            <td class="content">${escapeHTML(content)}</td>
          `;
          tbody.appendChild(tr);
        });
    }
  }

  // Fetch and process JSON data
  fetch(DATA_JSON_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(async data => {
      render(data);
      await assignReportId(data);
    })
    .catch(async error => {
      console.error('Failed to load JSON:', error);
      const tbody = document.getElementById('ai-rows');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td colspan="4" style="text-align: center; padding: 20px; color: #999;">
            Daten konnten nicht geladen werden. Prüfen Sie den Dateinamen in <code>DATA_JSON_PATH</code>.
          </td>
        `;
        tbody.appendChild(tr);
      }
      await assignReportId(null);
    });
})();