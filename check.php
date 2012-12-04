<?php

/* I don't know how to write php. Sorry. */

function log2($str) {
    //echo $str . "\n";
}

$statsDir = "stats/";
$gamesDir = "games/";

$ip = $_SERVER['REMOTE_ADDR'];
$ua = $_SERVER['HTTP_USER_AGENT'];
$time = $_SERVER['REQUEST_TIME'];

$plausible = true;

// parse JSON
$requestText = file_get_contents("php://input");

try {
    $data = json_decode($requestText);
} catch (Exception $e) {
    log2("request text is not a vaild JSON string");
    $plausible = false;
}


// check that no extra key is present    
$expectedKeys = array("lang", "name", "state", "timeLeft", "found", "missing", "check");

if ($plausible) {
    foreach ($data as $key => $value) {
        if (in_array($key, $expectedKeys) === false) {
            $plausible = false;
            log2("key " . $key . " was unexpected");
            break;
        }
    }
}
    
// check that all expected keys are present
if ($plausible) {
    foreach ($expectedKeys as $key) {
        if (!array_key_exists($key, $data)) {
            $plausible = false;
            log2("key " . $key . " is missing");
            break;
        }
    }
}

// check key lang
if ($plausible) {
    $lang = $data->lang;
    
    if (!(is_string($lang) && ($lang === "en" || $lang === "de"))) {
        $plausible = false;
        log2("lang is invalid");
    }
}

// check key name
if ($plausible) {
    $name = $data->name;
    
    if (is_string($name)) {
        if (!file_exists($gamesDir . $name . ".js")) {
            $plausible = false;
            log2("game does not exists");
        }
    } else {
        $plausible = false;
        log2("name is invalid");
    }
}

// check key state
if ($plausible) {
    $state = $data->state;
    
    if (!(is_string($state) && ($state === "cancel" || $state === "end" || $state === "finished"))) {
        $plausible = false;
        log2("state is invalid");
    }
}

// check key timeLeft
if ($plausible) {
    $timeLeft = $data->timeLeft;
    
    if (is_int($timeLeft)) {
        if ($timeLeft < 0) {
            $plausible = false;
            log2("timeLeft is negative");
        } else if ($timeLeft === 0 && $state !== "end") {
            $plausible = false;
            log2("timeLeft does not match state");
        }
    } else {
        $plausible = false;
        log2("timeLeft is not an integer");
    }
}

// check key found
if ($plausible) {
    $found = $data->found;
    
    if (!(is_array($found))) {
        $plausible = false;
        log2("found is invalid");
    }
}

// check key missing
if ($plausible) {
    $missing = $data->missing;
    
    if (!(is_array($missing))) {
        $plausible = false;
        log2("missing is invalid");
    }
}

// check key check
if ($plausible) {
    $check = $data->check;
    
    if (is_string($check)) {
        $serverCheck = preg_replace('/[^0-9a-f]/', '', strtolower($ua));
        
        if (strpos($check, $serverCheck) !== 0) {
            $plausible = false;
            log2("check does not match to ua");
        }
    } else {
        $plausible = false;
        log2("check is not a string");
    }
}

$logentry = array('ip' => $ip, 'ua' => $ua, 'data' => $data, 'plausible' => $plausible, 'time' => $time);
$logFileName = $statsDir . date("Y-m-d") . ".js";

if (is_writable($statsDir)) {
    file_put_contents($logFileName, json_encode($logentry) . ",\n", FILE_APPEND | LOCK_EX);
}

log2($plausible ? "yep" : "nope");
?>
