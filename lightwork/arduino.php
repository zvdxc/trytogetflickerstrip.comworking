<?php header("Content-Type: text/plain"); ?>
<?php header("Content-Disposition: inline"); ?>
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

//IMPORTANT: Update the pin and length to match your LED strip!
#define PIN 5
#define LENGTH 150

Adafruit_NeoPixel strip = Adafruit_NeoPixel(LENGTH, PIN, NEO_GRB + NEO_KHZ800);
<?php 
if (isset($_GET['id'])) {
    require("../../lightwork_db.php");
    try {
        # MySQL with PDO_MYSQL
        $pdo = new PDO("mysql:host=$dbcredentials[host];dbname=$dbcredentials[dbname]", $dbcredentials["user"], $dbcredentials["password"]);
    } catch(PDOException $e) {
        echo "ERROR: ".$e->getMessage();
    } 
    $statement = $pdo->prepare("SELECT payload FROM lightworks WHERE id=:id LIMIT 1");
    
    $statement->execute([':id' => intval($_GET["id"])]);
    $row = $statement->fetch();

    $data = $row["payload"];
} else {
    $data = $_GET['data'];
}

$b64 = str_replace(' ','+',$data);
$raw = base64_decode($b64);
$spl = explode("\n\n",$raw,2);
$info = $spl[0];
$data = $spl[1];
$fields = explode(",",$info);

$name=$fields[0];
$frames=$fields[1];
$fps=$fields[2];
$pixels=$fields[3];

$dataString = "";
for ($i=0; $i<strlen($data); $i++) {
    if ($i != 0) $dataString .= ",";
    $dataString .= ord($data[$i]);
}
$dataString = "{".$dataString."}";
?>

int pixels = <?php echo $pixels; ?>;
int frames = <?php echo $frames; ?>;
int fps = <?php echo $fps; ?>;
byte data[] = <?php echo $dataString; ?>;

void setup() {
  strip.begin();
  strip.show();
}

int cframe = 0;
void loop() {
    for (int i=0; i<LENGTH; i++) {
        int cpixel = i % pixels;
        int index = cframe*pixels*3 + cpixel*3;
        strip.setPixelColor(i,data[index],data[index+1],data[index+2]);
    }
    strip.show();
    cframe ++;
    if (cframe >= frames) cframe = 0;
    delay(1000/fps);
}

