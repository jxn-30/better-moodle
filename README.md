# Better-Moodle

[![Aktuelle Version / Current Version](https://img.shields.io/github/v/release/jxn-30/better-moodle?label=Aktuellste%20Version%20/%20Current%20Version&color=004B5A&style=for-the-badge)][latest release]

- [Installation][#installation]
- [Disclaimer][#disclaimer]
- [Update][#update]
    - [Changelog][#changelog]
- [Hochschulen / Universities][#hochschulen]
- [Features][#features]
- [Support & FAQ][#support]
- [Mitwirken / Contributing][#contributing]
- [Alte Bilder und Impressionen / Old pictures and impressions][#gallery]
- [Verlauf der GitHub Stars / GitHub star history][#stars]

|                                                                                                                                                                                                                                                                                                                                                        |                                              |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------: |
| Better-Moodle ist ein Userscript, um das Design vom [UzL Moodle][moodle uzl] und dem Moodle anderer Hochschulen zu verbessern und zusätzliche, coole Features hinzuzufügen.<br><br> 🇬🇧 Better-Moodle is an userscript to improve the design of [UzL Moodle][moodle uzl] as well as the Moodle of other universities and add additional, cool features. | ![The Better-Moodle logo](./img/moothel.png) |
| Better-Moodle Maskottchen Moothel / Better-Moodle Mascot Moothel: [moothel.pet](https://moothel.pet)                                                                                                                                                                                                                                                   |              Better-Moodle Logo              |

_Bilder in dieser Beschreibung enthalten teilweise verschwommene Elemente, um den Datenschutz zu wahren._

> **🇬🇧 English Version**
>
> Better-Moodle will use English translations whenever the page indicates to be in english.
>
> Within this README, English texts can be found - if available - in the extendable areas marked with `🇬🇧`. They can be opened and closed by clicking on the respective area.

## Installation

1. Userscript-Manager als Browser-Erweiterung installieren (z. B. [Tampermonkey](https://tampermonkey.net))
2. Klicke auf den für deine Hochschule passende `Download`-Link im Abschnitt [Hochschulen](#hochschulen) um Better-Moodle zu installieren
    1. In Chromium basierten Browsern (Google Chrome, Edge, Opera, etc.) muss der Entwicklermodus aktiviert werden. Siehe hierzu [Tampermonkey FAQ Q209](https://www.tampermonkey.net/faq.php?locale=de#Q209).
    2. Alternativ kann auch einfach das freie Internet unterstützt werden, indem Firefox genutzt wird.
3. Moodle einmal neu laden und ein besseres Moodle genießen 🎉
4. Bei Bedarf über das Zahnräder-Icon oben rechts im Moodle, neben deinem Profilbild, Better-Moodle individualisieren

<details>
<summary><h3>🇬🇧 Installation</h3></summary>

1. Install an Userscript-Manager as a browser extension (e.g. [Tampermonkey](https://tampermonkey.net))
2. Click the respective `Download`-Link in the [Universities](#hochschulen) section to install Better-Moodle
    1. In Chromium based browsers (Google Chrome, Edge, Opera, etc.), developer mode needs to be enabled. See [Tampermonkey FAQ Q209](https://www.tampermonkey.net/faq.php#Q209) to see how to do so.
    2. Alternatively support the free internet and just use Firefox
3. Reload Moodle once and enjoy a better Moodle 🎉
4. If required, customize Better-Moodle via the gears icon at the top right of Moodle, next to your profile picture
 </details>

### Unterstützte Browser

Wir möchten in Better-Moodle modernen Code schreiben. Da wir hierfür auch auf neuere Konzepte zurückgreifen möchten, werden automatisch Polyfills (kleine Code-Zeilen, die die Kompatibilität zu älteren Browsern herstellen) mit in Better-Moodle eingefügt.
Allerdings ist hier zu beachten, dass das gesamte Userscript dadurch größer wird. Die Menge an zusätzlichem Code wächst mit jeder weiteren unterstützten Version, was wiederum die Performance von Better-Moodle senkt.

Auch aus einem Sicherheits-Aspekt ist ein aktueller Browser immer zu empfehlen. Better-Moodle wird primär auf **Firefox** entwickelt und getestet. Offiziell unterstützen wir jedoch die Browser **Firefox**, **Chrome**, **Edge** und **Opera**, jeweils die **4 aktuellsten Versionen**.
Auf mobilen Android-Geräten unterstützen wir **Firefox für Android**, ebenso in den **4 aktuellsten Versionen**.

<details>
<summary><h4>🇬🇧 Supported browsers</h4></summary>

We want to write modern code in Better-Moodle. As we also want to use newer concepts for this, polyfills (small lines of code that ensure compatibility with older browsers) are automatically inserted into Better-Moodle.
However, it should be noted here that the entire userscript becomes larger as a result. The amount of additional code increases with each additional supported version, which in turn reduces the performance of Better-Moodle.

An up-to-date browser is also always recommended from a security point of view. Better-Moodle is primarily developed and tested on **Firefox**. However, we officially support the **Firefox**, **Chrome**, **Edge** and **Opera** browsers, in each case the **4 latest versions**.
On mobile Android devices we support **Firefox for Android**, also in the **4 latest versions**.

</details>

## Disclaimer

Better-Moodle wurde privat von [@jxn-30][@jxn-30] und [@YorikHansen][@YorikHansen] entwickelt und ist kein offizielles Projekt der Universitäten. Es dient ausschließlich dazu, die individuelle Moodle-Nutzung zu verbessern, und sammelt keinerlei Daten. Die Nutzung geschieht natürlich dennoch auf eigene Verantwortung! ;)

Bei der Verwendung von Userscript-Managern wie Tampermonkey wird ein externes Tool genutzt, für das wir nicht zuständig oder verantwortlich sind. Es wird zur Vorsicht bei der Installation weiterer Userscripts geraten.

<details>
<summary><h3>🇬🇧 Disclaimer</h3></summary>

Better-Moodle was developed privately by [@jxn-30][@jxn-30] and [@YorikHansen][@YorikHansen] and is not an official project of the universities. Its sole purpose is to improve the individual use of Moodle and does not collect any data. Of course, you still use it at your own risk ;)

When using userscript managers such as Tampermonkey, an external tool is used for which we are not responsible. Caution is advised when installing additional userscripts.

</details>

## Update

Die meisten Userscript-Manager suchen regelmäßig nach Aktualisierungen. Eine manuelle Aktualisierung von Better-Moodle ist auch jederzeit über den möglich, indem der passende Link im [aktuellsten Release][latest release] bzw. der `Download`-Link im Abschnitt [Hochschulen][#hochschulen] geöffnet wird.

Wenn in den Einstellungen aktiviert, wird Better-Moodle auch einen kleinen roten Punkt neben dem Einstellungen-Icon in der Navigationsleiste anzeigen, wenn ein Update verfügbar ist. In den Einstellungen kann, wenn ein Update verfügbar ist, die Aktualisierung durchgeführt werden.

<details>
<summary><h3>🇬🇧 Update</h3></summary>

Most userscript managers regularly check for updates. A manual update of Better-Moodle is also possible at any time via the by opening the appropriate link in the [latest release][latest release] or the `Download` link in the [Universities][#hochschulen] section.

If activated in the settings, Better-Moodle will also display a small red dot next to the settings icon in the navigation bar when an update is available. In the settings, if an update is is available, the update can be installed via a button.

</details>

### Changelog

Better-Moodle erhält regelmäßig Updates. Ein vollständiges Changelog ist in der Datei [CHANGELOG.md][changelog] zu finden. Das Changelog ist auch über das Einstellungen-Menü über den Button in der linken unteren Ecke der Fußleiste erreichbar.

<details>
<summary><h4>🇬🇧 Changelog</h4></summary>

Better-Moodle receives regular updates. A complete changelog can be found in the file [CHANGELOG.md][changelog]. The changelog can also be accessed via the settings menu using the button in the bottom left-hand corner of the footer accessible.

</details>

## Hochschulen

Es gibt ganz viele, ganz tolle Menschen, die gerne programmieren und so breitet sich Better-Moodle mit der Zeit auch auf anderen Hochschulen aus. Von diesen Hochschulen ist bekannt, dass Better-Moodle von ehrenamtlichen Studis entwickelt und getestet wird:

🇬🇧 There are a lot of really great people who like programming and so Better-Moodle is spreading to other universities over time. We know from these universities that Better-Moodle is developed and tested by volunteer students:

| Hochschule / University                                | Gepflegt von / Maintained by | Download                                  |                                                   |
| :----------------------------------------------------- | :--------------------------- | :---------------------------------------- | :-----------------------------------------------: |
| **Original** [Universität zu Lübeck (UzL)][moodle uzl] | [@jxn-30][@jxn-30]           | [better-moodle-uzl.user.js][download uzl] | ![GitHub Downloads latest release][downloads uzl] |
| [CAU Kiel][moodle cau]                                 | [@YorikHansen][@YorikHansen] | [better-moodle-cau.user.js][download cau] | ![GitHub Downloads latest release][downloads cau] |

## Features

Alle Features von Better-Moodle lassen sich in den Einstellungen (de-)aktivieren. Die Einstellungen sind über das Icon mit den Zahnrädern in der rechten oberen Ecke neben dem Profilbild in der Navigationsleiste erreichbar.

Eine vollständige Liste aller Features würde hier mittlerweile den Rahmen sprengen, wir arbeiten allerdings an einer Alternative, die automatisiert eine Übersicht über die Liste der jeweiligen Features enthält.

## Support & FAQ

Konkrete Informationen zum Support und unsere FAQ findest du in der Datei [support/de.md][support de].

🇬🇧 For english support and FAQ, please refer to the file [support/en.md][support en].

## Mitwirken

Es gibt viele Verschiedene Möglichkeiten, bei Better-Moodle mitzuhelfen. Sei es die Meldung oder Behebung eines Fehlers, das Ändern einer ungünstigen Übersetzung oder das Implementieren eines neuen Features. Aber auch schon allein ein neues Feature vorzuschlagen ist eine großartige Möglichkeit, mitzuwirken, selbst wenn man gar nicht mit programmieren kann oder möchte!

Wenn du am Code mitwirken möchtest, hilft dir unser [Contribution guide][contributing.md]. Solltest du GitHub besitzen, dann nutze doch gerne unsere Issue-Templates für [Bugs][issue bug] bzw. [Features][issue feature]. Alternativ kannst du uns natürlich auch über die im [Support-Dokument][support de] genannten Wege kontaktieren.

<details>
<summary><h3>🇬🇧 Contributing</h3></summary>

There are many different ways to help with Better-Moodle. Be it reporting or fixing a bug, changing an unfavourable translation or implementing a new feature. But even just suggesting a new feature is a great way to contribute, even if you can't or don't want to code!

If you want to contribute to the code, our [Contribution guide][contributing.md] will help you. If you have GitHub, you are welcome to use our issue templates for [Bugs][issue bug] or [Features][issue feature]. Alternatively, you can of course contact us at via the channels listed in the [support document][support en].

</details>

## Alte Bilder und Impressionen

Aktuell überarbeiten wir die Bilder in dieser Datei. Bis die neuen verfügbar sind, hier noch ein paar Impressionen von Better-Moodle. Teilweise sind neue Features in diesen Bildern noch nicht vorhanden.

|                     Default Design                      |                    Userscript (Light mode)                     |                    Userscript (Dark mode)                    |
| :-----------------------------------------------------: | :------------------------------------------------------------: | :----------------------------------------------------------: |
| ![Default Design](./img/general/my_courses/default.png) | ![Userscript (Light mode)](./img/general/my_courses/light.png) | ![Userscript (Dark mode)](./img/general/my_courses/dark.png) |
|     ![Default Design](./img/dashboard/default.png)      |     ![Userscript (Light mode)](./img/dashboard/light.png)      |     ![Userscript (Dark mode)](./img/dashboard/dark.png)      |
|                                                         |  ![Userscript (Light mode)](./img/dashboard/light_closed.png)  |  ![Userscript (Dark mode)](./img/dashboard/dark_closed.png)  |
|     ![Default Design](./img/my_courses/default.png)     |     ![Userscript (Light mode)](./img/my_courses/light.png)     |     ![Userscript (Dark mode)](./img/my_courses/dark.png)     |

## Verlauf der GitHub Stars

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=jxn-30%2Fbetter-moodle&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=jxn-30%2Fbetter-moodle&type=Date" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=jxn-30%2Fbetter-moodle&type=Date" />
</picture>

[latest release]: https://github.com/jxn-30/better-moodle/releases/latest
[changelog]: https://github.com/jxn-30/better-moodle/blob/v2/CHANGELOG.md
[moodle uzl]: https://moodle.uni-luebeck.de
[moodle cau]: https://elearn.informatik.uni-kiel.de/
[download uzl]: https://github.com/jxn-30/better-moodle/releases/latest/download/better-moodle-uzl.user.js
[downloads uzl]: https://img.shields.io/github/downloads/jxn-30/better-moodle/latest/better-moodle-uzl.user.js?style=for-the-badge&label=Downloads&color=004b5a
[download cau]: https://github.com/jxn-30/better-moodle/releases/latest/download/better-moodle-cau.user.js
[downloads cau]: https://img.shields.io/github/downloads/jxn-30/better-moodle/latest/better-moodle-cau.user.js?style=for-the-badge&label=Downloads&color=004b5a
[@jxn-30]: https://github.com/jxn-30
[@YorikHansen]: https://github.com/YorikHansen
[contributing.md]: ./CONTRIBUTING.md
[support de]: ./support/de.md
[support en]: ./support/en.md
[issue bug]: https://github.com/jxn-30/better-moodle/issues/new?template=bug.yml
[issue feature]: https://github.com/jxn-30/better-moodle/issues/new?template=feature.yml
[#installation]: #installation
[#disclaimer]: #disclaimer
[#update]: #update
[#changelog]: #changelog
[#hochschulen]: #hochschulen
[#features]: #features
[#support]: #support--faq
[#contributing]: #mitwirken
[#gallery]: #alte-bilder-und-impressionen
[#stars]: #verlauf-der-github-stars
