<?php
require_once 'vendor/autoload.php';

$clientID = 'email auth';
$clientSecret = 'password mue';
$redirectUri = 'http://localhost/mindsoothe(1)/google_callback.php';

$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope("email");
$client->addScope("profile");

echo $client->createAuthUrl();
?>
