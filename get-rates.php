<?php

// Load environment variables from .env file
$env = parse_ini_file(".env");
$key = $env['EXCHANGERATE_API_KEY'];

$cacheDuration = (int)$env['EXCHANGERATE_CACHE_DURATION'];

// Force refresh when accessed directly, otherwise check cache
if (basename($_SERVER['SCRIPT_FILENAME']) == basename(__FILE__) || !file_exists("rates/rates.json") || (time() - filemtime("rates/rates.json") > $cacheDuration)) {
  $url = "https://v6.exchangerate-api.com/v6/$key/latest/USD";

  $response = file_get_contents($url);

  // write the response to a file
  file_put_contents("rates/rates.json", $response);

  // save the timestamp to a file
  // file_put_contents("rates/timestamp.txt", time());
}

// read the rates.json file
$json = file_get_contents("rates/rates.json");
// $data = json_decode($json, true);

// Only output JSON when this file is accessed directly, not when included
if (basename($_SERVER['SCRIPT_FILENAME']) == basename(__FILE__)) {
  // return the data
  header("Content-Type: application/json");
  echo $json;
}
