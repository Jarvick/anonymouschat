<?php
/**
 * Created by PhpStorm.
 * User: Lime
 * Date: 27.01.2017
 * Time: 1:01
 */
//phpinfo();
$password = 'awfafawf323111';
$pwdhash =  password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
echo $pwdhash . '<br>';
if (password_verify($password, $pwdhash)) {
    // Success!
    echo 'Success!';
}
else {
    // Invalid credentials
    echo 'Invalid credentials!';
}


/*$timeTarget = 1.25; // 50 milliseconds

$cost = 8;
do {
    $cost++;
    $start = microtime(true);
    password_hash("test", PASSWORD_BCRYPT, ["cost" => $cost]);
    $end = microtime(true);
} while (($end - $start) < $timeTarget);

echo "Appropriate Cost Found: " . $cost . "\n"; */