# better-moodle

This is an userscript to improve the design of [UzL Moodle](https://moodle.uni-luebeck.de/), as we don't like the new default design.

_Pictures on this page may contain blurred items. This is due to privacy reasons._

## Installation

1. Get yourself an up-to-date Userscript-Manager for your browser e.g. [Tampermonkey](https://www.tampermonkey.net/).
2. Click [here][installation] to install the script.

## Update

Your Userscript-Manager _should_ regularly check for updates. You may always update manually by opening [installation link][installation].

If enabled, better-moodle will also show a small red dot next to the settings icon in the navigation bar, if an update is available.
A button that allows updating (if an update is available) can be found within the settings menu.

## Changelog

For a full changelog, see [CHANGELOG.md](./CHANGELOG.md). The changelog is also integrated within the settings menu via the button in the bottom left corner in the menus footer bar.

## Features

All features can be toggled via the settings menu. It is accessible via the cogs icon in the top right corner, next to your profile picture in the navigation bar.

### Dark-mode

is not provided by this userscript. We recommend using the [Dark Reader](https://darkreader.org/) browser extension.

The Dark-mode screenshots on this page are using a brightness of 100 % and a contrast of 150 % in Dark Reader.

### General and everywhere

-   make pages use the full width of the screen and not only some few hundred pixels in the middle.
-   always open external links in a new tab
-   add a title-attribute to texts that are truncated to allow seeing the full text when hovering with the mouse over the text for a short time
    -   this is especially useful for the sidebars
    -   this does not work on mobile devices as there is no mouse to hover with. Solution ideas are welcome
-   add a countdown to Christmas Eve in the navigation bar
-   modify the "Meine Kurse" link in navigation menu to be a dropdown for quick access to all personal non-hidden courses.

|                     Default Design                      |                    Userscript (Light mode)                     |                    Userscript (Dark mode)                    |
| :-----------------------------------------------------: | :------------------------------------------------------------: | :----------------------------------------------------------: |
| ![Default Design](./img/general/my_courses/default.png) | ![Userscript (Light mode)](./img/general/my_courses/light.png) | ![Userscript (Dark mode)](./img/general/my_courses/dark.png) |

### Dashboard

-   move "Zeitleiste" and "Aktuelle Termine" into a **right** sidebar
-   add a **left** sidebar listing all personal non-hidden courses
-   custom layout configuration is planned but not yet implemented

|                 Default Design                 |                   Userscript (Light mode)                    |                   Userscript (Dark mode)                   |
| :--------------------------------------------: | :----------------------------------------------------------: | :--------------------------------------------------------: |
| ![Default Design](./img/dashboard/default.png) |    ![Userscript (Light mode)](./img/dashboard/light.png)     |    ![Userscript (Dark mode)](./img/dashboard/dark.png)     |
|                                                | ![Userscript (Light mode)](./img/dashboard/light_closed.png) | ![Userscript (Dark mode)](./img/dashboard/dark_closed.png) |

### My Courses / "Meine Kurse"

-   allow changing the amount of boxes per row on desktop screens if the "Kacheln" view is enabled
    -   moodle default is 3, better-moodle allows values from 1 to 10 (each inclusive)

|                 Default Design                  |                Userscript (Light mode)                 |                Userscript (Dark mode)                |
| :---------------------------------------------: | :----------------------------------------------------: | :--------------------------------------------------: |
| ![Default Design](./img/my_courses/default.png) | ![Userscript (Light mode)](./img/my_courses/light.png) | ![Userscript (Dark mode)](./img/my_courses/dark.png) |

### Courses / "Kurse"

-   add a button to grades ("Bewertungen") to the left sidebar
    -   optionally open them in a new tab by default
-   collapse / expand all sections in the left sidebar by double-clicking on one of the collapse / expand icons

[installation]: https://github.com/jxn-30/better-moodle/raw/main/redesign.user.js
