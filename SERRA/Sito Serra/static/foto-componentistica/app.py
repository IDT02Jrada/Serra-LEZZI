from flask import Flask, render_template, request, url_for, redirect, session
from flask_mysqldb import MySQL
import MySQLdb.cursors

app=Flask(__name__)
app.secret_key="SerraITSAR"
app.config["DEBUG"]= True

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'dbserra'
mysql = MySQL(app)


@app.route("/")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM utenti WHERE username = %s AND password = %s', (username,password))
        user = cursor.fetchone()
        cursor.close()
        if not user:
            return render_template('html-forms/login.html', error='Le Credenziali sono errate.')
        session["username"] = username
        return redirect("/home")
    return render_template("html-forms/login.html")

@app.route('/registrazione', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nome = request.form['nome']
        cognome = request.form['cognome']
        sesso = request.form['sesso']
        username = request.form['username']
        password = request.form['password']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('INSERT INTO utenti (nome, cognome, sesso, username, password) VALUES (%s, %s, %s, %s, %s)', (nome, cognome, sesso, username, password))
        mysql.connection.commit()
        cursor.close()
        return redirect("/home")
    return render_template('html-forms/registrazione.html')

@app.route("/home")
def home():
    username=session["username"]
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM utenti WHERE username = %s', (username,))
    user = cursor.fetchone()
    cursor.close()
    return render_template("html-indici/home.html", nome=username, sesso=user["sesso"])

@app.route("/piante")
def piante():
    return render_template("html-indici/piante.html")

@app.route("/piante/dettagli-pianta1")
def dettagli_pianta1():
    return render_template("html-dettagli-piante/dettagli-pianta1.html")

@app.route("/piante/dettagli-pianta2")
def dettagli_pianta2():
    return render_template("html-dettagli-piante/dettagli-pianta2.html")

@app.route("/piante/dettagli-pianta3")
def dettagli_pianta3():
    return render_template("html-dettagli-piante/dettagli-pianta3.html")



@app.route("/componentistica")
def componentistica():
    return render_template("html-indici/componentistica.html")

@app.route("/componentistica/struttura")
def struttura():
    return render_template("html-componentistica/struttura.html")

@app.route("/componentistica/sensori")
def sensori():
    return render_template("html-componentistica/sensori.html")

@app.route("/componentistica/attuatori")
def attuatori():
    return render_template("html-componentistica/attuatori.html")


@app.route("/funzionamento")
def funzionamento():
    return render_template("html-indici/funzionamento.html")

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port= 5500
    )