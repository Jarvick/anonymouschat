<?php
/**
 * Created by PhpStorm.
 * User: HiTech_OWC_B
 * Date: 26.01.2017
 * Time: 16:48
 */

use Ratchet\Server\IoServer;
//use MyApp\Chat;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Server;

//require dirname(__DIR__) . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/ch_class.php';

/*
$server = IoServer::factory(
    new Chat(),
    8080
);*/
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    8080
);

$server->run();