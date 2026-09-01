// Letter-reveal effect: splits any element with class="reveal-text" into
// individual letters (each wrapped in its own <span>), then lets CSS animate
// them in with a staggered delay (see .reveal-text .letter in styles.css).
document.addEventListener('DOMContentLoaded', () => {
  const letterDelayMs = 30;
  const letterAnimMs = 600;
  const tagGapMs = 150;

  const revealEls = document.querySelectorAll('.reveal-text');

  revealEls.forEach(el => {
    const boundary = el.closest('.hero') || el.parentElement;
    if (!boundary) return;
    const boundaryStyle = getComputedStyle(boundary);
    const availableWidth = boundary.clientWidth - parseFloat(boundaryStyle.paddingLeft) - parseFloat(boundaryStyle.paddingRight);
    let fontSize = parseFloat(getComputedStyle(el).fontSize);
    const minFontSize = 16;
    let guard = 0;
    while (el.scrollWidth > availableWidth && fontSize > minFontSize && guard < 60) {
      fontSize -= 2;
      el.style.fontSize = fontSize + 'px';
      guard++;
    }
  });

  let nextStartDelay = 0;

  revealEls.forEach(el => {
    const originalNodes = Array.from(el.childNodes);
    el.textContent = '';

    let letterIndex = 0;
    let totalLetters = 0;

    originalNodes.forEach(node => {
      if (node.nodeName === 'BR') {
        el.appendChild(document.createElement('br'));
        return;
      }

      const words = node.textContent.split(' ');
      words.forEach((word, wordIdx) => {
        if (word.length > 0) {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          [...word].forEach(char => {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter';
            letterSpan.textContent = char;
            letterSpan.style.setProperty('--letter-delay', `${nextStartDelay + letterIndex * letterDelayMs}ms`);
            wordSpan.appendChild(letterSpan);
            letterIndex++;
            totalLetters++;
          });
          el.appendChild(wordSpan);
        }
        if (wordIdx < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });
    });

    nextStartDelay = nextStartDelay + (totalLetters - 1) * letterDelayMs + letterAnimMs + tagGapMs;
  });
});
