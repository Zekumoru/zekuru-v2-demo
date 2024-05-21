# Zekuru-v2 Demo

Questa è la versione demo di Zekuru-v2, un bot di traduzione per Discord!

## Introduzione

Stanco di barriere linguistiche nel tuo server Discord?

**Ecco Zekuru-v2, il bot di traduzione perfetto per Discord!!**

Ti ritrovi mai in un server Discord con canali dedicati a lingue diverse? Vuoi chattare con tutti, ma la traduzione delle lingue è un problema?

**Zekuru-v2 risolve tutto!**  

Collega i tuoi canali linguistici e chatta liberamente. Il bot traduce automaticamente i messaggi tra i canali, mantenendo la conversazione fluida. **Niente più copia-incolla o confusi comandi con emoji!**

Ecco cosa rende fantastico Zekuru-v2:

- **Traduzione senza sforzo:** Imposta semplicemente le lingue del tuo canale e chatta! Zekuru-v2 traduce i messaggi in modo fluido in background.
- **Potenza di DeepL:** Sperimenta le migliori traduzioni possibili, grazie alla tecnologia all'avanguardia di DeepL.
- **Comunicazione ricca:** Condividi immagini, adesivi, reazioni e allegati: tutto viene tradotto e consegnato!
- **Resta sincronizzato:** Modifica o elimina i messaggi: le modifiche si riflettono in tutte le versioni tradotte.

**Abbatti le barriere linguistiche e costruisci una community veramente globale sul tuo server Discord con Zekuru-v2!**

## Indice

1. [Introduzione](#introduzione)
2. [Prerequisiti](#prerequisiti)
3. [Installazione](#installazione)
4. [Lingue supportate](#lingue-supportate)
5. [Comandi](#comandi)
6. [Contribuire](#contribuire)
7. [Licenza](#licenza)

## Prerequisiti

Assicurati di avere installati [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) e [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable).

## Installazione

Per iniziare a chattare senza soluzione di continuità tra i tuoi canali con lingue diverse, segui questi passaggi:

1. Clona questo repository e accedi alla sua directory

```cmd
git clone git@github.com:Zekumoru/zekuru-v2-demo.git
cd zekuru-v2-demo
```

2. Installa le dipendenze necessarie

```cmd
yarn
```

3. Crea il file `.env` e copia-incolla le seguenti righe inserendo i valori corretti all'interno di quelle tra parentesi angolari `<>`.

```env
DISCORD_TOKEN=<DISCORD_TOKEN_HERE>
CLIENT_ID=<CLIENT_ID_HERE>
MONGODB_CONNECTION_STRING=<CONNECTION_STRING_HERE>
CIPHER_SECRET_KEY=<SECRET_KEY_HERE>
CHANNEL_LINK_LIMIT=5
DEBUG="zekuru-v2-demo:*"
```

- **DISCORD_TOKEN**

Per ottenere un token Discord, segui i passaggi nell'articolo [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) nella guida ufficiale di discord.js. Spiega anche cosa sia un token Discord.

- **CLIENT_ID**

Per sapere dove trovare l'ID client del tuo bot, controlla la sezione [Guild commands section](https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands) nella guida ufficiale di discord.js.

- **MONGODB_CONNECTION_STRING**

Per ottenere una stringa di connessione MongoDB, segui i due articoli nella documentazione ufficiale di MongoDB, in particolare le istruzioni per Atlas UI (a meno che tu non sia uno sviluppatore e sappia cosa stai facendo): [Create an Account](https://www.mongodb.com/docs/atlas/tutorial/create-atlas-account/) e [Deploy a Free Cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/).
La stringa di connessione MongoDB è simile a questa: `mongodb+srv://[username:password@]host[/[defaultauthdb][?options]]`. **Da qualche parte durante la distribuzione di un cluster gratuito ti verrà chiesto se includere la password nella stringa di connessione, aggiungila! A meno che tu non sappia cosa stai facendo.**

- **CIPHER_SECRET_KEY**

È come una password utilizzata per crittografare i dati. Serve per crittografare le chiavi API di Deepl inserite nel comando `/set`. Per creare una chiave segreta, esegui il seguente comando:

```cmd
yarn create-cipher-secret
```

**Non provare a fare il furbo e usare il generatore di chiavi segrete se non sai quello che stai facendo.**

> **ATTENZIONE: Non dimenticare di generare e inserire questa chiave segreta, altrimenti il bot utilizzerà la chiave predefinita `58061f4b4543d65ca7967a55ded720355d9b22307c2d665a501dba2d869e1116`.**

- **CHANNEL_LINK_LIMIT**

Questo è il numero di canali che **possono essere collegati** insieme. Non è il numero di canali a cui puoi assegnare una lingua. Il valore predefinito è 5.

- **DEBUG**

**Non provare a modificare il suo valore a meno che tu non sappia cosa stai facendo.** Questo viene usato per registrare l'output del bot.

4. E infine, avvia il bot!

```cmd
yarn start
```

> Per mantenere il bot in esecuzione in background, puoi consultare [pm2](https://pm2.keymetrics.io/), un gestore di processi. Utilizza il seguente comando per avviare il bot in background: `pm2 start ts-node --name "Zekuru-v2 Demo" -- --files app.ts`.

## Lingue supportate

Al momento della stesura, DeepL supporta 30 lingue:

- AR (Arabo)
- BG (Bulgaro)
- CS (Ceco)
- DA (Danese)
- DE (Tedesco)
- EL (Greco)
- EN (Inglese)
- ES (Spagnolo)
- ET (Estone)
- FI (Finlandese)
- FR (Francese)
- HU (Ungherese)
- ID (Indonesiano)
- IT (Italiano)
- JA (Giapponese)
- KO (Coreano)
- LI (Lituano)
- LV (Lettone)
- NL (Olandese)
- NO (Norvegese)
- PL (Polacco)
- PT (Portoghese)
- RO (Rumeno)
- RU (Russo)
- SK (Slovacco)
- SL (Sloveno)
- SV (Svedese)
- TR (Turco)
- UK (Ucraino)
- ZH (Cinese)

Puoi trovare l'elenco aggiornato delle lingue nei [Termini e condizioni di DeepL](https://www.deepl.com/pro-license) nella parte inferiore della pagina.

## Comandi

Ecco l'elenco dei comandi disponibili su questo bot:

- `/sign-in <api-key: obbligatoria>`: Accedi utilizzando una chiave API di Deepl per iniziare a utilizzare il bot.
- `/sign-out`: Disconnette il bot e rimuove la chiave API di Deepl dal suo database.
- `/usage`: Mostra l'utilizzo corrente e i caratteri rimanenti dell'account Deepl associato alla chiave API Deepl utilizzata per accedere.
- `/set <channel: opzionale> <language: obbligatorio>`: Imposta la lingua di un canale.
- `/unset <channel: opzionale>`: Rimuovi la lingua impostata su un canale.
- `/link <source-channel: opzionale> <target-channel: obbligatorio> <mode: opzionale>`: Collega due canali di traduzione in modo unidirezionale, `mode:unidirectional`, bidirezionale `mode:bidirectional` o ricorsivo `mode:recursive`.
- `/link-multiple <channels: obbligatorio>`: Collega più canali contemporaneamente.
- `/unlink <source-channel: opzionale> <target-channel: obbligatorio>`: Scollega due canali di traduzione.
- `/unlink-channel <channel: opzionale>`: Scollega il canale da tutti gli altri canali di traduzione.
- `/show-channels`: Visualizza un elenco di tutti i canali di traduzione.
- `/show-links <channel: opzionale>`: Visualizza i collegamenti tra canali di traduzione.

Puoi consultare anche la [documentazione officiale di Zekuru-v2](https://zekuru-v2.zekumoru.com/) per una spiegazione completa di questi comandi.

## Contribuire

Segnalazioni di problemi e pull request sono benvenuti! Tieni presente che **questa è una versione demo** dell'attuale bot Zekuru-v2. Se hai idee o miglioramenti per il bot, vai al [repository ufficiale del bot Zekuru-v2]((https://github.com/Zekumoru/zekuru-v2)) e controlla se le tue idee sono già state implementate, altrimenti sentiti libero di contribuire!

Qualsiasi contributo sarà rilasciato sotto la licenza software MIT.

## Licenza

Questa applicazione è concessa in licenza sotto la [licenza MIT](LICENSE).
