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
  const lastUpdated = window.localStorage.getItem('lastUpdated');
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (!lastUpdated || now - lastUpdated > oneDay) {
    const response = await fetch('https://currency-rate-cache.codeaddicts.workers.dev/');
    const data = await response.json();
    const rates = data.conversion_rates;

    window.localStorage.setItem('rates', JSON.stringify(rates));
    window.localStorage.setItem('lastUpdated', now);
    showNotification();

    populateRates(rates);
  } else {
    const rates = JSON.parse(window.localStorage.getItem('rates'));
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

  const savedCurrency = window.localStorage.getItem('baseCurrency');
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
  window.localStorage.setItem('baseCurrency', baseCurrency);
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
    // document.getElementById('result').innerText = 'Please enter a valid takehome amount.';
    return;
  }

  const takehomeInUSD = takehome / baseRate;
  const estimate = takehomeInUSD / 0.9;
  const feeInUSD = estimate * serviceFee;
  const billedToClient = estimate * (1 + serviceFee);

  document.getElementById('estimate').innerHTML = `$${estimate.toFixed(2)}`;
  document.getElementById('billed').innerHTML = `$${billedToClient.toFixed(2)}`;
  document.getElementById('fee').innerHTML = `$${feeInUSD.toFixed(2)}`;
}

function showNotification() {
  const notification = document.getElementById('notification');
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

window.onload = function () {
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

  // Set default selected fee to 17.5%
  const defaultFeeBtn = document.querySelector('.service-fee-btn[data-fee="17.5"]');
  if (defaultFeeBtn) {
    defaultFeeBtn.classList.add('bg-indigo-600', 'text-white');
    defaultFeeBtn.classList.remove('bg-white', 'text-gray-900');
  }

  calculate();
};



// Select all elements with the class 'click-to-copy'
const clickToCopyElements = document.querySelectorAll('.click-to-copy');

// Iterate over each element and add a click event listener
clickToCopyElements.forEach(container => {
  container.addEventListener('click', function () {
    console.log('Clicked on the element');

    // Get the first contained span element with the class 'value-field'
    const valueContainer = this.querySelector('.value-field');

    // Get the inner text of the span and remove any $ symbol to get only the numerical value
    const estimateText = valueContainer.innerText;
    const numericValue = estimateText.replace(/^\$/, '');

    // Copy the value to the clipboard
    navigator.clipboard.writeText(numericValue).then(() => {
      console.log('Copied to clipboard');

      // Add visual effects to the container
      const originalText = valueContainer.innerText;

      // Change border color and text color
      this.classList.add('border-green-500', 'text-green-500');
      valueContainer.innerHTML = '<span style="color:green">Copied</span>';

      // Reset the styles and text after 2 seconds
      setTimeout(() => {
        this.classList.remove('border-green-500', 'text-green-500');
        valueContainer.innerText = originalText;
      }, 500);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  });
});
