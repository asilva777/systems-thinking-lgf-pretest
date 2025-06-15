<script>
  const CORRECT = { q1: 'c', q2: 'b', q3: 'b', q4: 'c', q5: 'c' };
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbw03vw2FURNagYLO3XV8pDS-Kood-xL8gyaIUhITi_OuLDUvMNbDS6VBTmEcqJZzQQ6/exec';

  document.getElementById('pretestForm').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    let mcqScore = 0;
    ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(q => {
      if (data.get(q) === CORRECT[q]) mcqScore++;
    });

    // Short-answer scoring
    let shortScore = 0;

    if ((data.get('q6') || '').toLowerCase().includes('unintended')) shortScore++;
    if ((data.get('q7') || '').toLowerCase().includes('revenue')) shortScore++;
    if ((data.get('q8') || '').toLowerCase().includes('ecosystem')) shortScore++;
    if ((data.get('q9') || '').toLowerCase().includes('linear')) shortScore++;
    const q10 = (data.get('q10') || '').toLowerCase();
    if (q10.includes('vensim') || q10.includes('power bi') || q10.includes('causal loop')) shortScore++;

    const payload = {
      score: mcqScore + '/5',
      shortAnswerScore: shortScore + '/5'
    };

    for (let [key, val] of data.entries()) payload[key] = val;

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        body: new URLSearchParams(payload)
      });
      document.getElementById('result').textContent = `✅ You scored ${mcqScore}/5 (MCQ) and ${shortScore}/5 (Short Answer). Thank you!`;
      form.reset();
    } catch (err) {
      document.getElementById('result').textContent = '❗ Submission failed. Please try again.';
      console.error(err);
    }
  };
</script>
