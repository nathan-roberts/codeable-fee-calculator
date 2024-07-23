# Codeable Fee Calculator

Welcome to the Codeable Fee Calculator! This application helps you calculate service fees and determine the total amount billed to clients, including the effect of different exchange rates.

## Live Demo

You can try out the application [here](https://codeable-fee-calculator.pages.dev/).

## Repository

You can access the source code on GitHub: [codeable-fee-calculator](https://github.com/nathan-roberts/codeable-fee-calculator).

## Setup

### 1. Get a Free API Token

To use the exchange rate features, you need an API token. You can get one for free at [ExchangeRate-API](https://www.exchangerate-api.com/).

### 2. Install Tailwind CSS

To build the CSS file for the project, use the following command:

```bash
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```


### 3. Project Structure

-	index.html: The main HTML file for the application.
-	script.js: Contains JavaScript for handling the calculations, currency exchange rates, and user interactions.
-	src/input.css: Input CSS file for Tailwind CSS.
-	src/output.css: Output CSS file for Tailwind CSS (generated).

### 4. JavaScript Code

### The script.js file includes the following functionalities:

-	Button Click Handling: Updates the service fee selection and triggers a recalculation when a fee button is clicked.
-	Fetch Exchange Rates: Retrieves exchange rates from the API and updates the dropdown with available currencies.
-	Currency Rate Handling: Updates the currency options based on the fetched rates and saves the selected currency.
-	Calculation Logic: Computes the estimated and billed amounts based on user inputs and the selected service fee.
-	Notification System: Displays a notification when the exchange rates are updated.
-	Cookie Management: Stores and retrieves data such as API keys and user preferences using cookies.

### 5. HTML Structure

-	API Key Input: Allows users to enter their API key.
-	Service Fee Buttons: Lets users select the service fee percentage.
-	Currency Selector: Dropdown for choosing the base currency.
-	Calculation Inputs: Input field for the take-home amount and areas to display the results.
-	Notifications: Displays notifications when exchange rates are updated.

### 6. Usage

1.	Enter API Key: On the first load, enter your API key to access exchange rates.
2.	Select Service Fee: Choose a service fee percentage from the provided buttons.
3.	Input Take-Home Amount: Enter the amount you wish to take home after fees.
4.	Select Currency: Choose the base currency from the dropdown.
5.	View Results: The application will display the estimated amount and the total billed to the client.

Built with ❤️ by Nathan Roberts.