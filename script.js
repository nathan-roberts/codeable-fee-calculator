// Currency symbols
// https://gist.githubusercontent.com/manishtiwari25/d3984385b1cb200b98bcde6902671599/raw/08bc58f73135aee2a31bc7aa5c34b66fcae0fa4e/world_currency_symbols.json

document.querySelectorAll('.service-fee-btn').forEach(button => {
  button.addEventListener('click', function () {
    document.querySelectorAll('.service-fee-btn').forEach(btn => {
      btn.classList.remove('bg-indigo-600', 'text-white');
      btn.classList.add('bg-white', 'text-gray-900');
    });
    this.classList.remove('bg-white', 'text-gray-900');
    this.classList.add('bg-indigo-600', 'text-white');
    calculate();
  });
});

async function fetchExchangeRates() {
  const lastUpdated = getCookie('lastUpdated');
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (!lastUpdated || now - lastUpdated > oneDay) {
    const response = await fetch('https://v6.exchangerate-api.com/v6/' + getCookie('apiKey') + '/latest/USD');
    const data = await response.json();
    const rates = data.conversion_rates;

    setCookie('rates', JSON.stringify(rates), 1);
    setCookie('lastUpdated', now, 1);
    showNotification();

    populateRates(rates);
  } else {
    const rates = JSON.parse(getCookie('rates'));
    populateRates(rates);
  }
}

function populateRates(rates) {
  const baseRateDropdown = document.getElementById('baseRate');
  baseRateDropdown.innerHTML = '';

  for (const currency in rates) {
    const option = document.createElement('option');
    option.value = rates[currency];
    option.text = currency;
    option.setAttribute('data-symbol', getCurrencySymbol(currency));
    baseRateDropdown.appendChild(option);
  }

  const savedCurrency = getCookie('baseCurrency');
  if (savedCurrency) {
    for (let i = 0; i < baseRateDropdown.options.length; i++) {
      if (baseRateDropdown.options[i].text === savedCurrency) {
        baseRateDropdown.selectedIndex = i;
        break;
      }
    }
  }
  calculate();
}

function handleCurrencyChange() {
  const baseRateDropdown = document.getElementById('baseRate');
  const selectedOption = baseRateDropdown.options[baseRateDropdown.selectedIndex];
  const baseCurrency = selectedOption.text;
  setCookie('baseCurrency', baseCurrency, 30);
  calculate();
  // focus input #takehome


}

function getCurrencySymbol(currency) {
  const symbols = {
    USD: '$', EUR: '€', GBP: '£', // Add more symbols as needed
  };
  return symbols[currency] || currency;
}

function calculate() {
  const serviceFee = parseFloat(document.querySelector('.service-fee-btn.bg-indigo-600').getAttribute('data-fee')) / 100;
  const takehome = parseFloat(document.getElementById('takehome').value);
  const baseRate = parseFloat(document.getElementById('baseRate').value);

  if (isNaN(takehome) || takehome <= 0 || isNaN(baseRate)) {
    document.getElementById('result').innerText = 'Please enter a valid takehome amount.';
    return;
  }

  const takehomeInUSD = takehome / baseRate;
  const estimate = takehomeInUSD / 0.9;
  const billedToClient = estimate * (1 + serviceFee);

  document.getElementById('estimate').innerHTML = `$${estimate.toFixed(2)}`;
  document.getElementById('billed').innerHTML = `$${billedToClient.toFixed(2)}`;
}

function showNotification() {
  const notification = document.getElementById('notification');
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

window.onload = function () {
  const apiKey = getCookie('apiKey');
  if (apiKey) {
    document.getElementById('api-key-container').classList.add('hidden');
    document.getElementById('calculator-container').classList.remove('hidden');
    fetchExchangeRates();
    setTimeout(() => {
      const takehomeInput = document.getElementById('takehome');
      console.log('Setting focus to #takehome', takehomeInput);
      if (takehomeInput) {
        takehomeInput.focus();
      } else {
        console.log('#takehome not found');
      }
    }, 100);
  } else {
    document.getElementById('api-key-container').classList.remove('hidden');
    document.getElementById('calculator-container').classList.add('hidden');
  }

  // Set default selected fee to 17.5%
  const defaultFeeBtn = document.querySelector('.service-fee-btn[data-fee="17.5"]');
  if (defaultFeeBtn) {
    defaultFeeBtn.classList.add('bg-indigo-600', 'text-white');
    defaultFeeBtn.classList.remove('bg-white', 'text-gray-900');
  }
  calculate();
};

// Add event listener to save API key and show calculator
document.getElementById('save-api-key').addEventListener('click', function () {
  const apiKey = document.getElementById('api-key').value;
  setCookie('apiKey', apiKey, 30);
  document.getElementById('api-key-container').classList.add('hidden');
  document.getElementById('calculator-container').classList.remove('hidden');
  fetchExchangeRates();
});

// Add event listener to copy estimate to clipboard
document.getElementById('estimate-container').addEventListener('click', function () {
  const estimateElement = document.getElementById('estimate');
  const estimateText = estimateElement.innerText;

  // Remove the $ symbol to get only the numerical value
  const numericValue = estimateText.replace(/^\$/, '');

  // Check if the Clipboard API is supported
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(numericValue).then(() => {
      // Add the visual effects
      const container = document.getElementById('estimate-container');
      const originalText = estimateElement.innerText;

      // Change border color and text color
      container.classList.add('border-green-500', 'text-green-500');
      estimateElement.innerHTML = '<span style="color:green">Copied</span>';

      // Reset the styles and text after 2 seconds
      setTimeout(() => {
        container.classList.remove('border-green-500', 'text-green-500');
        estimateElement.innerText = originalText;
      }, 500);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  } else {
    console.error('Clipboard API is not supported in this browser');
  }
});