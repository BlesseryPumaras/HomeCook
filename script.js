const units = {
  weight: ["Grams (g)", "Kilograms (kg)", "Ounces (oz)", "Pounds (lbs)", "Cups (Flour)", "Cups (Sugar)"],
  volume: ["Milliliters (ml)", "Liters (L)", "Cups", "Tablespoons (tbsp)", "Teaspoons (tsp)"],
  temp: ["Celsius (°C)", "Fahrenheit (°F)"]
};
const categoryEl = document.getElementById('category');
const fromEl = document.getElementById('fromUnit');
const toEl = document.getElementById('toUnit');
const inputEl = document.getElementById('inputValue');
const resultEl = document.getElementById('result');
const labelEl = document.getElementById('resultLabel');
const favList = document.getElementById('favList');
const emptyMsg = document.getElementById('emptyMsg');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
function loadUnits() {
  const list = units[categoryEl.value];
  fromEl.innerHTML = list.map(u => `<option>${u}</option>`).join('');
  toEl.innerHTML = list.map(u => `<option>${u}</option>`).join('');
  toEl.selectedIndex = 1;
  convert();
}
function convert() {
  let v = parseFloat(inputEl.value) || 0;
  let from = fromEl.value; let to = toEl.value; let result = v;
  if (from === to) result = v;
  else if (from.includes('Celsius') && to.includes('Fahrenheit')) result = v * 9/5 + 32;
  else if (from.includes('Fahrenheit') && to.includes('Celsius')) result = (v - 32) * 5/9;
  else {
    let base = v;
    if (from === 'Kilograms (kg)') base = v * 1000;
    if (from === 'Ounces (oz)') base = v * 28.35;
    if (from === 'Pounds (lbs)') base = v * 453.59;
    if (from === 'Cups (Flour)') base = v * 125;
    if (from === 'Cups (Sugar)') base = v * 200;
    if (from === 'Liters (L)') base = v * 1000;
    if (from === 'Cups') base = v * 240;
    if (from === 'Tablespoons (tbsp)') base = v * 15;
    if (from === 'Teaspoons (tsp)') base = v * 5;
    if (to === 'Grams (g)' || to === 'Milliliters (ml)') result = base;
    if (to === 'Kilograms (kg)' || to === 'Liters (L)') result = base / 1000;
    if (to === 'Ounces (oz)') result = base / 28.35;
    if (to === 'Pounds (lbs)') result = base / 453.59;
    if (to === 'Cups (Flour)') result = base / 125;
    if (to === 'Cups (Sugar)') result = base / 200;
    if (to === 'Cups') result = base / 240;
    if (to === 'Tablespoons (tbsp)') result = base / 15;
    if (to === 'Teaspoons (tsp)') result = base / 5;
  }
  resultEl.textContent = result.toFixed(2) + ' ' + to;
  labelEl.textContent = `${v} ${from} =`;
}
function renderFav() {
  favList.innerHTML = '';
  emptyMsg.style.display = favorites.length ? 'none' : 'block';
  favorites.forEach((fav, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${fav}</span><button onclick="removeFav(${i})">🗑️</button>`;
    favList.appendChild(li);
  });
}
function removeFav(i) { favorites.splice(i, 1); localStorage.setItem('favorites', JSON.stringify(favorites)); renderFav(); }
document.getElementById('saveBtn').addEventListener('click', () => {
  const label = `${inputEl.value} ${fromEl.value} = ${resultEl.textContent}`;
  if (!favorites.includes(label)) { favorites.push(label); localStorage.setItem('favorites', JSON.stringify(favorites)); renderFav(); alert('Saved! ❤️'); }
});
categoryEl.addEventListener('change', loadUnits);
fromEl.addEventListener('change', convert);
toEl.addEventListener('change', convert);
inputEl.addEventListener('input', convert);
loadUnits(); renderFav();
