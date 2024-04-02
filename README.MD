# Instagram Stalker Scraper

![GitHub](https://img.shields.io/github/license/sazumivicky/instagram-stalker-scraper)
![GitHub last commit](https://img.shields.io/github/last-commit/sazumivicky/instagram-stalker-scraper)
![GitHub issues](https://img.shields.io/github/issues/sazumivicky/instagram-stalker-scraper)

## Description

This is a simple JavaScript server using Express.js and WebDriverIO to scrape a specific website to obtain a list of Instagram stalkers from the provided username. This server is created for learning purposes and technical demonstration.

## Features

- Obtain a list of Instagram stalkers from the provided username.
- Use headless browser to maintain anonymity and efficiency.

## Installation

1. Clone this repository to your computer.
2. Make sure you have Node.js and npm installed on your computer.
3. Run the command `npm install` to install all dependencies.

## Usage

1. Run the server with the command `npm start`.
2. Make a GET request to `http://localhost:3000/stalker?username=USERNAME`, where `USERNAME` is the Instagram username you want to check.
3. The server will respond with a list of stalkers in JSON format.

## Contribution

Contributions are always welcome. To contribute, follow these steps:

1. Fork this repository.
2. Create a new branch (`git checkout -b new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to your branch (`git push origin new-feature`).
6. Create a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.