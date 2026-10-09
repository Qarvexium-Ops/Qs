const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -30px 0px'
});

function observeVisibleElements() {
  document.querySelectorAll('[data-animate]').forEach(el => {
    if (!el.dataset.observed) {
      observer.observe(el);
      el.dataset.observed = 'true';
    }
  });
}

function initModelCards() {
  const grid = document.getElementById('models-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const fallbackModels = [
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

  const setCardHTML = (model) => {
    const modelName = model.id.split('/')[1];
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-animate', 'true');
    card.innerHTML = `
      <div class="project-tag">${model.type}</div>
      <h3>${modelName}</h3>
      <a href="https://huggingface.co/${model.id}" class="project-link" target="_blank" rel="noopener noreferrer">
        View Model
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    `;
    return card;
  };

  const countEl = document.getElementById('model-count');

  fetch('https://huggingface.co/api/models?author=qvx-o&sort=lastModified&direction=-1&limit=100')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to fetch Hugging Face models');
      return response.json();
    })
    .then((models) => {
      const liveModels = Array.isArray(models) ? models : fallbackModels;

      if (countEl) {
        countEl.textContent = String(liveModels.length);
      }

      liveModels.forEach((model, index) => {
        const modelId = model.id || model.name || model.slug || `qvx-o/model-${index + 1}`;
        const cleanedId = modelId.includes('/') ? modelId.split('/')[1] : modelId;
        const card = setCardHTML({
          id: modelId,
          type: model.pipeline_tag || model.tags?.[0] || fallbackModels.find((item) => item.id.includes(cleanedId))?.type || 'AI Model'
        });
        card.style.transitionDelay = `${0.08 * (index + 1)}s`;
        grid.appendChild(card);
      });

      observeVisibleElements();
    })
    .catch(() => {
      fallbackModels.forEach((model, index) => {
        const card = setCardHTML(model);
        card.style.transitionDelay = `${0.08 * (index + 1)}s`;
        grid.appendChild(card);
      });

      if (countEl) {
        countEl.textContent = String(fallbackModels.length);
      }

      observeVisibleElements();
    });
}

document.addEventListener('DOMContentLoaded', () => {
  initModelCards();
});
