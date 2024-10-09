# Panoramica del Progetto

Questo progetto è un sito web locale sviluppato con Python (Flask), HTML, CSS e JavaScript, che permette di monitorare in tempo reale una serra automatizzata. Il sistema è progettato per fornire una panoramica completa delle condizioni interne della serra, inclusi i valori di temperatura, umidità, luminosità, livello dell'acqua nel serbatoio e umidità del terreno per tre piante: basilico, prezzemolo e menta.

## Componenti

<details>
<summary>Sistema di Monitoraggio Ambientale Basato su Arduino</summary>
Il progetto utilizza diversi sensori ed attuatori connessi ad Arduino per automatizzare e monitorare la serra. Un DHT11 rileva temperatura e umidità interne, mentre un fotoresistore misura la luminosità. Il livello dell'acqua nel serbatoio è monitorato dal sensore apposito, e tre igrometri misurano l'umidità del terreno per basilico, prezzemolo e menta. Cinque relè controllano altrettanti attuatori: uno gestisce un motore passo-passo per aprire lo sportello della serra se la temperatura supera una soglia; uno accende una strip LED per l'illuminazione interna; e tre attivano le pompe d'acqua per irrigare le piante quando l'umidità del terreno scende sotto il livello desiderato.
</details>

<details>
<summary>Sistema di Raccolta Dati Basato su Python</summary>
Nel progetto, utilizzo XAMPP per gestire un server Apache e un database MySQL. La connessione al database MySQL viene stabilita tramite il modulo "mysql.connector" in Python, che permette di interagire con il database per salvare i dati rilevati dai sensori della serra automatizzata.
</details>

## Descrizione dei File

<details>
<summary>File 1: Codice Arduino</summary>
Il codice Arduino gestisce il monitoraggio ambientale. Le sezioni chiave includono:

**Librerie, Definizioni e Variabili globali**:
```cpp
#include <Stepper.h>    // Libreria per motore passo-passo
#include <DHT.h>        // Libreria DHT11

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

#define SOGLIA_ACQUA      150              // Soglie da impostare più tardi nel codice
#define SOGLIA_LUCE      270               //
#define SOGLIA_TEMP       32               //
#define SOGLIA_UMID_TERR1 40               // soglia per pianta1 in base a ricerche online
#define SOGLIA_UMID_TERR2 50               // soglia per pianta2 in base a ricerche online
#define SOGLIA_UMID_TERR3 60               // soglia per pianta3 in base a ricerche online

DHT dht(DHT_PIN, DHT_TYPE);                // Dichiarazione esistenza DHT11

const int PassiRivoluzione = 1024;                                                                        // Dichiarazione motore passo-passo
Stepper myStepper(PassiRivoluzione, RELAY_MOTORE1, RELAY_MOTORE2, RELAY_MOTORE3, RELAY_MOTORE4);          //
 
bool motore_attivo = false;      // Variabile globale per memorizzazione
```

**Funzione di Setup**:
```cpp
void setup() {
  Serial.begin(9600);            // Impostare la comunicazione seriale definendo la velocità in bits per second (baud)

  pinMode(LED_DHT, OUTPUT);                         // Inizializzazione di tutti i nostri pin in uscita come OUTPUT
  pinMode(LED_WATER, OUTPUT);                       //
  pinMode(RELAY_LEDS, OUTPUT);                      //
  pinMode(RELAY_POMPA1, OUTPUT);                    //
  pinMode(RELAY_POMPA2, OUTPUT);                    //
  pinMode(RELAY_POMPA3, OUTPUT);                    //
  pinMode(RELAY_MOTORE_CONTROLLO, OUTPUT);          //

  digitalWrite(LED_DHT, LOW);                          // Inizializzazione di tutti i nostri pin in uscita a LOW
  digitalWrite(LED_WATER, LOW);                        //
  digitalWrite(RELAY_LEDS, LOW);                       //
  digitalWrite(RELAY_POMPA1, LOW);                     //
  digitalWrite(RELAY_POMPA2, LOW);                     //
  digitalWrite(RELAY_POMPA3, LOW);                     //
  digitalWrite(RELAY_MOTORE_CONTROLLO, LOW);           //

  myStepper.setSpeed(17);                              // Settaggio di velocità motore passo-passo
  dht.begin();                                         // Inizializzazione DHT11

  delay(1000);       // Piccolo delay
}
```

**Funzione di Loop**:
```cpp
void loop() {
  float Temp = dht.readTemperature();                                        // Rilevazione del valore temperatura come variabile Temp
  float UmidAria = dht.readHumidity();                                       // Rilevazione del valore umidità in aria come variabile UmidAria
  float SeccTerr1 = (float(analogRead(IGRO1)) / 1023.0) * 100.0;             // Rilevazione del valore dell'umidità nel terreno ed immediata trasformazione in risultato percentuale di Secchezza
  float UmidTerr1 = 100.0 - SeccTerr1;                                       // Tramite la percentuale di Secchezza chiediamo di visualizzare la percentuale di Umidità
  float SeccTerr2 = (float(analogRead(IGRO2)) / 1023.0) * 100.0;             // Rilevazione del valore dell'umidità nel terreno ed immediata trasformazione in risultato percentuale di Secchezza 
  float UmidTerr2 = 100.0 - SeccTerr2;                                       // Tramite la percentuale di Secchezza chiediamo di visualizzare la percentuale di Umidità
  float SeccTerr3 = (float(analogRead(IGRO3)) / 1023.0) * 100.0;             // Rilevazione del valore dell'umidità nel terreno ed immediata trasformazione in risultato percentuale di Secchezza 
  float UmidTerr3 = 100.0 - SeccTerr3;                                       // Tramite la percentuale di Secchezza chiediamo di visualizzare la percentuale di Umidità
  int LivAcqua = analogRead(WATER_PIN);                                      // Rilevazione del valore del livello dell'acqua come variabile LivAcqua
  int LivLuce = analogRead(FOTO_PIN);                                        // Rilevazione del valore della luminosità come variabile LivLuce
  
  Serial.print(Temp);                         // Printing dei valori come tupla per facilitare il raccoglimento dei valori al database MySQL
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

  if (LivAcqua < SOGLIA_ACQUA) {      // Condizione serbatoio in esaurimento
    digitalWrite(LED_WATER, HIGH);
  } else {
    digitalWrite(LED_WATER, LOW);
  }

  if (LivLuce > SOGLIA_LUCE) {        // Condizione per illuminazione nella serra
    digitalWrite(RELAY_LEDS, HIGH);
  } else {
    digitalWrite(RELAY_LEDS, LOW);
  }

  if (Temp > SOGLIA_TEMP) {          // Condizione LED per Temperatura elevata
    digitalWrite(LED_DHT, HIGH);
  } else {
    digitalWrite(LED_DHT, LOW);
  }
  
  if (digitalRead(LED_WATER) == LOW && UmidTerr1 < SOGLIA_UMID_TERR1) {  // Condizione partenza pompa1
    digitalWrite(RELAY_POMPA1, HIGH);
  } else {
    digitalWrite(RELAY_POMPA1, LOW);
  }

  if (digitalRead(LED_WATER) == LOW && UmidTerr2 < SOGLIA_UMID_TERR2) {  // Condizione partenza pompa2
    digitalWrite(RELAY_POMPA2, HIGH);
  } else {
    digitalWrite(RELAY_POMPA2, LOW);
  }

  if (digitalRead(LED_WATER) == LOW && UmidTerr3 < SOGLIA_UMID_TERR3) {   // Condizione partenza pompa3
    digitalWrite(RELAY_POMPA3, HIGH);
  } else {
    digitalWrite(RELAY_POMPA3, LOW);
  }

  if (digitalRead(LED_DHT) == HIGH) {          // Condizione LED per avvio motore/apertura sportello e chiusura sportello
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

  delay(1000);        // Delay finale del loop di 1 sec
}
```
</details>

<details>
<summary>File 2: Codice Python per Trasportare i dati rilevati dall'Arduino al Database</summary>
Il codice Python gestisce la raccolta dati e il loro inserimento nel database MySQL. Le sezioni chiave includono:

**Importazioni e Inizializzazione**:
```python
import mysql.connector
from mysql.connector import Error
import serial
import threading
```

**Ciclo Principale di Raccolta Dati**:
```python
def leggi_e_elabora_dati(ser):
    linea = ser.readline().decode('utf-8').strip()
    valoriLetti = linea.split(', ')

    try:
        temperatura = float(valoriLetti[0])
        umidita_aria = float(valoriLetti[1])
        umidita_terreno1 = float(valoriLetti[2])
        umidita_terreno2 = float(valoriLetti[3])
        umidita_terreno3 = float(valoriLetti[4])
        livello_acqua = float(valoriLetti[5])
        livello_luce = float(valoriLetti[6])
    except ValueError as ve:
        print(f"ValueError while converting sensor data: {ve}")
        return None, None, None, None, None

    print(f"Ricevuto Temperatura: {temperatura}, Umidità Aria: {umidita_aria}, Umidità Terreno Basilico: {umidita_terreno1}, Umidità Terreno Prezzemolo: {umidita_terreno2}, Umidità Terreno Menta: {umidita_terreno3}, Livello Acqua: {livello_acqua}, Livello Luminosità: {livello_luce}")
    return temperatura, umidita_aria, umidita_terreno1, umidita_terreno2, umidita_terreno3, livello_acqua, livello_luce

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='dbserra'
        )
        if connection.is_connected():
            print("Connected successfully")
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

def close_connection(connection):
    if connection and connection.is_connected():
        connection.close()
        print("Connection closed")

def modifica_database(connection, SQL_message):
    try:
        cursor = connection.cursor()
        cursor.execute(SQL_message)
        connection.commit()
    except Error as e:
        print(f"Error: {e}")
    finally:
        cursor.close()

def leggi_e_salva_dati(ser, db_connection, stop_event):
    while not stop_event.is_set():
        if ser.in_waiting > 0:
            temperatura, umidita_aria, umidita_terreno1, umidita_terreno2, umidita_terreno3, livello_acqua, livello_luce = leggi_e_elabora_dati(ser)
            if None in (temperatura, umidita_aria, umidita_terreno1, umidita_terreno2, umidita_terreno3, livello_acqua, livello_luce):
                continue

            if db_connection:
                try:
                    modifica_database(db_connection,
                        f"INSERT INTO datirilevati (temp, umid_aria, umid_terr1, umid_terr2, umid_terr3, liv_acqua, liv_lum) "
                        f"VALUES ({temperatura}, {umidita_aria}, {umidita_terreno1}, {umidita_terreno2}, {umidita_terreno3}, {livello_acqua}, {livello_luce})")
                except Error as e:
                    print(f"Database Error: {e}")

if __name__ == '__main__':
    PORTA_SERIALE = "COM6"
    BAUD_RATE = 9600

    try:
        ser = serial.Serial(PORTA_SERIALE, BAUD_RATE, timeout=1)
        if ser.is_open:
            print(f"Serial port {PORTA_SERIALE} opened successfully")
    except serial.SerialException as se:
        print(f"SerialException: {se}")
        ser = None

    if ser:
        db_connection = create_connection()
        stop_event = threading.Event()

        thread_DB = threading.Thread(target=leggi_e_salva_dati, args=(ser, db_connection, stop_event))
        thread_DB.start()

        try:
            while True:
                pass
        except KeyboardInterrupt:
            print("Interrupted by user, shutting down.")
            stop_event.set()
            thread_DB.join()

        ser.close()
        close_connection(db_connection)

    print("End execution")
```
</details>
