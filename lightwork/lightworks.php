<?php

require("../../lightwork_db.php");

function tableExists($pdo, $table) {

    // Try a select statement against the table
    // Run it in try/catch in case PDO is in ERRMODE_EXCEPTION.
    try {
        $result = $pdo->query("SELECT 1 FROM $table LIMIT 1");
    } catch (Exception $e) {
        // We got an exception == table not found
        return FALSE;
    }

    // Result is either boolean FALSE (no table found) or PDOStatement Object (table found)
    return $result !== FALSE;
}

function isBase64($in) {
    return preg_match("|^[a-zA-Z0-9+/]+={0,2}$|",$in) === 1;
}

try {
    # MySQL with PDO_MYSQL
    $pdo = new PDO("mysql:host=$dbcredentials[host];dbname=$dbcredentials[dbname]", $dbcredentials["user"], $dbcredentials["password"]);
} catch(PDOException $e) {
    echo "ERROR: ".$e->getMessage();
} 

$lightworksTable = "lightworks";
if (!tableExists($pdo,$lightworksTable)) {
    echo "Creating table";
    $columns = "id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ip VARCHAR(20), payload MEDIUMTEXT";
    if (!$pdo->exec("CREATE TABLE IF NOT EXISTS $lightworksTable ($columns)")) {
        header('Content-Type: application/json');
        echo json_encode(["message"=>"FAILED TO CREATE TABLE","error"=>$pdo->errorInfo()]);
        print_r();
    }
}

if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_GET["create"])) {
    $postdata = file_get_contents("php://input");

    if (!isBase64($postdata)) {
        header('Content-Type: application/json');
        echo json_encode(["error"=>"INVALID DATA"]);
        return;
    }
    
    $query = sprintf("INSERT INTO lightworks VALUES (NULL,NULL,\"%s\",\"%s\")",$_SERVER["REMOTE_ADDR"],$postdata);
    if (!$pdo->exec($query)) {
        header('Content-Type: application/json');
        echo json_encode(["message"=>"Failed to insert record","error"=>$pdo->errorInfo()]);
        return;
    }

    header('Content-Type: application/json');
    echo json_encode(["id"=>$pdo->lastInsertId()]);
} else if ($_SERVER['REQUEST_METHOD'] == "GET" && isset($_GET["id"])) {
    $statement = $pdo->prepare("SELECT payload FROM lightworks WHERE id=:id LIMIT 1");
    
    $statement->execute([':id' => intval($_GET["id"])]);
    $row = $statement->fetch();

    $lightwork = $row["payload"];

    header('Content-Type: application/json');
    echo json_encode(["body"=>$lightwork]);
} else if ($_SERVER['REQUEST_METHOD'] == "GET" && isset($_GET["list"])) {
    $statement = $pdo->prepare("SELECT * FROM lightworks");
    
    $statement->execute();
    $rows = $statement->fetchAll();

    $outrows = [];
    foreach ($rows as $row) {
        $outrows[] = [
            "id" => $row['id'],
            "created" => $row['created'],
            "payload" => $row['payload'],
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($outrows);
}
