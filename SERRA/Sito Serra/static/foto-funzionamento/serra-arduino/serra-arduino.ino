#include <Stepper.h>    //libreria per motore passo-passo
#include <DHT.h>        //libreria DHT11

#define DHT_TYPE 11
#define DHT_PIN 2
#define LED_DHT 3
#define LED_WATER 4
#define RELAY_LEDS 5
#define RELAY_POMPA1 6
#define RELAY_POMPA2 7
#define RELAY_POMPA3 8
#define RELAY_MOTORE_CONTROLLO 9
#define RELAY_MOTORE1 10
#define RELAY_MOTORE2 11
#define RELAY_MOTORE3 12
#define RELAY_MOTORE4 13
#define FOTO_PIN A0
#define IGRO1 A2
#define IGRO2 A3
#define IGRO3 A4
#define WATER_PIN A5

#define SOGLIA_ACQUA      150              //soglie da impostare più tardi nel codice
#define SOGLIA_LUCE      100               //
#define SOGLIA_TEMP       28               //
#define SOGLIA_UMIDTERR   850              //

DHT dht(DHT_PIN, DHT_TYPE);                //dichiarazione esistenza DHT11

const int PassiRivoluzione = 1024;                                                                        //dichiarazione motore passo-passo
Stepper myStepper(PassiRivoluzione, RELAY_MOTORE1, RELAY_MOTORE2, RELAY_MOTORE3, RELAY_MOTORE4);          //
 
bool motore_attivo = false;      //variabile globale per memorizzazione

void setup() {
  Serial.begin(9600);            //permette di impostare la comunicazione seriale definendo la velocità della comunicazione in bits per second (baud)

  pinMode(LED_DHT, OUTPUT);                         //inizializzazione di tutti i nostri pin in uscita come OUTPUT
  pinMode(LED_WATER, OUTPUT);                       //
  pinMode(RELAY_LEDS, OUTPUT);                      //
  pinMode(RELAY_POMPA1, OUTPUT);                    //
  pinMode(RELAY_POMPA2, OUTPUT);                    //
  pinMode(RELAY_POMPA3, OUTPUT);                    //
  pinMode(RELAY_MOTORE_CONTROLLO, OUTPUT);          //

  digitalWrite(LED_DHT, LOW);                          //inizializzazione di tutti i nostri pin in uscita a LOW
  digitalWrite(LED_WATER, LOW);                        //
  digitalWrite(RELAY_LEDS, LOW);                       //
  digitalWrite(RELAY_POMPA1, LOW);                     //
  digitalWrite(RELAY_POMPA2, LOW);                     //
  digitalWrite(RELAY_POMPA3, LOW);                     //
  digitalWrite(RELAY_MOTORE_CONTROLLO, LOW);           //

  myStepper.setSpeed(17);                              //settaggio di velocità motore passo-passo
  dht.begin();                                         //inizializzazione DHT11

  delay(1000);       //piccolo delay
}

void loop() {
  float Temp = dht.readTemperature();                                        //rilevazione del valore temperatura come variabile Temp
  float UmidAria = dht.readHumidity();                                       //rilevazione del valore umidità in aria come variabile UmidAria
  float UmidTerr1 = (float(analogRead(IGRO1)) / 1023.0) * 100.0;             //rilevazione del valore dell'umidità nel terreno ed immediata trasformazione in risultato rappresentato come percentuale 
  float UmidTerr2 = (float(analogRead(IGRO2)) / 1023.0) * 100.0;             //rilevazione del valore dell'umidità nel terreno ed immediata trasformazione in risultato rappresentato come percentuale 
  float UmidTerr3 = (float(analogRead(IGRO3)) / 1023.0) * 100.0;             //rilevazione del valore dell'umidità nel terreno ed immediata trasformazione in risultato rappresentato come percentuale 
  int LivAcqua = analogRead(WATER_PIN)                                       //rilevazione del valore del livello dell'acqua come variabile LivAcqua
  int LivLuce = analogRead(FOTO_PIN)                                         //rilevazione del valore lella luminosità come variabile LivLuce
  
  Serial.print(Temp);                         //Printing dei valori come tupla per facilitare il raccoglimento dei valori al database MySQL
  Serial.print(", ");                         //
  Serial.print(UmidAria);                     //
  Serial.print(", ");                         //
  Serial.print(UmidTerr1);                    //
  Serial.print(", ");                         //
  Serial.print(UmidTerr2);                    //
  Serial.print(", ");                         //
  Serial.print(UmidTerr3);                    //
  Serial.print(", ");                         //
  Serial.print(LivAcqua);                     //
  Serial.print(", ");                         //
  Serial.println(LivLuce);                    //

  if (LivAcqua < SOGLIA_ACQUA) {      //condizione serbatoio in esaurimento
    digitalWrite(LED_WATER, HIGH);
  } else {
    digitalWrite(LED_WATER, LOW);
  }

  if (LivLuce < SOGLIA_LUCE) {        //condizione per illuminazione nella serra
    digitalWrite(RELAY_LEDS, HIGH);
  } else {
    digitalWrite(RELAY_LEDS, LOW);
  }

  if (Temp > SOGLIA_TEMP) {          //condizione LED per Temperatura elevata
    digitalWrite(LED_DHT, HIGH);
  } else {
    digitalWrite(LED_DHT, LOW);
  }
  
  if (digitalWrite(LED_WATER) == LOW && UmidTerr1 < SOGLIA_TERR) {  //condizione partenza pompa1
    digitalWrite(RELAY_POMPA1, HIGH);
  } else {
    digitalWrite(RELAY_POMPA1, LOW);
  }

  if (digitalWrite(LED_WATER) == LOW && UmidTerr2 < SOGLIA_TERR) {  //condizione partenza pompa2
    digitalWrite(RELAY_POMPA2, HIGH);
  } else {
    digitalWrite(RELAY_POMPA2, LOW);
  }

  if (digitalWrite(LED_WATER) == LOW && UmidTer3 < SOGLIA_TERR) {   //condizione partenza pompa3
    digitalWrite(RELAY_POMPA3, HIGH);
  } else {
    digitalWrite(RELAY_POMPA3, LOW);
  }

  if (digitalWrite(LED_DHT) == HIGH) {          //condizione LED per avvio motore/apertura sportello e chiusura sportello
    if (!motore_attivo) {             
      motore_attivo = true;
      myStepper.step(PassiRivoluzione * 2.75);
    }
  } else {
    digitalWrite(LED_DHT, LOW);
    if (motore_attivo) {           
      motore_attivo = false;
      myStepper.step(-PassiRivoluzione * 2.75);
    }
  }

  delay(1000);        //delay finale del loop di 1sec
}
