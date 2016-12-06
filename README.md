hec-jissho3
==========

<!---
This file is generated by ape-tmpl. Do not update manually.
--->

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_com_shield_url]][bd_travis_com_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_repo_url]: https://github.com/realglobe-Inc/hec-jissho3
[bd_travis_url]: http://travis-ci.org/realglobe-Inc/hec-jissho3
[bd_travis_shield_url]: http://img.shields.io/travis/realglobe-Inc/hec-jissho3.svg?style=flat
[bd_travis_com_url]: http://travis-ci.com/realglobe-Inc/hec-jissho3
[bd_travis_com_shield_url]: https://api.travis-ci.com/realglobe-Inc/hec-jissho3.svg?token=aeFzCpBZebyaRijpCFmm
[bd_license_url]: https://github.com/realglobe-Inc/hec-jissho3/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/realglobe-Inc/hec-jissho3
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/realglobe-Inc/hec-jissho3.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/realglobe-Inc/hec-jissho3.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/realglobe-Inc/hec-jissho3
[bd_gemnasium_shield_url]: https://gemnasium.com/realglobe-Inc/hec-jissho3.svg
[bd_npm_url]: http://www.npmjs.org/package/hec-jissho3
[bd_npm_shield_url]: http://img.shields.io/npm/v/hec-jissho3.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

総務省IoT実証実験3

<!-- Description End -->


<!-- Overview Start -->
<a name="overview"></a>


[![favicon_url]][app_url]

認証パスワード： `realglobe`

[app_url]: http://edac.online/jissho3
[favicon_url]: doc/images/favicon.png


<!-- Overview End -->


<!-- Sections Start -->
<a name="sections"></a>

<!-- Section from "doc/guides/00.Requirements.md.hbs" Start -->

<a name="section-doc-guides-00-requirements-md"></a>

Requirements
-----

<a href="https://nodejs.org">
  <img src="https://realglobe-inc.github.io/sugos-assets/images/nodejs-banner.png"
       alt="Node.js"
       height="40"
       style="height:40px"
  /></a>
<a href="https://docs.npmjs.com/">
  <img src="https://realglobe-inc.github.io/sugos-assets/images/npm-banner.png"
       alt="NPM"
       height="40"
       style="height:40px"
  /></a>

+ [Node.js ( >=6 )][node_download_url]
+ [npm ( >=3 )][npm_url]

[node_download_url]: https://nodejs.org/en/download/
[npm_url]: https://docs.npmjs.com/


<!-- Section from "doc/guides/00.Requirements.md.hbs" End -->

<!-- Section from "doc/guides/11.Setup Cloud.md.hbs" Start -->

<a name="section-doc-guides-11-setup-cloud-md"></a>

### Setup

Install

```bash
$ git clone https://github.com/realglobe-Inc/hec-jissho3.git
$ cd hec-jissho3
$ npm install
```

In develepment

```bash
$ npm run dev
```

In production, compile and start the servers.

```bash
$ NODE_ENV=production npm start
```


<!-- Section from "doc/guides/11.Setup Cloud.md.hbs" End -->

<!-- Section from "doc/guides/20.Actor 規約.md.hbs" Start -->

<a name="section-doc-guides-20-actor-規約-md"></a>

Actor 規約
----
SUGO-Hub に接続する Actor の key は以下のようにする。名前の頭はすべて `qq:*` とする。

|key種別|key|
|------|---|
|通報アプリ|`qq:reporter:*`|
|ドローン|`qq:drone:*`|


<!-- Section from "doc/guides/20.Actor 規約.md.hbs" End -->


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/realglobe-Inc/hec-jissho3/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------

+ [sugos][sugos_url]

[sugos_url]: https://github.com/realglobe-Inc/sugos

<!-- Links End -->
