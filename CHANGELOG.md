# Changelog

## [2.1.0](https://github.com/jxn-30/better-moodle/compare/2.0.1...2.1.0) (2025-09-17)


### Features

* **nina:** show time of start and end [#803](https://github.com/jxn-30/better-moodle/issues/803) ([d8a16ff](https://github.com/jxn-30/better-moodle/commit/d8a16ffcd7e815e7e31f847ad0676af7ac95abb6))
* **style:** improve creating style elements at diverse points ([c4f697b](https://github.com/jxn-30/better-moodle/commit/c4f697bc3bc45782e0ca99c45aaaa9aa4a3e1be9))


### Bug Fixes

* **cau:** remove unused connect urls ([#802](https://github.com/jxn-30/better-moodle/issues/802)) ([436cef8](https://github.com/jxn-30/better-moodle/commit/436cef8c6c7f3b6aa5634228995f5168b4c31368))
* **dashboard:** fix icon in course filter ([017caeb](https://github.com/jxn-30/better-moodle/commit/017caeb0131c746889805e27593303d0abe147a7))
* **settings:** fix search icon not always working ([1cf9ad4](https://github.com/jxn-30/better-moodle/commit/1cf9ad46fa0f91bb893c78043c1f1b7a6a6f954a))
* **settings:** fix syncing some settings such as darkmode ([c42df5d](https://github.com/jxn-30/better-moodle/commit/c42df5d23858de5a1ac957e4ee3d2ee56a6882d3))
* **speiseplan:** add a darkmode fix for the 'your-favourites' logo ([#817](https://github.com/jxn-30/better-moodle/issues/817)) ([3ef7aeb](https://github.com/jxn-30/better-moodle/commit/3ef7aeb643ddcf7271fa108aa40adf93bfac9a0a))
* **speiseplan:** fix english canteen menu not working ([#818](https://github.com/jxn-30/better-moodle/issues/818)) ([32c675f](https://github.com/jxn-30/better-moodle/commit/32c675f8c5fbd19212fa505924d601b7946efc0c))

## [2.0.1](https://github.com/jxn-30/better-moodle/compare/2.0.0...2.0.1) (2025-09-07)


### Bug Fixes

* base branch is now main ([286c412](https://github.com/jxn-30/better-moodle/commit/286c4128fbbcbb2db570f38c9829d0dafedd11ee))

## [2.0.0](https://github.com/jxn-30/better-moodle/compare/1.42.4...2.0.0) (2025-09-07)


### Features

* linkIcons
* most settings don't require a reload anymore (#75)
* when marking new settings as seen, only visible settings are marked as seen
* implemented a search function in Better-Moodle settings
* added a setting to control marquee speed
* included the CO₂-Score to Speiseplan (#524)
* implemented a setting to configure how many days in advance event advertisements should be shown
* weather provider `Pirate Weather` has been removed due to bad data
* settings now sync across tabs (#779)
* implemented a search field in dashboard course sidebar
* speiseplan will now show the next day by default after a location has entirely closed for a day https://github.com/jxn-30/better-moodle/issues/776

### Bugfixes

* marquee will not cause random flickers anymore
* the semesterzeiten bar does not show titles for hidden bars anymore

### Refactoring

* complete rewrite for better maintainability, easier contribution and easier customization to other unis (#168)
* make more use of moodle native functions
* ease the way for more integrating Better-Moodle into a customizable dashboard (#16)
* increased general accessibility of Better-Moodle (#76)
* cleaned up userscript storage
* improved styles in semesterzeiten
* speiseplan now uses FA Icons instead of emojis to better fit into moodle design

## [1.42.4](https://github.com/jxn-30/better-moodle/compare/1.42.3...1.42.4) (2025-04-06)


### Changes to the Userscript

This update adjusts the `@updateURL` and `@downloadURL` in preparation for the new Version V2! The old links will still work until V2 has been published.
Speaking about V2: The rewrite project is almost ready for being published. We've already published a first release candidate [2.0.0-rc0](https://github.com/jxn-30/better-moodle/releases/tag/v2.0.0-rc0), you may install the V2-preview version from there but be aware that you will probably end up with multiple versions of Better-Moodle installed. If you want to give feedback to this V2-preview, feel free to write us a mail to moin@better-moodle.dev (or talk to us if you see us on the campus).
For anyone else: V2 will be great and you will get the new version seamless one it's published!


### Bug Fixes

* **courses/imageZoom:** fix image zoom not working on some pages (backported from v2) ([ff6a8cb](https://github.com/jxn-30/better-moodle/commit/ff6a8cbf91fa6b779a8c37b66f472c0d13783d16))
* **courses/imgMaxWidth:** fix image max width not working correctly on some pages (backported from v2) ([7e12288](https://github.com/jxn-30/better-moodle/commit/7e12288c8ac8ab0312da04bbcc5c4676cb2d0a88))

## [1.42.3](https://github.com/jxn-30/better-moodle/compare/1.42.2...1.42.3) (2025-03-28)


### Bug Fixes

* **courses:** fix cardsPerRow being broke by moodle update ([1f5ef55](https://github.com/jxn-30/better-moodle/commit/1f5ef555a30d2f20a7f034067b8bc2f12c8dae2b))
* **courses:** fix image sizes being broke since moodle update ([24941a5](https://github.com/jxn-30/better-moodle/commit/24941a5987e8e94d2d3d180eca3b1d1e4c49c7a3))

## [1.42.2](https://github.com/jxn-30/better-moodle/compare/1.42.1...1.42.2) (2024-11-27)


### Bug Fixes

* **speiseplan:** fix title of "contains alcohole" icon being irritating and wrong ([#480](https://github.com/jxn-30/better-moodle/issues/480)) ([9c09cf6](https://github.com/jxn-30/better-moodle/commit/9c09cf671b72d80b62fe0478885ce7378f184ecc))

## [1.42.1](https://github.com/jxn-30/better-moodle/compare/1.42.0...1.42.1) (2024-10-08)


### Bug Fixes

* **darkmode:** Fix some unreadable texts ([#419](https://github.com/jxn-30/better-moodle/issues/419)) ([72e9370](https://github.com/jxn-30/better-moodle/commit/72e9370c2396363943def71c4ab8a136e25ac59b))
* **markdownMessages:** Allow HTML inputs in markdown mode ([#412](https://github.com/jxn-30/better-moodle/issues/412)) ([e75f1d8](https://github.com/jxn-30/better-moodle/commit/e75f1d8909934dc3abfac70949dccf5c1fd1a6b7))
* **markdownMessages:** Fix sometimes crashing when using Moodle as guest ([#413](https://github.com/jxn-30/better-moodle/issues/413)) ([19c2677](https://github.com/jxn-30/better-moodle/commit/19c267750e2e1ca8bffe502d756bea01507657a5))
* **ninaIntegration:** Fix canceled events not showing as canceled on details page ([#414](https://github.com/jxn-30/better-moodle/issues/414)) ([8e24e30](https://github.com/jxn-30/better-moodle/commit/8e24e3009521765aa277b24e30fd12ef543bbb20))

## [1.42.0](https://github.com/jxn-30/better-moodle/compare/1.41.1...1.42.0) (2024-09-12)


### Features

* **messages.markdown:** Add markdown support to messages ([#380](https://github.com/jxn-30/better-moodle/issues/380)) ([39b66c1](https://github.com/jxn-30/better-moodle/commit/39b66c1277f97ce7c22244bf1e85f091518b80c0))


### Bug Fixes

* **ninaIntegration:** Fix  mega alarm triggering for cancelations ([#384](https://github.com/jxn-30/better-moodle/issues/384)) ([c4bcbca](https://github.com/jxn-30/better-moodle/commit/c4bcbca8b51dc17fc124d2513536c833205e8458))

## [1.41.1](https://github.com/jxn-30/better-moodle/compare/1.41.0...1.41.1) (2024-09-12)


### Bug Fixes

* **ninaIntegration:** fix updates marking warning as new ([3fe4a2c](https://github.com/jxn-30/better-moodle/commit/3fe4a2c9ad430f5ab33f09141a5a41ef3ccfd635))

## [1.41.0](https://github.com/jxn-30/better-moodle/compare/1.40.2...1.41.0) (2024-09-10)


### Features

* **ninaIntegration:** Add NINA warn app integration ([#376](https://github.com/jxn-30/better-moodle/issues/376)) ([fa21640](https://github.com/jxn-30/better-moodle/commit/fa21640686d18600c0e59de455b5241940123c7a))

## [1.40.2](https://github.com/jxn-30/better-moodle/compare/1.40.1...1.40.2) (2024-09-10)


### Bug Fixes

* **myCourses:** allow opening "my courses" page in a new tab via middle-click ([6a653df](https://github.com/jxn-30/better-moodle/commit/6a653dfaef716f3b7d5e59f1a2c75a180aa1dcb5))

## [1.40.1](https://github.com/jxn-30/better-moodle/compare/1.40.0...1.40.1) (2024-09-06)


### Bug Fixes

* **settings:** fix settings buttons not being clickable partially ([04f537a](https://github.com/jxn-30/better-moodle/commit/04f537a4533909870d57b9cd3f7c1573c28fb11a))

## [1.40.0](https://github.com/jxn-30/better-moodle/compare/1.39.2...1.40.0) (2024-08-29)

### 1-Year Anniversary of Better-Moodle 🎉

Hello, dear Better-Moodle user,

Thank you so much for using Better-Moodle!
Today, exactly one year ago, Better-Moodle was released for the first time.
Since then, Better-Moodle has grown a lot and has become a quite userscript for Moodle at Universität zu Lübeck and in Kiel.
I am very grateful for all the feedback and support I have received from you, and I am also looking forward to the future of Better-Moodle.
At the moment, I am working on a complete rewrite as the current code is pretty messy and hard to maintain, meanwhile Yorik, a good friend, maintains and extends the current version.

BTW: Did you know, that Better-Moodle now does have an official logo? Check it out in GitHub and in the Better-Moodle settings dialog.  
Did you also know that Better-Moodle does have a Mascot called Moothel?
Moothel is a super cute mammoth 🦣 and he even has his own homepage!
Feel free to visit him at [moothel.pet](https://moothel.pet) and say hi!

Thank you all for your loving support!  
Jan <3

### Features

* **readme:** add Better-Moodle logo and link to moothel homepage https://moothel.pet ([6fe4eeb](https://github.com/jxn-30/better-moodle/commit/6fe4eeba54dcc42ac3f82e4daf3c7dd6a18638af))
* **settings:** add Better-Moodle logo in background ([0a36266](https://github.com/jxn-30/better-moodle/commit/0a36266be5c079b864dd0e79d186d6cdfed85d7d))

## [1.39.2](https://github.com/jxn-30/better-moodle/compare/1.39.1...1.39.2) (2024-08-08)


### Bug Fixes

* **darkmode:** Fix hidden activities being unreadable ([#319](https://github.com/jxn-30/better-moodle/issues/319)) ([2e6777b](https://github.com/jxn-30/better-moodle/commit/2e6777be0362b5c2ae9d8a40306558df4d99d79f))
* **sidebar:** Fix usertour z-index for courses ([#320](https://github.com/jxn-30/better-moodle/issues/320)) ([49c72f8](https://github.com/jxn-30/better-moodle/commit/49c72f808a33b850ebbc32712009a9ff73ade4a4))

## [1.39.1](https://github.com/jxn-30/better-moodle/compare/1.39.0...1.39.1) (2024-07-24)


### Bug Fixes

* **prideLogo:** Fix Agender flag not working ([#297](https://github.com/jxn-30/better-moodle/issues/297)) ([fedf65e](https://github.com/jxn-30/better-moodle/commit/fedf65ed82972ea0e2237d9ac825f0ac8d6b082c))

## [1.39.0](https://github.com/jxn-30/better-moodle/compare/1.38.2...1.39.0) (2024-07-24)


### Features

* **prideLogo:** Add setting to rotate the pride flag on the logo ([#271](https://github.com/jxn-30/better-moodle/issues/271)) by @YorikHansen ([50eca0f](https://github.com/jxn-30/better-moodle/commit/50eca0f0f0a04a3d054006c6229cd08a6dc4a385))
* **weatherDisplay:** Add a weather display to moodle ([#194](https://github.com/jxn-30/better-moodle/issues/194)) by @YorikHansen ([73bfaf9](https://github.com/jxn-30/better-moodle/commit/73bfaf9b412d3daf063cd00af10eefc94cc37c24))


### Bug Fixes

* **sidebar:** Fix usertour modal being hidden ([#274](https://github.com/jxn-30/better-moodle/issues/274)) by @YorikHansen ([7514e4c](https://github.com/jxn-30/better-moodle/commit/7514e4c9e1ad37d7991dc7858e0786e068f7dfa5))

## [1.38.2](https://github.com/jxn-30/better-moodle/compare/1.38.1...1.38.2) (2024-07-01)


### Bug Fixes

* **noDownload:** Remove `forcedownload` param on page load ([#249](https://github.com/jxn-30/better-moodle/issues/249)) ([a34c1e2](https://github.com/jxn-30/better-moodle/commit/a34c1e212a1cc61a976f7b1f01e4177696fca5ee))

## [1.38.1](https://github.com/jxn-30/better-moodle/compare/1.38.0...1.38.1) (2024-06-23)


### Bug Fixes

* **prideLogo:** Fix 'pridification' on logos that are not transparent ([#237](https://github.com/jxn-30/better-moodle/issues/237)) ([c4154ae](https://github.com/jxn-30/better-moodle/commit/c4154ae945b0b1d9270ec5504838b1594c649679))

## [1.38.0](https://github.com/jxn-30/better-moodle/compare/1.37.1...1.38.0) (2024-06-17)


### Features

* **quickRoleChange:** Make switching roles as easy as switching lang ([#215](https://github.com/jxn-30/better-moodle/issues/215)) ([6aac352](https://github.com/jxn-30/better-moodle/commit/6aac35237c4033964f159d5553ac15ad99aae01f))

## [1.37.1](https://github.com/jxn-30/better-moodle/compare/1.37.0...1.37.1) (2024-06-13)


### Code Refactoring

* **prideLogo:** Use linear-gradients instead of svgs [#212](https://github.com/jxn-30/better-moodle/issues/212) ([#217](https://github.com/jxn-30/better-moodle/issues/217)) ([c35eadf](https://github.com/jxn-30/better-moodle/commit/c35eadf4fa221b285985e9505df083a877befeb1))

## [1.37.0](https://github.com/jxn-30/better-moodle/compare/1.36.0...1.37.0) (2024-06-08)


### Features

* **expandedPrideLogo:** Adds more customization options to the moodle logo ([#208](https://github.com/jxn-30/better-moodle/issues/208)) ([bcd37f5](https://github.com/jxn-30/better-moodle/commit/bcd37f52aed3402c5c7d59208c2695549f94c4b7))

## [1.36.0](https://github.com/jxn-30/better-moodle/compare/1.35.0...1.36.0) (2024-06-02)


### Features

* **prideLogo:** Add a setting to 'prideify' the moodle logo ([#201](https://github.com/jxn-30/better-moodle/issues/201)) ([0719a49](https://github.com/jxn-30/better-moodle/commit/0719a494733b90ff9318447d6dd0eefa8ef3bfad))

## [1.35.0](https://github.com/jxn-30/better-moodle/compare/1.34.1...1.35.0) (2024-06-01)


### Features

* **darkmode:** add a btn to close settings for preview ([0fa2a2d](https://github.com/jxn-30/better-moodle/commit/0fa2a2dda7cbcfc33b4d8cc6684266f73cc4a842))
* **settings:** closing settings via `x` button is equivalent to `cancel` ([b2b5c47](https://github.com/jxn-30/better-moodle/commit/b2b5c47db4ea18b0776488acf487284d6627b4ae))
* **settings:** do not repeat shining effect on `New!`-Labels ([2aaa947](https://github.com/jxn-30/better-moodle/commit/2aaa9477b4b4af138a5b7e9d05fd92e2d9af4496))
* **userscript:** update description ([7ea85bd](https://github.com/jxn-30/better-moodle/commit/7ea85bd33f6499ae67fca518c729425231838172))

## [1.34.1](https://github.com/jxn-30/better-moodle/compare/1.34.0...1.34.1) (2024-05-31)


### Bug Fixes

* **semesterzeiten:** fix progress bar ID not being unique ([8bddd9e](https://github.com/jxn-30/better-moodle/commit/8bddd9ed6f6564533a5186f00853cf09b2061d67))
* **semesterzeiten:** fix today date being wrongly positioned ([da48a83](https://github.com/jxn-30/better-moodle/commit/da48a839fd92c04a0f8f2dd3c70e271122318da1))

## [1.34.0](https://github.com/jxn-30/better-moodle/compare/1.33.2...1.34.0) (2024-05-29)


### Features

* **settings:** add option to highlight new settings ([#152](https://github.com/jxn-30/better-moodle/issues/152)) ([#196](https://github.com/jxn-30/better-moodle/issues/196)) ([552037e](https://github.com/jxn-30/better-moodle/commit/552037eee095566437c1f3c594acd7036f1514ce))

## [1.33.2](https://github.com/jxn-30/better-moodle/compare/1.33.1...1.33.2) (2024-05-19)


### Bug Fixes

* **clock:** fix clock not showing at all ([c221eed](https://github.com/jxn-30/better-moodle/commit/c221eedb8524e9fc9475ccb5e3b5467d0d0be65f))

## [1.33.1](https://github.com/jxn-30/better-moodle/compare/1.33.0...1.33.1) (2024-05-19)


### Bug Fixes

* **settings:** remove accidental empty item ([9249382](https://github.com/jxn-30/better-moodle/commit/9249382102f4824d695cb97467db69e1bc89b7b0))

## [1.33.0](https://github.com/jxn-30/better-moodle/compare/1.32.1...1.33.0) (2024-05-19)


### Features

* **clock:** add a normal clock ([096e47a](https://github.com/jxn-30/better-moodle/commit/096e47a0bf1c712f37e6ce685986d547c7b3dc9d))

## [1.32.1](https://github.com/jxn-30/better-moodle/compare/1.32.0...1.32.1) (2024-05-19)


### Bug Fixes

* **fuzzyClock:** fix sundays showing up as 'middle of week' ([#184](https://github.com/jxn-30/better-moodle/issues/184)) ([f9530e1](https://github.com/jxn-30/better-moodle/commit/f9530e125759644290e49cfc0381334569c6ce8f))

## [1.32.0](https://github.com/jxn-30/better-moodle/compare/1.31.2...1.32.0) (2024-05-18)


### Features

* **fuzzyClock:** implement a fuzzy clock ([#181](https://github.com/jxn-30/better-moodle/issues/181)) ([8ca777b](https://github.com/jxn-30/better-moodle/commit/8ca777b77587339b7d280dee1a912fc08fb0ffd0))
* **settings:** add ticks for labels of sliders ([8ca777b](https://github.com/jxn-30/better-moodle/commit/8ca777b77587339b7d280dee1a912fc08fb0ffd0))
* **settings:** allow custom labels for sliders ([8ca777b](https://github.com/jxn-30/better-moodle/commit/8ca777b77587339b7d280dee1a912fc08fb0ffd0))

## [1.31.2](https://github.com/jxn-30/better-moodle/compare/1.31.1...1.31.2) (2024-05-17)


### Bug Fixes

* **sidebars:** fix wrong selector for toggler icons ([bb915f2](https://github.com/jxn-30/better-moodle/commit/bb915f25f5356011c8c9cb922d480562a0c52443))

## [1.31.1](https://github.com/jxn-30/better-moodle/compare/1.31.0...1.31.1) (2024-05-17)


### Bug Fixes

* **sidebar:** only change style when better-moodle fix is applied ([#178](https://github.com/jxn-30/better-moodle/issues/178)) ([e333f2e](https://github.com/jxn-30/better-moodle/commit/e333f2ec5e3925155caea5a6c884ddcbaeba72b9))

## [1.31.0](https://github.com/jxn-30/better-moodle/compare/1.30.4...1.31.0) (2024-05-17)


### Features

* **userscript:** use URLs from releases instead of raw link of main branch ([b320f40](https://github.com/jxn-30/better-moodle/commit/b320f400c4e55f2a16a3a0be2382e3543b1264e2))


### Bug Fixes

* **updateCheck:** use download URL instead of update URL for update btn ([8047cc8](https://github.com/jxn-30/better-moodle/commit/8047cc88ef6af5592232af2289c6572858457563))

## [1.30.4](https://github.com/jxn-30/better-moodle/compare/1.30.3...1.30.4) (2024-05-13)


### Bug Fixes

* **release:** fix description of release artifacts are switched ([2a906d9](https://github.com/jxn-30/better-moodle/commit/2a906d942eac2a5fdccedc114380ec6e1e6801ed))

## [1.30.3](https://github.com/jxn-30/better-moodle/compare/1.30.2...1.30.3) (2024-05-13)


### Bug Fixes

* **sidebar:** allow multiple sidebars on the same side ([#170](https://github.com/jxn-30/better-moodle/issues/170)) ([42acb3a](https://github.com/jxn-30/better-moodle/commit/42acb3aa0aec40d3263ae9caba491f91317722d5))

## [1.30.2](https://github.com/jxn-30/better-moodle/compare/1.30.1...1.30.2) (2024-05-12)


### Bug Fixes

* **settings:** slider labels overlapping eachother ([591287d](https://github.com/jxn-30/better-moodle/commit/591287d29e168264d10449ac5e67659a344c7e77))
* **settings:** slider labels should not grow ([59e714c](https://github.com/jxn-30/better-moodle/commit/59e714ca1b04521646f68e966412d965dbb1fca2))

## [1.30.1](https://github.com/jxn-30/better-moodle/compare/1.30.0...1.30.1) (2024-05-07)


### Bug Fixes

* **bookmarks:** fix long texts causing dropdown overflow [#166](https://github.com/jxn-30/better-moodle/issues/166) ([6b23101](https://github.com/jxn-30/better-moodle/commit/6b2310141537654b795130e0c7ec63a3651200f5))

## [1.30.0](https://github.com/jxn-30/better-moodle/compare/1.29.2...1.30.0) (2024-05-05)


### Features

* **better-moodle-language:** added a setting to force better-moodles language [#158](https://github.com/jxn-30/better-moodle/issues/158) ([#159](https://github.com/jxn-30/better-moodle/issues/159)) ([32cac89](https://github.com/jxn-30/better-moodle/commit/32cac89bf975bf6d209379f8c9d22a6c3473809d))

## [1.29.2](https://github.com/jxn-30/better-moodle/compare/1.29.1...1.29.2) (2024-05-05)


### Bug Fixes

* **settings:** fix select settings should be full width on small devices ([03724f6](https://github.com/jxn-30/better-moodle/commit/03724f6080f5444f2802edc760cdb74201430109))
* **settings:** fix text of help btn looking weird with linebreak ([c88e385](https://github.com/jxn-30/better-moodle/commit/c88e3853f7628fb13d526b66de9a08ec454eb065))
* **settings:** fix version span and update button looking weird on mobile ([65d78b9](https://github.com/jxn-30/better-moodle/commit/65d78b91eae67796f45f943dc4508ad9ec0f460c))

## [1.29.1](https://github.com/jxn-30/better-moodle/compare/1.29.0...1.29.1) (2024-04-30)


### Bug Fixes

* **updateCheck:** fix invalid version comparison formula ([bd5ad0e](https://github.com/jxn-30/better-moodle/commit/bd5ad0e8928d00ad8fcd37a508dc5374a493e561))

## [1.29.0](https://github.com/jxn-30/better-moodle/compare/1.28.2...1.29.0) (2024-04-23)


### Features

* **googlyEyes:** closing the eyes when entering a password ([8ae331b](https://github.com/jxn-30/better-moodle/commit/8ae331b8ac59b6c168065616605aaa860c8ac720))
* **settings:** make slider inputs look more moodle-like ([f25c611](https://github.com/jxn-30/better-moodle/commit/f25c6115c3c16023923749d2a83f2dd12810c567))


### Bug Fixes

* **semesterzeiten:** fix semesterzeiten table on smaller screens ([142fca9](https://github.com/jxn-30/better-moodle/commit/142fca98e8c6739127717f4fff0967676bdaf1a9))

## [1.28.2](https://github.com/jxn-30/better-moodle/compare/1.28.1...1.28.2) (2024-04-21)


### Bug Fixes

* **semesterzeiten:** fix visibility of progress bar of current semester ([3d0b089](https://github.com/jxn-30/better-moodle/commit/3d0b08908bfbcbb11a643ac6da4a3f54a4328af0))

## [1.28.1](https://github.com/jxn-30/better-moodle/compare/1.28.0...1.28.1) (2024-04-20)


### Bug Fixes

* **semesterzeiten:** fix multi language support ([2995c6c](https://github.com/jxn-30/better-moodle/commit/2995c6c9af34cfba94435e51456863c52e2937a2))
* **semesterzeiten:** fix tooltips looking ugly ([9c09f94](https://github.com/jxn-30/better-moodle/commit/9c09f944107339c08518ca771a6fd64b772d6c55))

## [1.28.0](https://github.com/jxn-30/better-moodle/compare/1.27.1...1.28.0) (2024-04-20)


### Features

* **semesterzeiten:** allow to click through all available semesters [#112](https://github.com/jxn-30/better-moodle/issues/112) ([d233bff](https://github.com/jxn-30/better-moodle/commit/d233bfff2a1d2e3e91843346e261c509dc4961f3))

## [1.27.1](https://github.com/jxn-30/better-moodle/compare/1.27.0...1.27.1) (2024-04-20)


### Bug Fixes

* **semesterzeiten:** fix year in SS 2026 easter and exam-mint-1 ([14f4679](https://github.com/jxn-30/better-moodle/commit/14f46794b9b2eb5b54048a63a249f26bf2dc5e92))
* **settings:** Add transparency to disabled slider settings ([#144](https://github.com/jxn-30/better-moodle/issues/144)) ([c4568ab](https://github.com/jxn-30/better-moodle/commit/c4568ab97b62418d30727c9002048a2eb7c71f9d))
* **settings:** fix initial disabled state of settings being wrong when dependent of select ([70d4eb6](https://github.com/jxn-30/better-moodle/commit/70d4eb62f5f9b954e58837dc0323a984e396e100))

## [1.27.0](https://github.com/jxn-30/better-moodle/compare/1.26.2...1.27.0) (2024-04-18)


### Features

* **semesterzeiten:** add feature for semester progress bar including special days ([70a558b](https://github.com/jxn-30/better-moodle/commit/70a558ba9ba829e8af16a968c536a1cf12a953d0))


### Bug Fixes

* **semesterzeiten:** use data living on GitHub ([ddd6a48](https://github.com/jxn-30/better-moodle/commit/ddd6a48f7b80147c45945b0a722c151aee323cb8))

## [1.26.2](https://github.com/jxn-30/better-moodle/compare/1.26.1...1.26.2) (2024-04-16)


### Bug Fixes

* **googlyEyes:** fix eyes looking weird due to 2e27b18 ([7d98b50](https://github.com/jxn-30/better-moodle/commit/7d98b507478d5b0ed91edccf746c605bf447eaf7))

## [1.26.1](https://github.com/jxn-30/better-moodle/compare/1.26.0...1.26.1) (2024-04-16)


### Bug Fixes

* **googlyEyes:** fix eyes being dark in dark mode in chromium based browsers ([2e27b18](https://github.com/jxn-30/better-moodle/commit/2e27b182136ce68a2ce4efef1436a998a0d9d269))

## [1.26.0](https://github.com/jxn-30/better-moodle/compare/1.25.2...1.26.0) (2024-04-14)


### Features

* implement darkmode ([#136](https://github.com/jxn-30/better-moodle/issues/136)) ([9b3fd41](https://github.com/jxn-30/better-moodle/commit/9b3fd41d6d1dd5372aca218e9fcdbd749241e962))

## [1.25.2](https://github.com/jxn-30/better-moodle/compare/1.25.1...1.25.2) (2024-04-10)


### Bug Fixes

* **changelog:** fix changelog link being wrong ([33d08b0](https://github.com/jxn-30/better-moodle/commit/33d08b084fc9b338bcd36a0ae890f6562543c443))
* **speiseplan:** improve arten images in darkreader dark mode ([9a629ab](https://github.com/jxn-30/better-moodle/commit/9a629ab37628bb480ca4c43729f2a45e53b55436))

## [1.25.1](https://github.com/jxn-30/better-moodle/compare/1.25.0...1.25.1) (2024-04-09)


### Bug Fixes

* **googlyEyes:** do not render eyes when pointer device cannot hover ([e548f12](https://github.com/jxn-30/better-moodle/commit/e548f12d8c006919fc08c43092c3b53527bd2609))
* **googlyEyes:** use an easing function to actually see pupils moving better ([89c70f1](https://github.com/jxn-30/better-moodle/commit/89c70f1dc495429db6467f6065218f621df11d53))
* **logo:** apply glowing logo in dark mode on login page too ([fc900d1](https://github.com/jxn-30/better-moodle/commit/fc900d19b8a2639b0847ed933be1d1778ca07d54))


### Performance Improvements

* **googlyEyes:** improve performance of googlyEyes ([b8aa4a4](https://github.com/jxn-30/better-moodle/commit/b8aa4a42784245c5324ba8f389065d1b8a53ed68))

## [1.25.0](https://github.com/jxn-30/better-moodle/compare/1.24.3...1.25.0) (2024-04-09)


### Features

* **googlyEyes:** implement xEyes for Better-Moodle 👀 ([363dfa9](https://github.com/jxn-30/better-moodle/commit/363dfa99f2d6e5fd3928a98445cdd049aa2db2a0))
* **logo:** make UzL-Logo glow a little when using darkmode of darkreader ([f4443c6](https://github.com/jxn-30/better-moodle/commit/f4443c6010d1acc5328b6b081d9853d9c70da474))

## [1.24.3](https://github.com/jxn-30/better-moodle/compare/1.24.2...1.24.3) (2024-04-01)


### Bug Fixes

* **speiseplan:** do not crash when zusatzstoff, allergen or speiseart is unknown ([f7ce212](https://github.com/jxn-30/better-moodle/commit/f7ce212ff91a99adf4534fcfbd54e2bd3f872f0b))

## [1.24.2](https://github.com/jxn-30/better-moodle/compare/1.24.1...1.24.2) (2024-03-24)


### Bug Fixes

* **settings:** fix update button not looking good ([d5d58bc](https://github.com/jxn-30/better-moodle/commit/d5d58bca4a2e719714e34ef42d4423f2cf4477ee))

## [1.24.1](https://github.com/jxn-30/better-moodle/compare/1.24.0...1.24.1) (2024-03-24)


### Bug Fixes

* **settings:** give labels more space ([831a61a](https://github.com/jxn-30/better-moodle/commit/831a61a4211023d0bcdbbb705e8dbb78913c7102))
* **style:** improve default moodle style: fix info-buttons next to form labels to be aligned left instead of centered ([37b8e43](https://github.com/jxn-30/better-moodle/commit/37b8e435dc2400420328bc1c2ba098e6a23ca64c))

## [1.24.0](https://github.com/jxn-30/better-moodle/compare/1.23.1...1.24.0) (2024-03-24)


### Features

* **dashboard:** add a star to indicate courses marked as favorite in sidebar ([5860766](https://github.com/jxn-30/better-moodle/commit/58607668b5cac2a76efcda8428609b205186748c))
* **dashboard:** add option to allow showing favourite courses on top in sidebar ([f64303d](https://github.com/jxn-30/better-moodle/commit/f64303d8f35280204ed6bfdbae0ef297dd4223e3))
* **my-courses:** add a star to indicate courses marked as favorite in my-courses dropdown ([5860766](https://github.com/jxn-30/better-moodle/commit/58607668b5cac2a76efcda8428609b205186748c))
* **my-courses:** add option to allow showing favourite courses on top my-courses dropdown ([f64303d](https://github.com/jxn-30/better-moodle/commit/f64303d8f35280204ed6bfdbae0ef297dd4223e3))

## [1.23.1](https://github.com/jxn-30/better-moodle/compare/1.23.0...1.23.1) (2024-02-26)


### Bug Fixes

* **login:** fix accidental redirect to /my/courses on login ([38a037f](https://github.com/jxn-30/better-moodle/commit/38a037f1c973c8c2e91cf6b92524429ab5d8c1af))

## [1.23.0](https://github.com/jxn-30/better-moodle/compare/1.22.3...1.23.0) (2024-02-22)


### Code Refactoring

* **settings:** rewrite settings ([6dfde11](https://github.com/jxn-30/better-moodle/commit/6dfde112e99c934a7e296ded003d468a1bab6060))

## [1.22.3](https://github.com/jxn-30/better-moodle/compare/1.22.2...1.22.3) (2024-01-31)


### Bug Fixes

* **grades:** remove unnecessary whitespace ([056642f](https://github.com/jxn-30/better-moodle/commit/056642f535ff5b02fab5b9fa63dbf09b7e5a3b08))

## [1.22.2](https://github.com/jxn-30/better-moodle/compare/1.22.1...1.22.2) (2024-01-13)


### Bug Fixes

* **dashboard:** adjust amount of shown recent courses when toggling sidebars ([ecaef49](https://github.com/jxn-30/better-moodle/commit/ecaef49584289aa99003f5cdbfdd5a5b9f1c0dbc))

## [1.22.1](https://github.com/jxn-30/better-moodle/compare/1.22.0...1.22.1) (2023-12-23)


### Bug Fixes

* **christmasCountdown:** fix text on 12/23 being plural instead of singular ([b0c24ac](https://github.com/jxn-30/better-moodle/commit/b0c24aceda5652d603062f812392ebb98b5d3800))

## [1.22.0](https://github.com/jxn-30/better-moodle/compare/1.21.3...1.22.0) (2023-12-22)


### Features

* **updater:** show changelog since last update when updating Better-Moodle ([47a8073](https://github.com/jxn-30/better-moodle/commit/47a8073b850f0d1dd19c3b2a3b225928f6c4c3ba))

## [1.21.3](https://github.com/jxn-30/better-moodle/compare/1.21.2...1.21.3) (2023-12-19)


### Bug Fixes

* **settings:** fix latest-version text being installed version ([b5d0e67](https://github.com/jxn-30/better-moodle/commit/b5d0e676b72796c08cba564fc5a3f11520bda748))

## [1.21.2](https://github.com/jxn-30/better-moodle/compare/1.21.1...1.21.2) (2023-12-11)


### Bug Fixes

* **speiseplan:** fix english version not loading ([ea1e3cf](https://github.com/jxn-30/better-moodle/commit/ea1e3cf80da805c9ad6745902820bf6a79ebe736))

## [1.21.1](https://github.com/jxn-30/better-moodle/compare/1.21.0...1.21.1) (2023-12-10)


### Bug Fixes

* **speiseplan:** remove workaround via GitHub ([0392c76](https://github.com/jxn-30/better-moodle/commit/0392c7688b95cf52847a720c2d868976191bfa9d))

## [1.21.0](https://github.com/jxn-30/better-moodle/compare/1.20.0...1.21.0) (2023-12-09)


### Features

* **speiseplan:** integrate optional speiseplan popup ([aff0964](https://github.com/jxn-30/better-moodle/commit/aff0964ecd2d97bd997dfea5fa3f2c95a7781e63))

## [1.20.0](https://github.com/jxn-30/better-moodle/compare/1.19.0...1.20.0) (2023-12-06)


### Features

* **courses:** new feature to hide self-enrol hint ([98f10a1](https://github.com/jxn-30/better-moodle/commit/98f10a12d14ef7447e6f9110083b0800ec37ec26))

## [1.19.0](https://github.com/jxn-30/better-moodle/compare/1.18.4...1.19.0) (2023-12-06)


### Features

* add english translations ([#77](https://github.com/jxn-30/better-moodle/issues/77)) ([c624461](https://github.com/jxn-30/better-moodle/commit/c624461e1b982c17f325ed9deb85a03966930dd4))


### Bug Fixes

* **bookmarks:** default bookmarks manager to be disabled ([5a721b9](https://github.com/jxn-30/better-moodle/commit/5a721b95ebdc7431ca70338cc0aee323b7a84c72))

## [1.18.4](https://github.com/jxn-30/better-moodle/compare/1.18.3...1.18.4) (2023-12-05)


### Bug Fixes

* **dashboard:** fix filter position for myCourses-Sidebar ([b38e3c1](https://github.com/jxn-30/better-moodle/commit/b38e3c124da9fef8c60b05f279ee69a783d51a0e))

## [1.18.3](https://github.com/jxn-30/better-moodle/compare/1.18.2...1.18.3) (2023-12-04)


### Performance Improvements

* fix long startup time ([6e0a682](https://github.com/jxn-30/better-moodle/commit/6e0a68210f2d646a28653ae15ef04466f57a9510))

## [1.18.2](https://github.com/jxn-30/better-moodle/compare/1.18.1...1.18.2) (2023-12-03)


### Bug Fixes

* **dashboard:** fix detecting if current page is dashboard ([657545a](https://github.com/jxn-30/better-moodle/commit/657545a2834be9eee4ef25f8f39ef691f512d7c3))

## [1.18.1](https://github.com/jxn-30/better-moodle/compare/1.18.0...1.18.1) (2023-12-01)


### Bug Fixes

* **helpPopup:** fix invalid line breaks ([74dc2b0](https://github.com/jxn-30/better-moodle/commit/74dc2b0445cbcfc9bbf6c1b13961d4e3a2302862))

## [1.18.0](https://github.com/jxn-30/better-moodle/compare/1.17.3...1.18.0) (2023-12-01)


### Features

* add a help popup accessible from settings ([474a572](https://github.com/jxn-30/better-moodle/commit/474a572948a4278fac98cb4c938404d43e7ecd7e))

## [1.17.3](https://github.com/jxn-30/better-moodle/compare/1.17.2...1.17.3) (2023-11-26)


### Reverts

* **userscript:** revert userscript name to avoid issues with Tampermonkey ([990f719](https://github.com/jxn-30/better-moodle/commit/990f719b5929bbb53f3d17ae044b582f378b3157))

## [1.17.2](https://github.com/jxn-30/better-moodle/compare/1.17.1...1.17.2) (2023-11-26)


### Bug Fixes

* **corporateDesign:** use consistent name `Better-Moodle` everywhere ([c9d574b](https://github.com/jxn-30/better-moodle/commit/c9d574b18d65f3356351bf6f09ee1ad48b4066f8))

## [1.17.1](https://github.com/jxn-30/better-moodle/compare/1.17.0...1.17.1) (2023-11-26)


### Bug Fixes

* **settings:** fix string settings not being shown ([7a9528c](https://github.com/jxn-30/better-moodle/commit/7a9528c36e610fbdb6109a3054a4ea07cc3be748))

## [1.17.0](https://github.com/jxn-30/better-moodle/compare/1.16.0...1.17.0) (2023-11-26)


### Features

* **events:** option to disable event ads ([594fa73](https://github.com/jxn-30/better-moodle/commit/594fa73a2f68bc9495ebdfa3930a75dea6b2b61d))

## [1.16.0](https://github.com/jxn-30/better-moodle/compare/1.15.0...1.16.0) (2023-11-25)


### Features

* **marquee:** add timed events ([1a05581](https://github.com/jxn-30/better-moodle/commit/1a05581a0f34c3dc72538f5f80ddaccf1f40d1f3))


### Bug Fixes

* **changelog:** use internal function for safer github link ([96594af](https://github.com/jxn-30/better-moodle/commit/96594af114601bce789218aa7900620cff9f13c5))
* **events:** fix link to events file ([adb08c1](https://github.com/jxn-30/better-moodle/commit/adb08c126a144e0f8080d3e223597622405bf85d))

## [1.15.0](https://github.com/jxn-30/better-moodle/compare/1.14.4...1.15.0) (2023-11-25)


### Features

* **changelog:** allow opening changelog in new tab ([0bbb79c](https://github.com/jxn-30/better-moodle/commit/0bbb79c019d01043b1ff5a77b1bb86d3ddc10878))

## [1.14.4](https://github.com/jxn-30/better-moodle/compare/1.14.3...1.14.4) (2023-11-24)


### Bug Fixes

* **myCourses:** fix link to my courses ([618793b](https://github.com/jxn-30/better-moodle/commit/618793bf278d09802216914240439dd09777359c))
* **myCourses:** fix loading circle not being centered ([7874370](https://github.com/jxn-30/better-moodle/commit/787437070a7a9c9668083cf454fc82f3b57b26d9))

## [1.14.3](https://github.com/jxn-30/better-moodle/compare/1.14.2...1.14.3) (2023-11-24)


### Bug Fixes

* **updater:** check for updates on each settings modal open ([0f27e47](https://github.com/jxn-30/better-moodle/commit/0f27e4796a8b0f24dfb798ac65dd6928153724ca))

## [1.14.2](https://github.com/jxn-30/better-moodle/compare/1.14.1...1.14.2) (2023-11-24)


### Bug Fixes

* **messageSendHotkey:** do not send when emoji picker is open ([2ee52ca](https://github.com/jxn-30/better-moodle/commit/2ee52ca9525b0ec350175c9d646e7b0195b7671c))

## [1.14.1](https://github.com/jxn-30/better-moodle/compare/1.14.0...1.14.1) (2023-11-24)


### Bug Fixes

* **myCourses:** fix live sync ([62958ce](https://github.com/jxn-30/better-moodle/commit/62958ce300cd3fd3b1f99b31910c3d353c3655a3))

## [1.14.0](https://github.com/jxn-30/better-moodle/compare/1.13.2...1.14.0) (2023-11-24)


### Features

* **messages:** send messages with hotkey ([c8929a0](https://github.com/jxn-30/better-moodle/commit/c8929a0047fb1fda1e3a5398013a5d701c1c8b64))

## [1.13.2](https://github.com/jxn-30/better-moodle/compare/1.13.1...1.13.2) (2023-11-21)


### Bug Fixes

* do not go to my-courses after login ([284482a](https://github.com/jxn-30/better-moodle/commit/284482ad1edc0639037badef0897328fd47229a1))

## [1.13.1](https://github.com/jxn-30/better-moodle/compare/1.13.0...1.13.1) (2023-11-21)


### Bug Fixes

* **my-courses:** fix double loading filter ([10de932](https://github.com/jxn-30/better-moodle/commit/10de93249fa87977255329f550d4d9b37c1314ec))

## [1.13.0](https://github.com/jxn-30/better-moodle/compare/1.12.1...1.13.0) (2023-11-19)


### Features

* **my-courses:** add filter for dropdown and dashboard sidebar [#31](https://github.com/jxn-30/better-moodle/issues/31) ([#57](https://github.com/jxn-30/better-moodle/issues/57)) ([373445b](https://github.com/jxn-30/better-moodle/commit/373445be02753c189ccee1417ff800d11febc40e))

## [1.12.1](https://github.com/jxn-30/better-moodle/compare/1.12.0...1.12.1) (2023-11-15)


### Bug Fixes

* **noDownload:** fix detection of middle click ([2170dc0](https://github.com/jxn-30/better-moodle/commit/2170dc02810deee04cc8ab0e0ceaa5a9f1a4def6))

## [1.12.0](https://github.com/jxn-30/better-moodle/compare/1.11.3...1.12.0) (2023-11-13)


### Features

* new option to try to prevent automatic file download (e.g. PDFs) ([3481027](https://github.com/jxn-30/better-moodle/commit/34810278944184dc37ca7d0331697b5627e8dd5d))

## [1.11.3](https://github.com/jxn-30/better-moodle/compare/1.11.2...1.11.3) (2023-11-11)


### Bug Fixes

* **image-zooming:** fix invalid sizes when images have additional style ([81bb559](https://github.com/jxn-30/better-moodle/commit/81bb5594a67346965ffb71f6416573ed1e01a5e8))
* **image-zooming:** fix invalid sizes when images have additional style ([a90153f](https://github.com/jxn-30/better-moodle/commit/a90153f50a386f0f98cecaa991ce12455944651e))
* **image-zooming:** fix size of some SVG images ([8abfdb0](https://github.com/jxn-30/better-moodle/commit/8abfdb073b04990f829fbadd3edbe861a90f2ae7))

## [1.11.2](https://github.com/jxn-30/better-moodle/compare/1.11.1...1.11.2) (2023-11-10)


### Bug Fixes

* **my-courses:** fix dropdown not working when in "Mehr" dropdown ([22dea29](https://github.com/jxn-30/better-moodle/commit/22dea2944cf9484544280d9f4b24a42c57feb787))

## [1.11.1](https://github.com/jxn-30/better-moodle/compare/1.11.0...1.11.1) (2023-11-08)


### Bug Fixes

* **bookmarks:** fix invalid title attribute on bookmarks icon ([b87d432](https://github.com/jxn-30/better-moodle/commit/b87d432e88ce0c20654227f0552eb061ba59acf5))

## [1.11.0](https://github.com/jxn-30/better-moodle/compare/1.10.0...1.11.0) (2023-11-06)


### Features

* bookmarks ([#45](https://github.com/jxn-30/better-moodle/issues/45)) ([bc3e599](https://github.com/jxn-30/better-moodle/commit/bc3e5999f65fafd8815348b5a932b45415da527f))

## [1.10.0](https://github.com/jxn-30/better-moodle/compare/1.9.0...1.10.0) (2023-11-04)


### Features

* **settings:** add button to export settings ([bc7d73a](https://github.com/jxn-30/better-moodle/commit/bc7d73a69782920e0e6015ae20917e0ea4b99869))
* **settings:** add button to import settings ([24c20e3](https://github.com/jxn-30/better-moodle/commit/24c20e34e8d7bb31401947a911e4d11fad2e90ee))

## [1.9.0](https://github.com/jxn-30/better-moodle/compare/1.8.1...1.9.0) (2023-11-02)


### Features

* **courses:** add setting to prevent images having more than 100% width [#38](https://github.com/jxn-30/better-moodle/issues/38) ([42d93e5](https://github.com/jxn-30/better-moodle/commit/42d93e54ded143ce745f7499ab204979d4748e4c))
* **courses:** add setting to zoom images in on click [#38](https://github.com/jxn-30/better-moodle/issues/38) ([3fa9bdd](https://github.com/jxn-30/better-moodle/commit/3fa9bdd9d42bf5c187e4c10606776ca15a6cf7c9))

## [1.8.1](https://github.com/jxn-30/better-moodle/compare/1.8.0...1.8.1) (2023-10-27)


### Bug Fixes

* **christmas-countdown:** fix right whitespace in not-animated mode ([46839ae](https://github.com/jxn-30/better-moodle/commit/46839ae1704f8a868ed56bdd2b6ad6bdd1d456f0))

## [1.8.0](https://github.com/jxn-30/better-moodle/compare/1.7.0...1.8.0) (2023-10-25)


### Features

* **updater:** add update instructions on btn click ([b1db106](https://github.com/jxn-30/better-moodle/commit/b1db106c59ee2ae5853dfa4e6aa92c8f6c886dfa))


### Bug Fixes

* **my-courses:** clarify description of boxesPerRow setting ([c003282](https://github.com/jxn-30/better-moodle/commit/c0032825334efab20253443618c2711a12d088e3))
* **updater:** do not open a blank tab on updating ([f118170](https://github.com/jxn-30/better-moodle/commit/f118170489bb052d2f055ea3b56976aebfbc1fbc))

## [1.7.0](https://github.com/jxn-30/better-moodle/compare/1.6.1...1.7.0) (2023-10-25)


### Features

* add links to github repo in settings & changelog modal ([e3d6a92](https://github.com/jxn-30/better-moodle/commit/e3d6a925f094e0f36e6985c0fdb3713cb27457fa))


### Bug Fixes

* **changelog:** fix cache query param ([4888f1e](https://github.com/jxn-30/better-moodle/commit/4888f1ea8745f1e939a3c973b04ec7b9e81f6ea3))
* **changelog:** prevent cache longer than 5 minutes ([8b6dcea](https://github.com/jxn-30/better-moodle/commit/8b6dceabc4aa700daaca5c2f985ac49ac73c41a7))
* **settings:** update description text of updateNotification setting ([1de6908](https://github.com/jxn-30/better-moodle/commit/1de690844e6be3e5aa6727f3584baf6b1c353edb))

## [1.6.1](https://github.com/jxn-30/better-moodle/compare/1.6.0...1.6.1) (2023-10-25)


### Bug Fixes

* **external-links:** handle javascript-links correctly ([c46dff8](https://github.com/jxn-30/better-moodle/commit/c46dff8f18201a73b56d4f5d334f579b4eb4fac3))

## [1.6.0](https://github.com/jxn-30/better-moodle/compare/1.5.0...1.6.0) (2023-10-25)


### Features

* add changelog modal in settings ([#12](https://github.com/jxn-30/better-moodle/issues/12)) ([89b6d9d](https://github.com/jxn-30/better-moodle/commit/89b6d9d504527e3ba53c6424b6f27726a6adf3e3))

## [1.5.0](https://github.com/jxn-30/better-moodle/compare/1.4.1...1.5.0) (2023-10-25)


### Features

* optional update notification ([#13](https://github.com/jxn-30/better-moodle/issues/13)) ([2d6b0e3](https://github.com/jxn-30/better-moodle/commit/2d6b0e370531d033fde475b6a79609e0c5541641))

## [1.4.1](https://github.com/jxn-30/better-moodle/compare/1.4.0...1.4.1) (2023-10-24)


### Bug Fixes

* **christmas-countdown:** use marquee effect on small screen width instead of hidden overflow ([1e93a71](https://github.com/jxn-30/better-moodle/commit/1e93a71490e15438c94af8d60a84982353d047f5))

## [1.4.0](https://github.com/jxn-30/better-moodle/compare/1.3.0...1.4.0) (2023-10-23)


### Features

* add an optional countdown to christmas [#14](https://github.com/jxn-30/better-moodle/issues/14) ([#23](https://github.com/jxn-30/better-moodle/issues/23)) ([1730258](https://github.com/jxn-30/better-moodle/commit/1730258347f2b0a3d2b03745d11f55468905de64))

## [1.3.0](https://github.com/jxn-30/better-moodle/compare/1.2.9...1.3.0) (2023-10-23)


### Features

* mute text on invalid setting type ([7bffaa8](https://github.com/jxn-30/better-moodle/commit/7bffaa87e9d792381fbe3993e9e180b462c6df75))
* release 1.3.0 ([a693586](https://github.com/jxn-30/better-moodle/commit/a693586016fe5ca75f47c4e07148355e6f0f7d90))
* respect disabled state in settings modal ([b7d4731](https://github.com/jxn-30/better-moodle/commit/b7d4731c91596fc556af7cd6d3d4b9ffe685a708))
* settings ([7d291b3](https://github.com/jxn-30/better-moodle/commit/7d291b3ecb67fcd8986332cfa739a61a5e0d6fb2))
* settings modal [WIP] ([d10032c](https://github.com/jxn-30/better-moodle/commit/d10032c0bd19bf0b82341dd00870c130406d19d4))
* settings modal [WIP] ([3f6f074](https://github.com/jxn-30/better-moodle/commit/3f6f074b68ba1bde4ba2544dda0527b8d8f6c66c))
* settings modal [WIP] ([6be0eaa](https://github.com/jxn-30/better-moodle/commit/6be0eaa1cd2e60b3e4b3be27a2451105682d16a1))


### Bug Fixes

* correct invalid yarn.lock ([668239a](https://github.com/jxn-30/better-moodle/commit/668239a872f1edbcf952293570b7ed3d1efe0120))

## [1.2.9](https://github.com/jxn-30/better-moodle/compare/1.2.8...1.2.9) (2023-10-19)


### Features

* do not open bewertungen in new tab ([3b4eb71](https://github.com/jxn-30/better-moodle/commit/3b4eb7179b7bdd3bea0ec99d3fdc9704bd142ae9))

## [1.2.8](https://github.com/jxn-30/better-moodle/compare/1.2.7...1.2.8) (2023-10-19)


### Features

* doubleclick to collapse all coursesections in sidebar ([4939fd4](https://github.com/jxn-30/better-moodle/commit/4939fd4343fa6e79951ccff85d8e7b8652cb9fd0))

## [1.2.7](https://github.com/jxn-30/better-moodle/compare/1.2.6...1.2.7) (2023-10-18)


### Bug Fixes

* more intelligent check for bewertungen ([54dba20](https://github.com/jxn-30/better-moodle/commit/54dba2008d7e9111bfc8ea65700fa95f877afaf7))
* **bewertungen**: fix abort condition ([79bf6dc](https://github.com/jxn-30/better-moodle/commit/79bf6dc6c1b4a2d3e1343391d5362a8b7c7ea43f))

## [1.2.6](https://github.com/jxn-30/better-moodle/compare/1.2.5...1.2.6) (2023-10-18)


### Features

* add a link to Bewertungen on each course-sidebar ([260ee75](https://github.com/jxn-30/better-moodle/commit/260ee75aa1490af51401a2883b25880f8dc6220e))

## [1.2.5](https://github.com/jxn-30/better-moodle/compare/1.2.4...1.2.5) (2023-10-17)


### Features

* title attribute on long truncatable texts ([2ce5157](https://github.com/jxn-30/better-moodle/commit/2ce5157d21f90e7cb0daa5fe391aebfb2daa58a6))

## [1.2.4](https://github.com/jxn-30/better-moodle/compare/1.2.3...1.2.4) (2023-10-15)


### Features

* open external links in _blank target ([a16259e](https://github.com/jxn-30/better-moodle/commit/a16259ec47d4a76386214ac579ca9ecac9e5cd1f))

## [1.2.3](https://github.com/jxn-30/better-moodle/compare/1.2.2...1.2.3) (2023-09-14)


### Features

* **my-courses**: click on link opens my-courses page when dropdown is open ([1ce79f2](https://github.com/jxn-30/better-moodle/commit/1ce79f2f666e6d10dd2206af6e0a32b004a089e2))

## [1.2.2](https://github.com/jxn-30/better-moodle/compare/1.2.1...1.2.2) (2023-09-01)


### Features

* **my-courses**: add a sidebar header ([2fd794b](https://github.com/jxn-30/better-moodle/commit/2fd794b7cbdab59c38f39cbfc3c0e822aa48127b))

## [1.2.1](https://github.com/jxn-30/better-moodle/compare/1.2.0...1.2.1) (2023-08-31)


### Features

* **my-courses**: add course shortnames ([d5d8a98](https://github.com/jxn-30/better-moodle/commit/d5d8a98cc470843c163e8e0c888c35ca840087eb))

## [1.2.0](https://github.com/jxn-30/better-moodle/compare/1.1.3...1.2.0) (2023-08-30)


### Features

* **login**: disable the weird image scroll behaviour ([a1546a9](https://github.com/jxn-30/better-moodle/commit/a1546a956ac2da224d38e37f013d5ac4e2cef0f5))

## [1.1.3](https://github.com/jxn-30/better-moodle/compare/1.1.2...1.1.3) (2023-08-30)


### Bug Fixes

* **my-courses**: fix mobile menu not working now and then ([a6b6b60](https://github.com/jxn-30/better-moodle/commit/a6b6b60c0dd82744890cca93238da43ec905a7b2))

### Documentation

* add darkreader note ([b484048](https://github.com/jxn-30/better-moodle/commit/b484048951c74d4c5bab3b4dc345b6f1a2c53cb6))
* add example images ([e470d68](https://github.com/jxn-30/better-moodle/commit/e470d681104068797d7f709646ad196a4b6420c9))

## [1.1.2](https://github.com/jxn-30/better-moodle/compare/1.1.1...1.1.2) (2023-08-30)


### Bug Fixes

* **userscript**: fix infinite reload on login page ([1a67cf3](https://github.com/jxn-30/better-moodle/commit/1a67cf37e76b4b453665ba247ff487718a808877))

## [1.1.1](https://github.com/jxn-30/better-moodle/compare/1.1.0...1.1.1) (2023-08-30)


### Bug Fixes

* **userscript**: fix installation link ([38c51bc](https://github.com/jxn-30/better-moodle/commit/38c51bcecb38e4f7f8455a8642a32f4b9b5417d7))

## [1.1.0](https://github.com/jxn-30/better-moodle/compare/1.0.0...1.1.0) (2023-08-30)


### Features

* **course**: improve title/header width ([04d65ad](https://github.com/jxn-30/better-moodle/commit/04d65adbf9d4d2b20867799e79c33423942bfa5e))
* **dashboard**: add sidebar ([6249954](https://github.com/jxn-30/better-moodle/commit/62499543cdcdd4c80f3903489793f3c06695b276))
* **courses**: improve box view ([b9670d5](https://github.com/jxn-30/better-moodle/commit/b9670d5ef1eb8916a5d9ff9a09e9a39e95c9a6b3))
* **courses**: add courses dropdown and sidebar on dashboard ([5ca0464](https://github.com/jxn-30/better-moodle/commit/5ca04641706e1d91a252743890f8ce2287a985e8))
* **my-courses**: improve dropdown style ([fa73981](https://github.com/jxn-30/better-moodle/commit/fa73981bc450920d0795d543b60286ba83234861))

## [1.0.0](https://github.com/jxn-30/better-moodle/commit/93e435e6af3e792763baf4aaad96741e684e3902) (2023-08-29)


### Features

* initial release 🎉 ([93e435e](https://github.com/jxn-30/better-moodle/commit/93e435e6af3e792763baf4aaad96741e684e3902))
