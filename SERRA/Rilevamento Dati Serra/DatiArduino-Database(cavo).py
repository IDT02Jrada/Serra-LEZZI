import mysql.connector
from mysql.connector import Error
import serial
import threading

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
    PORTA_SERIALE = "COM3"
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
