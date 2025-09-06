# Schön, dass du dieses Fensterchen gefunden hast! 🎉

Hier findest du Antworten auf häufig gestellte Fragen und Probleme rund um Better-Moodle. Im untersten Abschnitt findest du eine FAQ, die die häufigsten Fragen und Probleme behandelt. Sollte deine Frage dort nicht beantwortet werden, kannst du gerne eine Mail an Jan schreiben: [moin@better-moodle.dev][mailHelp]. Bitte verwende dabei am besten deine Studi-Mail, statt deiner privaten Mail-Adresse.

---

## Ich habe einen Fehler gefunden!

Huch, in Better-Moodle gibt es doch keine Fehler? 😱

Spaß beiseite, auch in Better-Moodle kann es mal vorkommen, dass ein Fehler auftritt. Eröffne gerne ein neues Issue auf [GitHub][githubIssueBug] oder schreibe Jan eine Mail, wenn du kein GitHub nutzen möchtest: [moin@better-moodle.dev][mailBug].

Bitte gebe dabei auch immer so viele Informationen wie möglich an, damit der Fehler optimal nachvollzogen und reproduziert werden kann.
Das hilft, ihn schneller und effizienter zu beheben.

## Ich habe eine tolle Idee für ein neues Feature!

Erstelle gerne ein Issue auf [GitHub][githubIssueFeature], reiche dort eine Contribution ein oder schreibe eine Mail an Jan: [moin@better-moodle.dev][mailFeature]

## Wer ist denn dieses süße Mammut 🦣 da im Hintergrund der Einstellungen?

Gut, dass du fragst! Das ist eine Zeichnung von Moothel, dem Better-Moodle Maskottchen. Um genau zu sein ist das sogar das Better-Moodle Logo!

Übrigens: Moothel hat auch eine eigene Homepage: [moothel.pet](https://moothel.pet).

## Wie funktioniert ...? Was wenn ...? Häufige gestellte Fragen und die dazu passenden Antworten

### XY funktioniert nicht. Was tun?

It's not a bug, it's a feature! In allen anderen Fällen kannst du einfach auf [GitHub][githubIssueBugNew] ein Issue eröffnen. Alternativ geht auch eine Mail an Jan ([moin@better-moodle.dev][mailBug]). Bitte gebe auch immer an, welche Version von Better-Moodle ihr verwendet. Diese Information kann in den Better-Moodle-Einstellungen über die Zahnräder in der Navigationsleiste von Moodle gefunden werden.

### Ich habe plötzlich mehrere Knöpfe zu den Better-Moodle Einstellungen. Was ist passiert?

Hoppla, da scheint wohl versehentlich Better-Moodle mehrfach installiert zu sein. Keine Sorge, das kann passieren und lässt sich einfach beheben: Öffne einfach die Scriptübersicht deines Userscript-Managers (Bei Tampermonkey klickst du einfach auf das Tampermonkey-Icon in deinem Browser (ein schwarzes oder rotes Quadrat mit zwei Löchern drin), ggf. ist es hinter einem Puzzleteil oder einem Paket-Icon versteckt, und klickst anschließend auf "Übersicht") und lösche einmal alle Installationen von Better-Moodle. Anschließend kannst du die aktuellste Version von Better-Moodle einfach über den [Installationslink][installation] neu installieren.

### Welche Userscript-Manager funktionieren?

Prinzipiell sollten alle gängigen Userscript-Manager funktionieren, allerdings wurde Better-Moodle primär mit Tampermonkey getestet.

### Kann ich Better-Moodle auch auf meinem Handy nutzen?

Jein: Unserer Kenntnis nach ist Firefox für Android aktuell der einzige mobile Browser, der Tampermonkey als Add-On unterstützt. Better-Moodle wird auch regelmäßig in der mobilen Umgebung getestet und sollte dort problemlos funktionieren.

### Was ist Tampermonkey (bzw. ein Userscript-Manager) eigentlich?

Userscript-Manager ermöglichen es, beliebige Scripte (in JavaScript geschrieben) auf Webseiten auszuführen und diese somit anzupassen und die Anzeige im Browser zu verändern.

### Ist Tampermonkey nicht gefährlich?

Es ist potenziell möglich, gefährliche Userscripte zu installieren, die Nutzerdaten abgreifen können. Userscript-Manager verbieten daher die Ausführung von Userscript z. B. auf gängigen Online-Banking Seiten. Achtet bei der Installation und dem Aktualisieren von Userscripten immer darauf, dass ihr der Herkunft des Scripts vertraut. Better-Moodle ist Open-Source, das heißt, jede/r kann den Quellcode einsehen und sich somit selbst davon überzeugen, dass Better-Moodle keinen bösartigen Code enthält. Außerdem könnt ihr uns vertrauen ;)

[installation]: https://github.com/jxn-30/better-moodle/releases/latest/download/better-moodle.user.js
[githubIssueBug]: https://github.com/jxn-30/better-moodle/issues/new?labels=bug&template=bug.yml&title=%5BBUG%5D%3A+
[githubIssueBugNew]: https://github.com/jxn-30/better-moodle/issues/new?labels=bug&template=bug.yml&title=%5BBUG%5D%3A+
[githubIssueFeature]: https://github.com/jxn-30/better-moodle/issues/new?labels=&template=feature.yml&title=%5BFeature+request%5D%3A+
[githubIssueFeatureNew]: https://github.com/jxn-30/better-moodle/issues/new?template=feature.yml&title=%5BFeature+request%5D%3A+
[mailHelp]: mailto:moin@better-moodle.dev?subject=Better%20Moodle%3A%20Ich%20ben%C3%B6tige%20bitte%20Hilfe&body=Hallo%20Jan%2C%0A%0Aich%20habe%20eine%20Frage%20zu%20Better-Moodle%2C%20die%20ich%20aber%20leider%20nicht%20duch%20die%20FAQ%20beantwortet%20bekommen%20habe%3A%0A%0A%5B...%5D%0A%0AVielen%20Dank%20und%20liebe%20Gr%C3%BC%C3%9Fe%0A%5BDein%20Name%5D
[mailBug]: mailto:moin@better-moodle.dev?subject=Better%20Moodle%3A%20Bug-Report&body=Hallo%20Jan%2C%0Aich%20habe%20einen%20Bug%20in%20Better-Moodle%20gefunden%21%0A%0AIch%20nutze%20diesen%20Browser%3A%0AIch%20nutze%20diese%20Version%20von%20Better-Moodle%3A%201.42.1%0ADiese%20Schritte%20habe%20ich%20durchgef%C3%BChrt%2C%20als%20das%20Problem%20aufgetreten%20ist%3A%0ADieses%20Verhalten%20h%C3%A4tte%20ich%20stattdessen%20erwartet%3A%0A%0AViele%20Gr%C3%BC%C3%9Fe%0A%5BDein%20Name%5D
[mailFeature]: mailto:moin@better-moodle.dev?subject=Better%20Moodle%3A%20Feature-Idee&body=Hallo%20Jan%2C%0Aich%20habe%20einen%20tollen%20Vorschlag%20f%C3%BCr%20Better-Moodle%3A%0A%0A%5Bhier%20eine%20ausf%C3%BChrliche%20Beschreibung%20des%20Vorschlags%5D%0A%0AViele%20Gr%C3%BC%C3%9Fe%0A%5BDein%20Name%5D
