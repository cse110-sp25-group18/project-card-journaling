document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM ready, starting to load card...");

  // Load the HTML template
  const response = await fetch('../templates/card-template.html');
  const html = await response.text();

  // Parse the HTML into a template element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html.trim();
  const template = tempDiv.querySelector('template');

  // Sample card data
  const cardData = {
    prompt: 'What inspired you today?',
    date: '2025-05-19',
    image: 'https://via.placeholder.com/300x100',
    alt: 'Placeholder image'
  };

  // Clone and populate the template
  const clone = template.content.cloneNode(true);
  clone.querySelector('.prompt').textContent = cardData.prompt;
  clone.querySelector('.date').textContent = new Date(cardData.date).toLocaleDateString();
  clone.querySelector('.date').setAttribute('datetime', cardData.date);
  clone.querySelector('img').src = cardData.image;
  clone.querySelector('img').alt = cardData.alt;

  // Add to the page
  const container = document.querySelector('.card-input');
  container.innerHTML = '';
  container.appendChild(clone);
  const card = container.querySelector('.card');
  const front = card.querySelector('.card-front');
  const back = card.querySelector('.card-back');
  front.addEventListener('click', () => {
    card.classList.add('flipped');
  })
  back.addEventListener('click', (e) => {
    if (!e.target.closest('textarea')) {
      card.classList.remove('flipped');
    }
  });
  console.log('Card added!');
});