<?php
/**
 * Created by PhpStorm.
 * User: HiTech_OWC_B
 * Date: 26.01.2017
 * Time: 16:46
 */

//namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Monolog\Logger;
use Monolog\Handler;
use Monolog\Handler\StreamHandler;

$logger = new Logger('MainLogger');
$logger->pushHandler(new StreamHandler( __DIR__ . '/logs/log.txt', Logger::DEBUG));

class Chat implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
        global $logger;
        $logger->warning('onOpen');
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $numRecv = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send($msg);
            }
        }
        global $logger;
        $logger->warning('onMessage');
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
        global $logger;
        $logger->warning('onClose');
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        global $logger;
        $logger->warning('onError');
        $conn->close();
    }
}