# Nice that you found this little window! 🎉

Here you will find answers to frequently asked questions and problems relating to Better-Moodle. In the bottom section, you'll find an FAQ that covers the most frequently asked questions and problems. If your question is not answered there, you are welcome to email Jan: [uzl@better-moodle.dev][mailHelp]. Please use your student e-mail address instead of your private e-mail address.

---

## I have found a mistake!

Oops, there are no errors in Better-Moodle? 😱

Joking aside, even in Better-Moodle it can happen that an error occurs. Feel free to open a new issue on [GitHub][githubIssueBug] or write Jan an email if you don't want to use GitHub: [uzl@better-moodle.dev][mailBug].

Please always include as much information as possible so that the bug can be optimally reproduced.
This helps to fix it faster and more efficiently.

## I have a great idea for a new feature!

Feel free to create an issue on [GitHub][githubIssueFeature], submit a contribution there or write an email to Jan: [uzl@better-moodle.dev][mailFeature]

## Who is that cute mammoth 🦣 in the background of the settings?

I'm glad you asked! That's a drawing of Moothel, the Better Moodle mascot. In fact, it's the Better Moodle logo!

By the way: Moothel also has his own homepage: [moothel.pet](https://moothel.pet).

## How does ... work? What if ...? Frequently asked questions and the corresponding answers

### XY does not work. What to do?

It's not a bug, it's a feature! In all other cases, you can simply open an issue on [GitHub][githubIssueBugNew]. Alternatively, you can also email Jan ([uzl@better-moodle.dev][mailBug]). Please always indicate which version of Better-Moodle you are using. This information can be found in the Better Moodle settings via the cogwheels in the Moodle navigation bar.

### I suddenly have several buttons for the Better Moodle settings. What has happened?

Oops, it seems that Better-Moodle has been installed multiple times by mistake. Don't worry, this can happen and is easy to fix: Simply open the script overview of your userscript manager (for Tampermonkey, simply click on the Tampermonkey icon in your browser (a black or red square with two holes in it), it may be hidden behind a puzzle piece or a package icon, and then click on ‘Overview’) and delete all installations of Better-Moodle once. You can then simply reinstall the latest version of Better-Moodle via the [installation link][installation].

### Which userscript managers work?

In principle, all common userscript managers should work, but Better-Moodle was primarily tested with Tampermonkey.

### Can I also use Better-Moodle on my mobile phone?

Yes and no: As far as we know, Firefox for Android is currently the only mobile browser that supports Tampermonkey as an add-on. Better-Moodle is also regularly tested in the mobile environment and should work there without any problems.

### What is Tampermonkey (or any other userscript manager) actually?

Userscript managers make it possible to execute any scripts (written in JavaScript) on websites and thus customise them and change the display in the browser.

### Isn't Tampermonkey dangerous?

It is potentially possible to install dangerous userscripts that can access user data. Userscript managers therefore prohibit the execution of userscripts, e.g. on common online banking sites. When installing and updating userscripts, always make sure that you trust the source of the script. Better-Moodle is open source, which means that anyone can view the source code and see for themselves that Better-Moodle does not contain any malicious code. You can also trust us ;)

[installation]: https://github.com/jxn-30/better-moodle/releases/latest/download/better-moodle.user.js
[githubIssueBug]: https://github.com/jxn-30/better-moodle/issues/new?labels=bug&template=bug.yml&title=%5BBUG%5D%3A+
[githubIssueBugNew]: https://github.com/jxn-30/better-moodle/issues/new?labels=bug&template=bug.yml&title=%5BBUG%5D%3A+
[githubIssueFeature]: https://github.com/jxn-30/better-moodle/issues/new?labels=&template=feature.yml&title=%5BFeature+request%5D%3A+
[githubIssueFeatureNew]: https://github.com/jxn-30/better-moodle/issues/new?template=feature.yml&title=%5BFeature+request%5D%3A+
[mailHelp]: mailto:uzl@better-moodle.dev?subject=Better%20Moodle%3A%20I%20need%20help%20please&body=Hello%20Jan%2C%0A%0AI%20have%20a%20question%20about%20Better-Moodle%2C%20but%20unfortunately%20I%20didn%27t%20find%20an%20answer%20in%20the%20FAQ%3A%0A%0A%5B...%5D%0A%0AMany%20thanks%20and%20best%20regards%0A%5BYour%20name%5D
[mailBug]: mailto:uzl@better-moodle.dev?subject=Better%20Moodle%3A%20Bug-Report&body=Hello%20Jan%2C%0AI%20have%20found%20a%20bug%20in%20Better-Moodle%21%0A%0AI%20am%20using%20this%20browser%3A%0AI%20use%20this%20version%20of%20Better-Moodle%3A%201.42.1%0AI%20was%20following%20these%20steps%20when%20the%20problem%20occurred%3A%0AThis%20is%20the%20behavior%20I%20would%20have%20expected%20instead%3A%0A%0ABest%20regards%0A%5BYour%20name%5D
[mailFeature]: mailto:uzl@better-moodle.dev?subject=Better%20Moodle%3A%20Feature%20idea&body=Hello%20Jan%2C%0AI%20have%20a%20great%20suggestion%20for%20Better-Moodle%3A%0A%0A%5Bhere%20is%20a%20detailed%20description%20of%20the%20suggestion%5D%0A%0ABest%20regards%0A%5Byour%20name%5D"
