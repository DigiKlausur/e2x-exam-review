<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![TypeScript][typescriptlang.org]][typescript-url]
[![Angular][Angular.dev]][Angular-url]
[![Bootstrap][Bootstrap.com]][Bootstrap-url]
[![express][expressjs.com]][expressjs-url]


<br />
<div align="center">

<h3 align="center">e2x exam review</h3>

  <p align="center">
    A simple tool for browser-based exam reviews
    <br />
    <br />
    <a href="https://github.com/DigiKlausur/e2x-exam-review/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/DigiKlausur/e2x-exam-review/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>
<br />
<br />
<br />

For more detailed information, both the frontend and backend have their own README-files:<br />

**[Frontend README](frontend/README.md)**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**[Backend README](backend/README.md)**

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <!-- <li><a href="#license">License</a></li> -->
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![e2x exam review uploader screen shot][product-screenshot]

A simple UI enables users to define an exam and upload the graded answer sheets in bulk. Upon upload the student-ID
is extracted from the file- or directory-name to match the PDF-file with a student.


<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

* any webserver like nginx or apache
* a node.js runtime
* a MongoDB
* an OpenID-connect capable Identity Provider

### Installation

See the respective README of the [backend](backend/README.md) and the [frontend](frontend/README.md) about how to set them up.

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



<!-- ROADMAP -->
## Roadmap

- [ ] Initial deployment
- [ ] Answer-sheet confirmation mechanism → make the person who uploads the files confirm the file-student-mapping
- [ ] Mobile support

See the [open issues](https://github.com/DigiKlausur/e2x-exam-review/issues) for a full list of proposed features (and known issues).


<!-- CONTACT -->
## Contact

E-Mail: [e2x@h-brs.de](mailto:e2x@h-brs.de)<br />
Project Link: [https://github.com/DigiKlausur/e2x-exam-review](https://github.com/DigiKlausur/e2x-exam-review)





<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: readme_resources/screenshot_uploader.png
<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->
[Angular.dev]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.dev
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-6628E0?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[expressjs.com]: https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white
[expressjs-url]: https://expressjs.com
[typescriptlang.org]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://typescriptlang.org
