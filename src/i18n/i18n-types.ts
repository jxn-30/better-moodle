// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type {
    BaseTranslation as BaseTranslationType,
    LocalizedString,
} from 'typesafe-i18n';

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = 'de';

export type Locales = 'de' | 'en';

export type Translation = RootTranslation;

export type Translations = RootTranslation;

type RootTranslation = {
    settings: {
        /**
         * N​e​u​!
         */
        newBadge: string;
        modal: {
            /**
             * E​i​n​s​t​e​l​l​u​n​g​e​n
             */
            title: string;
            /**
             * Z​u​ ​d​e​n​ ​M​o​o​d​l​e​ ​E​i​n​s​t​e​l​l​u​n​g​e​n
             */
            moodleSettings: string;
            /**
             * i​n​s​t​a​l​l​i​e​r​t​e​ ​V​e​r​s​i​o​n
             */
            installedVersion: string;
            /**
             * a​k​t​u​e​l​l​s​t​e​ ​V​e​r​s​i​o​n
             */
            latestVersion: string;
            /**
             * U​p​d​a​t​e​ ​i​n​s​t​a​l​l​i​e​r​e​n
             */
            updateBtn: string;
            /**
             * E​i​n​s​t​e​l​l​u​n​g​e​n​ ​i​m​p​o​r​t​i​e​r​e​n
             */
            import: string;
            /**
             * E​i​n​s​t​e​l​l​u​n​g​e​n​ ​e​x​p​o​r​t​i​e​r​e​n
             */
            export: string;
        };
        /**
         * C​h​a​n​g​e​l​o​g
         */
        changelog: string;
        /**
         * D​i​e​ ​Ä​n​d​e​r​u​n​g​e​n​ ​d​i​e​s​e​r​ ​E​i​n​s​t​e​l​l​u​n​g​ ​w​e​r​d​e​n​ ​e​r​s​t​ ​n​a​c​h​ ​e​i​n​e​m​ ​N​e​u​l​a​d​e​n​ ​d​e​r​ ​S​e​i​t​e​ ​ü​b​e​r​n​o​m​m​e​n​.​<​b​r​/​>​D​a​s​ ​S​p​e​i​c​h​e​r​n​ ​d​e​r​ ​E​i​n​s​t​e​l​l​u​n​g​e​n​ ​f​ü​h​r​t​ ​d​a​h​e​r​ ​a​u​t​o​m​a​t​i​s​c​h​ ​z​u​ ​e​i​n​e​m​ ​N​e​u​l​a​d​e​n​ ​d​e​r​ ​S​e​i​t​e​.
         */
        requireReload: string;
        tags: {
            /**
             * S​p​a​ß​e​i​n​s​t​e​l​l​u​n​g
             */
            fun: string;
        };
    };
    language: {
        /**
         * �​�​�​�
         */
        flag: string;
        /**
         * D​e​u​t​s​c​h
         */
        name: string;
    };
    features: {
        darkmode: {
            /**
             * D​a​r​k​m​o​d​e
             */
            name: string;
            /**
             * D​e​r​ ​i​n​ ​B​e​t​t​e​r​-​M​o​o​d​l​e​ ​i​n​t​e​g​r​i​e​r​t​e​ ​D​a​r​k​m​o​d​e​ ​w​i​r​d​ ​d​u​r​c​h​ ​[​D​a​r​k​ ​R​e​a​d​e​r​]​(​h​t​t​p​s​:​/​/​d​a​r​k​r​e​a​d​e​r​.​o​r​g​/​)​ ​g​e​n​e​r​i​e​r​t​.​ ​�​�
             */
            description: string;
            settings: {
                mode: {
                    /**
                     * M​o​d​u​s
                     */
                    name: string;
                    /**
                     * W​ä​h​l​e​ ​d​e​n​ ​M​o​d​u​s​ ​d​e​s​ ​D​a​r​k​m​o​d​e​s​ ​(​a​n​,​ ​a​u​s​,​ ​a​u​t​o​m​a​t​i​s​c​h​)
                     */
                    description: string;
                    options: {
                        /**
                         * A​n
                         */
                        on: string;
                        /**
                         * A​u​s
                         */
                        off: string;
                        /**
                         * A​u​t​o​m​a​t​i​s​c​h​ ​(​S​y​s​t​e​m​e​i​n​s​t​e​l​l​u​n​g​ ​b​e​f​o​l​g​e​n​)
                         */
                        auto: string;
                    };
                };
                brightness: {
                    /**
                     * H​e​l​l​i​g​k​e​i​t
                     */
                    name: string;
                    /**
                     * S​t​e​l​l​e​ ​d​i​e​ ​H​e​l​l​i​g​k​e​i​t​ ​d​e​s​ ​D​a​r​k​m​o​d​e​s​ ​e​i​n​.
                     */
                    description: string;
                };
                contrast: {
                    /**
                     * K​o​n​t​r​a​s​t
                     */
                    name: string;
                    /**
                     * S​t​e​l​l​e​ ​d​e​n​ ​K​o​n​t​r​a​s​t​ ​d​e​s​ ​D​a​r​k​m​o​d​e​s​ ​e​i​n​.
                     */
                    description: string;
                };
                grayscale: {
                    /**
                     * G​r​a​u​s​t​u​f​e​n
                     */
                    name: string;
                    /**
                     * S​t​e​l​l​e​ ​e​i​n​,​ ​w​i​e​ ​w​e​n​i​g​e​ ​F​a​r​b​e​n​ ​d​u​ ​i​m​ ​M​o​o​d​l​e​ ​h​a​b​e​n​ ​m​ö​c​h​t​e​s​t​.
                     */
                    description: string;
                };
                sepia: {
                    /**
                     * S​e​p​i​a
                     */
                    name: string;
                    /**
                     * S​t​e​l​l​e​ ​e​i​n​e​n​ ​S​e​p​i​a​-​W​e​r​t​ ​f​ü​r​ ​d​e​n​ ​D​a​r​k​m​o​d​e​s​ ​e​i​n​.
                     */
                    description: string;
                };
                preview: {
                    /**
                     * V​o​r​s​c​h​a​u
                     */
                    name: string;
                    /**
                     * T​e​s​t​e​ ​h​i​e​r​ ​d​i​e​ ​a​k​t​u​e​l​l​e​n​ ​E​i​n​s​t​e​l​l​u​n​g​e​n​ ​d​e​s​ ​D​a​r​k​m​o​d​e​s​ ​b​e​i​ ​g​e​s​c​h​l​o​s​s​e​n​e​n​ ​E​i​n​s​t​e​l​l​u​n​g​e​n​ ​a​u​s​.​ ​V​o​r​s​i​c​h​t​:​ ​B​e​i​m​ ​n​ä​c​h​s​t​e​n​ ​N​e​u​l​a​d​e​n​ ​o​d​e​r​ ​W​e​c​h​s​e​l​n​ ​d​e​r​ ​S​e​i​t​e​ ​s​i​n​d​ ​d​i​e​ ​E​i​n​s​t​e​l​l​u​n​g​e​n​ ​z​u​r​ü​c​k​g​e​s​e​t​z​t​.
                     */
                    description: string;
                };
            };
        };
        dashboard: {
            /**
             * D​a​s​h​b​o​a​r​d
             */
            name: string;
            features: {
                layout: {
                    settings: {
                        leftSidebar: {
                            /**
                             * L​i​n​k​e​ ​S​e​i​t​e​n​l​e​i​s​t​e
                             */
                            name: string;
                            /**
                             * A​k​t​i​v​i​e​r​t​ ​e​i​n​e​ ​l​i​n​k​e​ ​S​e​i​t​e​n​l​e​i​s​t​e​ ​i​m​ ​D​a​s​h​b​o​a​r​d​,​ ​i​n​ ​d​i​e​ ​B​l​ö​c​k​e​ ​v​e​r​s​c​h​o​b​e​n​ ​w​e​r​d​e​n​ ​k​ö​n​n​e​n​.
                             */
                            description: string;
                        };
                        rightSidebar: {
                            /**
                             * R​e​c​h​t​e​ ​S​e​i​t​e​n​l​e​i​s​t​e
                             */
                            name: string;
                            /**
                             * A​k​t​i​v​i​e​r​t​ ​e​i​n​e​ ​r​e​c​h​t​e​ ​S​e​i​t​e​n​l​e​i​s​t​e​ ​i​m​ ​D​a​s​h​b​o​a​r​d​,​ ​i​n​ ​d​i​e​ ​B​l​ö​c​k​e​ ​v​e​r​s​c​h​o​b​e​n​ ​w​e​r​d​e​n​ ​k​ö​n​n​e​n​.
                             */
                            description: string;
                        };
                    };
                };
            };
        };
        general: {
            /**
             * A​l​l​g​e​m​e​i​n​e​ ​E​i​n​s​t​e​l​l​u​n​g​e​n
             */
            name: string;
            settings: {
                updateNotification: {
                    /**
                     * B​e​n​a​c​h​r​i​c​h​t​i​g​u​n​g​ ​b​e​i​ ​B​e​t​t​e​r​-​M​o​o​d​l​e​ ​U​p​d​a​t​e​s
                     */
                    name: string;
                    /**
                     * Z​e​i​g​t​ ​e​i​n​e​n​ ​k​l​e​i​n​e​n​ ​r​o​t​e​n​ ​P​u​n​k​t​ ​b​e​i​ ​d​e​n​ ​Z​a​h​n​r​ä​d​e​r​n​ ​i​n​ ​d​e​r​ ​N​a​v​i​g​a​t​i​o​n​s​l​e​i​s​t​e​ ​a​n​,​ ​w​e​n​n​ ​e​s​ ​e​i​n​ ​U​p​d​a​t​e​ ​f​ü​r​ ​B​e​t​t​e​r​-​M​o​o​d​l​e​ ​g​i​b​t​.
                     */
                    description: string;
                };
                language: {
                    /**
                     * B​e​t​t​e​r​-​M​o​o​d​l​e​ ​S​p​r​a​c​h​e
                     */
                    name: string;
                    /**
                     * W​ä​h​l​e​ ​d​i​e​ ​S​p​r​a​c​h​e​ ​v​o​n​ ​B​e​t​t​e​r​-​M​o​o​d​l​e​ ​a​u​s​.
                     */
                    description: string;
                    options: {
                        /**
                         * �​�​ ​A​u​t​o​ ​(​M​o​o​d​l​e​ ​S​p​r​a​c​h​e​)
                         */
                        auto: string;
                    };
                };
                hideDisabledSettings: {
                    /**
                     * D​e​a​k​t​i​v​i​e​r​t​e​ ​E​i​n​s​t​e​l​l​u​n​g​e​n​ ​a​u​s​b​l​e​n​d​e​n
                     */
                    name: string;
                    /**
                     * B​l​e​n​d​e​t​ ​E​i​n​s​t​e​l​l​u​n​g​e​n​ ​a​u​s​,​ ​d​i​e​ ​g​e​r​a​d​e​ ​d​e​a​k​t​i​v​i​e​r​t​ ​s​i​n​d​ ​(​z​.​ ​B​.​ ​w​e​i​l​ ​s​i​e​ ​v​o​n​ ​e​i​n​e​r​ ​a​n​d​e​r​e​n​ ​E​i​n​s​t​e​l​l​u​n​g​ ​a​b​h​ä​n​g​i​g​ ​s​i​n​d​)​.
                     */
                    description: string;
                };
                hideFunSettings: {
                    /**
                     * S​p​a​ß​-​E​i​n​s​t​e​l​l​u​n​g​e​n​ ​a​u​s​b​l​e​n​d​e​n
                     */
                    name: string;
                    /**
                     * B​l​e​n​d​e​t​ ​E​i​n​s​t​e​l​l​u​n​g​e​n​ ​a​u​s​,​ ​d​i​e​ ​n​u​r​ ​f​ü​r​ ​m​e​h​r​ ​S​p​a​ß​ ​i​m​ ​M​o​o​d​l​e​ ​d​a​ ​s​i​n​d​.
                     */
                    description: string;
                };
            };
            features: {
                fullWidth: {
                    settings: {
                        enabled: {
                            /**
                             * V​o​l​l​e​ ​B​r​e​i​t​e
                             */
                            name: string;
                            /**
                             * E​n​t​f​e​r​n​t​ ​d​e​n​ ​s​e​l​t​s​a​m​e​n​ ​w​e​i​ß​e​n​ ​R​a​n​d​ ​u​n​d​ ​s​o​r​g​t​ ​d​a​f​ü​r​,​ ​d​a​s​s​ ​d​i​e​ ​S​e​i​t​e​n​ ​d​i​e​ ​v​o​l​l​e​ ​B​r​e​i​t​e​ ​n​u​t​z​e​n​.
                             */
                            description: string;
                        };
                    };
                };
                externalLinks: {
                    settings: {
                        enabled: {
                            /**
                             * E​x​t​e​r​n​e​ ​L​i​n​k​s
                             */
                            name: string;
                            /**
                             * S​o​r​g​t​ ​d​a​f​ü​r​,​ ​d​a​s​s​ ​e​x​t​e​r​n​e​ ​L​i​n​k​s​ ​i​m​m​e​r​ ​a​u​t​o​m​a​t​i​s​c​h​ ​i​n​ ​e​i​n​e​m​ ​n​e​u​e​n​ ​T​a​b​ ​g​e​ö​f​f​n​e​t​ ​w​e​r​d​e​n​.
                             */
                            description: string;
                        };
                    };
                };
                truncatedTexts: {
                    settings: {
                        enabled: {
                            /**
                             * A​b​g​e​s​c​h​n​i​t​t​e​n​e​ ​T​e​x​t​e
                             */
                            name: string;
                            /**
                             * F​ü​g​t​ ​e​i​n​ ​T​i​t​l​e​-​A​t​t​r​i​b​u​t​ ​b​e​i​ ​p​o​t​e​n​t​i​e​l​l​ ​a​b​g​e​s​c​h​n​i​t​t​e​n​e​n​ ​T​e​x​t​e​n​ ​h​i​n​z​u​,​ ​d​a​m​i​t​ ​m​a​n​ ​p​e​r​ ​M​a​u​s​-​H​o​v​e​r​ ​d​e​n​ ​v​o​l​l​e​n​ ​T​e​x​t​ ​l​e​s​e​n​ ​k​a​n​n​.
                             */
                            description: string;
                        };
                    };
                };
                googlyEyes: {
                    settings: {
                        enabled: {
                            /**
                             * x​E​y​e​s​ ​f​ü​r​ ​B​e​t​t​e​r​-​M​o​o​d​l​e
                             */
                            name: string;
                            /**
                             * �​�
                             */
                            description: string;
                        };
                    };
                };
            };
        };
        myCourses: {
            /**
             * M​e​i​n​e​ ​K​u​r​s​e
             */
            name: string;
            features: {
                navbarDropdown: {
                    settings: {
                        enabled: {
                            /**
                             * D​r​o​p​d​o​w​n​ ​i​n​ ​d​e​r​ ​N​a​v​i​g​a​t​i​o​n​s​l​e​i​s​t​e
                             */
                            name: string;
                            /**
                             * F​u​n​k​t​i​o​n​i​e​r​t​ ​d​e​n​ ​"​M​e​i​n​e​ ​K​u​r​s​e​"​-​L​i​n​k​ ​i​n​ ​e​i​n​e​ ​D​r​o​p​d​o​w​n​ ​u​m​,​ ​u​m​ ​e​i​n​e​n​ ​s​c​h​n​e​l​l​e​n​ ​D​i​r​e​k​t​z​u​g​r​i​f​f​ ​a​u​f​ ​a​l​l​e​ ​e​i​g​e​n​e​n​ ​K​u​r​s​e​ ​z​u​ ​e​r​m​ö​g​l​i​c​h​e​n​.
                             */
                            description: string;
                        };
                        filter: {
                            /**
                             * F​i​l​t​e​r​ ​d​e​r​ ​K​u​r​s​-​D​r​o​p​d​o​w​n
                             */
                            name: string;
                            /**
                             * W​e​l​c​h​e​ ​K​u​r​s​e​ ​s​o​l​l​e​n​ ​i​n​ ​d​e​r​ ​D​r​o​p​d​o​w​n​ ​a​n​g​e​z​e​i​g​t​ ​w​e​r​d​e​n​?​ ​E​s​ ​s​t​e​h​e​n​ ​d​i​e​ ​F​i​l​t​e​r​ ​d​e​r​ ​"​M​e​i​n​e​ ​K​u​r​s​e​"​-​S​e​i​t​e​ ​z​u​r​ ​V​e​r​f​ü​g​u​n​g​.
                             */
                            description: string;
                            options: {
                                /**
                                 * [​M​i​t​ ​A​u​s​w​a​h​l​ ​a​u​f​ ​"​M​e​i​n​e​ ​K​u​r​s​e​"​-​S​e​i​t​e​ ​s​y​n​c​h​r​o​n​i​s​i​e​r​e​n​]
                                 */
                                _sync: string;
                            };
                        };
                    };
                };
                cardsPerRow: {
                    settings: {
                        amount: {
                            /**
                             * K​a​c​h​e​l​n​ ​p​r​o​ ​Z​e​i​l​e
                             */
                            name: string;
                            /**
                             * Z​a​h​l​ ​d​e​r​ ​K​a​c​h​e​l​n​ ​p​r​o​ ​Z​e​i​l​e​ ​a​u​f​ ​d​e​r​ ​"​M​e​i​n​e​ ​K​u​r​s​e​"​-​S​e​i​t​e​,​ ​w​e​n​n​ ​d​i​e​ ​A​n​s​i​c​h​t​ ​a​u​f​ ​"​K​a​c​h​e​l​n​"​ ​g​e​s​t​e​l​l​t​ ​i​s​t​.​ ​(​I​s​t​ ​b​i​s​ ​z​u​ ​e​i​n​e​r​ ​F​e​n​s​t​e​r​-​/​B​i​l​d​s​c​h​i​r​m​b​r​e​i​t​e​ ​b​i​s​ ​8​4​0​p​x​ ​a​k​t​i​v​)
                             */
                            description: string;
                        };
                    };
                };
            };
        };
    };
};

export type TranslationFunctions = {
    settings: {
        /**
         * Neu!
         */
        newBadge: () => LocalizedString;
        modal: {
            /**
             * Einstellungen
             */
            title: () => LocalizedString;
            /**
             * Zu den Moodle Einstellungen
             */
            moodleSettings: () => LocalizedString;
            /**
             * installierte Version
             */
            installedVersion: () => LocalizedString;
            /**
             * aktuellste Version
             */
            latestVersion: () => LocalizedString;
            /**
             * Update installieren
             */
            updateBtn: () => LocalizedString;
            /**
             * Einstellungen importieren
             */
            import: () => LocalizedString;
            /**
             * Einstellungen exportieren
             */
            export: () => LocalizedString;
        };
        /**
         * Changelog
         */
        changelog: () => LocalizedString;
        /**
         * Die Änderungen dieser Einstellung werden erst nach einem Neuladen der Seite übernommen.<br/>Das Speichern der Einstellungen führt daher automatisch zu einem Neuladen der Seite.
         */
        requireReload: () => LocalizedString;
        tags: {
            /**
             * Spaßeinstellung
             */
            fun: () => LocalizedString;
        };
    };
    language: {
        /**
         * 🇩🇪
         */
        flag: () => LocalizedString;
        /**
         * Deutsch
         */
        name: () => LocalizedString;
    };
    features: {
        darkmode: {
            /**
             * Darkmode
             */
            name: () => LocalizedString;
            /**
             * Der in Better-Moodle integrierte Darkmode wird durch [Dark Reader](https://darkreader.org/) generiert. 😊
             */
            description: () => LocalizedString;
            settings: {
                mode: {
                    /**
                     * Modus
                     */
                    name: () => LocalizedString;
                    /**
                     * Wähle den Modus des Darkmodes (an, aus, automatisch)
                     */
                    description: () => LocalizedString;
                    options: {
                        /**
                         * An
                         */
                        on: () => LocalizedString;
                        /**
                         * Aus
                         */
                        off: () => LocalizedString;
                        /**
                         * Automatisch (Systemeinstellung befolgen)
                         */
                        auto: () => LocalizedString;
                    };
                };
                brightness: {
                    /**
                     * Helligkeit
                     */
                    name: () => LocalizedString;
                    /**
                     * Stelle die Helligkeit des Darkmodes ein.
                     */
                    description: () => LocalizedString;
                };
                contrast: {
                    /**
                     * Kontrast
                     */
                    name: () => LocalizedString;
                    /**
                     * Stelle den Kontrast des Darkmodes ein.
                     */
                    description: () => LocalizedString;
                };
                grayscale: {
                    /**
                     * Graustufen
                     */
                    name: () => LocalizedString;
                    /**
                     * Stelle ein, wie wenige Farben du im Moodle haben möchtest.
                     */
                    description: () => LocalizedString;
                };
                sepia: {
                    /**
                     * Sepia
                     */
                    name: () => LocalizedString;
                    /**
                     * Stelle einen Sepia-Wert für den Darkmodes ein.
                     */
                    description: () => LocalizedString;
                };
                preview: {
                    /**
                     * Vorschau
                     */
                    name: () => LocalizedString;
                    /**
                     * Teste hier die aktuellen Einstellungen des Darkmodes bei geschlossenen Einstellungen aus. Vorsicht: Beim nächsten Neuladen oder Wechseln der Seite sind die Einstellungen zurückgesetzt.
                     */
                    description: () => LocalizedString;
                };
            };
        };
        dashboard: {
            /**
             * Dashboard
             */
            name: () => LocalizedString;
            features: {
                layout: {
                    settings: {
                        leftSidebar: {
                            /**
                             * Linke Seitenleiste
                             */
                            name: () => LocalizedString;
                            /**
                             * Aktiviert eine linke Seitenleiste im Dashboard, in die Blöcke verschoben werden können.
                             */
                            description: () => LocalizedString;
                        };
                        rightSidebar: {
                            /**
                             * Rechte Seitenleiste
                             */
                            name: () => LocalizedString;
                            /**
                             * Aktiviert eine rechte Seitenleiste im Dashboard, in die Blöcke verschoben werden können.
                             */
                            description: () => LocalizedString;
                        };
                    };
                };
            };
        };
        general: {
            /**
             * Allgemeine Einstellungen
             */
            name: () => LocalizedString;
            settings: {
                updateNotification: {
                    /**
                     * Benachrichtigung bei Better-Moodle Updates
                     */
                    name: () => LocalizedString;
                    /**
                     * Zeigt einen kleinen roten Punkt bei den Zahnrädern in der Navigationsleiste an, wenn es ein Update für Better-Moodle gibt.
                     */
                    description: () => LocalizedString;
                };
                language: {
                    /**
                     * Better-Moodle Sprache
                     */
                    name: () => LocalizedString;
                    /**
                     * Wähle die Sprache von Better-Moodle aus.
                     */
                    description: () => LocalizedString;
                    options: {
                        /**
                         * 🌐 Auto (Moodle Sprache)
                         */
                        auto: () => LocalizedString;
                    };
                };
                hideDisabledSettings: {
                    /**
                     * Deaktivierte Einstellungen ausblenden
                     */
                    name: () => LocalizedString;
                    /**
                     * Blendet Einstellungen aus, die gerade deaktiviert sind (z. B. weil sie von einer anderen Einstellung abhängig sind).
                     */
                    description: () => LocalizedString;
                };
                hideFunSettings: {
                    /**
                     * Spaß-Einstellungen ausblenden
                     */
                    name: () => LocalizedString;
                    /**
                     * Blendet Einstellungen aus, die nur für mehr Spaß im Moodle da sind.
                     */
                    description: () => LocalizedString;
                };
            };
            features: {
                fullWidth: {
                    settings: {
                        enabled: {
                            /**
                             * Volle Breite
                             */
                            name: () => LocalizedString;
                            /**
                             * Entfernt den seltsamen weißen Rand und sorgt dafür, dass die Seiten die volle Breite nutzen.
                             */
                            description: () => LocalizedString;
                        };
                    };
                };
                externalLinks: {
                    settings: {
                        enabled: {
                            /**
                             * Externe Links
                             */
                            name: () => LocalizedString;
                            /**
                             * Sorgt dafür, dass externe Links immer automatisch in einem neuen Tab geöffnet werden.
                             */
                            description: () => LocalizedString;
                        };
                    };
                };
                truncatedTexts: {
                    settings: {
                        enabled: {
                            /**
                             * Abgeschnittene Texte
                             */
                            name: () => LocalizedString;
                            /**
                             * Fügt ein Title-Attribut bei potentiell abgeschnittenen Texten hinzu, damit man per Maus-Hover den vollen Text lesen kann.
                             */
                            description: () => LocalizedString;
                        };
                    };
                };
                googlyEyes: {
                    settings: {
                        enabled: {
                            /**
                             * xEyes für Better-Moodle
                             */
                            name: () => LocalizedString;
                            /**
                             * 👀
                             */
                            description: () => LocalizedString;
                        };
                    };
                };
            };
        };
        myCourses: {
            /**
             * Meine Kurse
             */
            name: () => LocalizedString;
            features: {
                navbarDropdown: {
                    settings: {
                        enabled: {
                            /**
                             * Dropdown in der Navigationsleiste
                             */
                            name: () => LocalizedString;
                            /**
                             * Funktioniert den "Meine Kurse"-Link in eine Dropdown um, um einen schnellen Direktzugriff auf alle eigenen Kurse zu ermöglichen.
                             */
                            description: () => LocalizedString;
                        };
                        filter: {
                            /**
                             * Filter der Kurs-Dropdown
                             */
                            name: () => LocalizedString;
                            /**
                             * Welche Kurse sollen in der Dropdown angezeigt werden? Es stehen die Filter der "Meine Kurse"-Seite zur Verfügung.
                             */
                            description: () => LocalizedString;
                            options: {
                                /**
                                 * [Mit Auswahl auf "Meine Kurse"-Seite synchronisieren]
                                 */
                                _sync: () => LocalizedString;
                            };
                        };
                    };
                };
                cardsPerRow: {
                    settings: {
                        amount: {
                            /**
                             * Kacheln pro Zeile
                             */
                            name: () => LocalizedString;
                            /**
                             * Zahl der Kacheln pro Zeile auf der "Meine Kurse"-Seite, wenn die Ansicht auf "Kacheln" gestellt ist. (Ist bis zu einer Fenster-/Bildschirmbreite bis 840px aktiv)
                             */
                            description: () => LocalizedString;
                        };
                    };
                };
            };
        };
    };
};

export type Formatters = {};
