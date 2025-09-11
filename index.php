<?php require_once 'get-rates.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Codeable Fee Calculator</title>
  <!-- Tailwind CSS CDN -->
  <link href="./src/output.css" rel="stylesheet">
  <!-- <script src="https://unpkg.com/@heroicons/react/24/outline/copy.svg"></script> -->

  <meta name="theme-color" content="#14404d">
  <link rel="manifest" crossorigin="use-credentials" href="/manifest.json">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Codeable Calculator">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="msapplication-starturl" content="https://codeable-fee-calculator.pages.dev/">


</head>

<body class="flex justify-center items-center h-screen bg-gray-100">

  <div class="block p-8 w-full max-w-md bg-white rounded-lg shadow-lg" id="calculator-container">
    <h2 class="mb-6 text-2xl font-bold text-center">Codeable Fee Calculator</h2>
    <div class="flex flex-col items-center">
      <label for="serviceFee" class="block text-sm font-medium text-gray-700">Service Fee (%)</label>
      <div id="serviceFee" class="inline-flex mt-2 mb-4 rounded-md shadow-sm" role="group">
        <button type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border-gray-200 service-fee-btn rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700"
          data-fee="17.5">17.5%</button>

        <button type="button"
          class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 service-fee-btn rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700"
          data-fee="15">15%</button>
      </div>
    </div>
    <div class="flex flex-col gap-2 justify-center items-center p-4 py-4 mb-4 h-32 rounded-md dark:text-gray-700">
      <div class="relative mt-2 rounded-md shadow-sm">
        <!-- <div class="flex hidden absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <span class="text-lg text-gray-500" id="currency-marker">$</span>
        </div> -->
        <input oninput="calculate()" type="text" name="takehome" id="takehome"
          class="block py-1.5 pr-36 pl-7 w-full text-4xl font-bold text-right text-gray-900 rounded-md border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
          placeholder="0.00">
        <div class="flex absolute inset-y-0 right-0 items-center">
          <label for="baseRate" class="sr-only">Currency</label>
          <select id="baseRate" onchange="handleCurrencyChange()" name="baseRate"
            class="py-0 pr-7 pl-2 h-full text-gray-500 bg-transparent rounded-md border-0 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
          </select>
        </div>
      </div>
      <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Take Home After Fees</label>
    </div>

    <div id="rates"></div>

    <div id="notification"
      class="hidden relative px-4 py-3 mb-4 text-green-700 bg-green-100 rounded border border-green-400" role="alert">
      <strong class="font-bold">Currency rates updated!</strong>
      <span class="block sm:inline">The exchange rates have been refreshed.</span>
    </div>
    <div
      class="flex relative flex-col gap-2 justify-center items-center p-4 mb-4 h-32 rounded-md border-4 border-dashed transition-colors border-gray-500/50 dark:text-gray-700 click-to-copy"
      id="estimate-container">
      <div class="flex gap-2 items-center">
        <span class="text-3xl font-bold value-field md:text-4xl" id="estimate">
          $$$
        </span>
      </div>
      <span class="text-sm font-semibold text-center">Estimate</span>
    </div>

    <div
      class="flex flex-col gap-2 justify-center items-center p-4 mb-4 h-32 rounded-md border-4 border-dashed border-gray-500/50 dark:text-gray-700 click-to-copy">
      <div class="flex gap-2 items-center">
        <span class="text-3xl font-bold value-field md:text-4xl" id="fee">
          $$$
        </span>
      </div>
      <span class="text-sm font-semibold text-center">Fees</span>
    </div>



    <div
      class="flex flex-col gap-2 justify-center items-center p-4 mb-4 h-32 rounded-md border-4 border-dashed border-gray-500/50 dark:text-gray-700 click-to-copy">
      <div class="flex gap-2 items-center">
        <span class="text-3xl font-bold value-field md:text-4xl" id="billed">
          $$$
        </span>
      </div>
      <span class="text-sm font-semibold text-center">Billed to Client</span>
    </div>
  </div>

  <!-- Link to the external JavaScript file -->
  <script src="./script.js"></script>


  <div id="sticky-banner" tabindex="-1"
    class="flex fixed bottom-0 z-50 justify-between p-4 w-full bg-gray-50 border-b border-gray-200 start-0 dark:bg-gray-700 dark:border-gray-600">
    <div class="flex items-center mx-auto">
      <p class="flex items-center space-x-2 text-sm font-normal text-gray-500 dark:text-gray-400">
        <span
          class="inline-flex flex-shrink-0 justify-center items-center p-1 w-6 h-6 bg-gray-200 rounded-full me-3 dark:bg-gray-600">
          <svg class="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
            fill="currentColor" viewBox="0 0 18 19">
            <path
              d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z" />
          </svg>
          <span class="sr-only">Light bulb</span>
        </span>
        <span class="flex items-center space-x-1">
          <span>Built with</span>
          <img src="arrow-down.webp" alt="Arrow Down" style="width: 26px; height: 26px; vertical-align: middle;" />
          <span>by Nathan Roberts</span>
        </span>
        <a href="https://github.com/nathan-roberts/codeable-fee-calculator"
          class="text-sm hover:text-blue-600 hover:underline">
          Github Repository
        </a>
      </p>
    </div>
  </div>

</body>

</html>