/* ===== ANIMATIONS SYSTEM ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -30px 0px'
});

function observeAnimatedElements() {
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

/* ===== MODEL CARDS SYSTEM ===== */
const FALLBACK_MODELS = [
  { id: 'qvx-o/QeyPoint-Face', type: 'Keypoint Detection' },
  { id: 'qvx-o/QlangD', type: 'Text Classification' },
  { id: 'qvx-o/reFLEX-v1-15M', type: 'Text Generation' },
  { id: 'qvx-o/reFLEX-v1-50M', type: 'Text Generation' },
  { id: 'qvx-o/qvae', type: 'Image-to-Image' },
  { id: 'qvx-o/Qlipi', type: 'Image Feature Extraction' },
  { id: 'qvx-o/Qlip', type: 'Feature Extraction' },
  { id: 'qvx-o/QED-Base-v3', type: 'Text Generation' },
  { id: 'qvx-o/QOCR', type: 'Image-to-Text' },
  { id: 'qvx-o/QED-Base-v2', type: 'Text Generation' },
  { id: 'qvx-o/NoInsult', type: 'Text Classification' },
  { id: 'qvx-o/QED-B1-Instruction-v3', type: 'Text Generation' },
  { id: 'qvx-o/QED-B1-Instruction-v2', type: 'Text Generation' },
  { id: 'qvx-o/QED-B1-Instruction-v1', type: 'Text Generation' },
  { id: 'qvx-o/qWisp', type: 'Text Generation' },
  { id: 'qvx-o/QED-Base-v1', type: 'Text Generation' },
  { id: 'qvx-o/Qanvas', type: 'Text-to-Image' }
];

function createModelCard(model, index) {
  const modelId = (model.id || model.name || model.slug || '').includes('/')
    ? (model.id || model.name || model.slug || '').split('/')[1]
    : (model.id || model.name || model.slug || 'model');

  const type = model.type || model.pipeline_tag || model.tags?.[0] || 'AI Model';

  const card = document.createElement('article');
  card.className = 'project-card';
  card.setAttribute('data-animate', 'true');
  card.style.transitionDelay = `${0.08 * (index + 1)}s`;
  card.innerHTML = `
    <div class="project-tag">${type}</div>
    <h3>${modelId}</h3>
    <a href="https://huggingface.co/${model.id || model.name || model.slug}" class="project-link" target="_blank" rel="noopener noreferrer">
      View Model
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 17L17 7M17 7H7M17 7V17" />
      </svg>
    </a>
  `;

  observer.observe(card);
  return card;
}

function renderModels(models) {
  const grid = document.getElementById('models-grid');
  const countEl = document.getElementById('model-count');

  if (!grid) return;

  const modelList = Array.isArray(models) && models.length ? models : FALLBACK_MODELS;

  if (countEl) {
    countEl.textContent = String(modelList.length);
  }

  grid.innerHTML = '';

  modelList.forEach((model, index) => {
    const normalized = {
      id: model.id || model.name || model.slug || `qvx-o/model-${index + 1}`,
      type: model.type || model.pipeline_tag || model.tags?.[0] || model.modelType || 'AI Model'
    };

    if (!normalized.type || normalized.type === 'AI Model') {
      const fallbackMatch = FALLBACK_MODELS.find(item => item.id.toLowerCase() === normalized.id.toLowerCase());
      if (fallbackMatch) normalized.type = fallbackMatch.type;
    }

    const card = createModelCard(normalized, index);
    grid.appendChild(card);
  });
}

function initModelCards() {
  const grid = document.getElementById('models-grid');
  if (!grid) return;

  const countEl = document.getElementById('model-count');
  if (countEl) {
    countEl.textContent = 'Loading...';
  }

  fetch('https://huggingface.co/api/models?author=qvx-o&sort=lastModified&direction=-1&limit=100')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load model list');
      return response.json();
    })
    .then((models) => renderModels(models))
    .catch(() => renderModels(FALLBACK_MODELS));
}

/* ===== INIT ON LOAD ===== */
document.addEventListener('DOMContentLoaded', () => {
  observeAnimatedElements();
  initModelCards();
});
