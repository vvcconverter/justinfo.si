<?php
header("Content-Type: text/html; charset=utf-8");

$url = "https://vod-ka.bet/rkn-block-site/index.html";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$html = curl_exec($ch);
curl_close($ch);

echo $html;

?>
