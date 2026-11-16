
<img width="1280" height="800" alt="01-Chinese-to-English" src="https://github.com/user-attachments/assets/9a0a95ee-a9be-4b7c-8cb4-c3860a4db769" />


# Selected Text Translator

**Selected Text Translator** is a Firefox browser extension that translates text you select on a webpage. After you select text and release the mouse button, a small rounded popup appears near the pointer with the translation and a Copy button.

The extension is made by **Ashkan Mahinfallah**.

- **Website:** [mahinfallah.com](https://www.mahinfallah.com/)
- **Current version:** 1.0.0
- **Minimum Firefox version declared by the manifest:** 140

## How to use it

1. Select a word, sentence, or short passage on a regular webpage.
2. Release the mouse button.
3. Read the translation in the popup beside the pointer.
4. Select **Copy** to copy the translated text.
5. Click outside the popup or press **Escape** to close it.

The popup adjusts its position near the edge of the browser window so it remains visible. The extension can also translate selected text in ordinary text fields. It does not run on Firefox internal pages such as Settings or the Add-ons Manager.

## Features

- Translate selected webpage text into a chosen target language.
- Choose a source language or use automatic language detection.
- Display the result in a compact popup near the pointer.
- Copy the translation with one click.
- Close the popup with Escape or a click elsewhere.
- Save language preferences locally in Firefox.
- Use the extension without a MyMemory API key or account.

## Language settings

Open the extension from its toolbar icon to select the source and target languages. The default source is automatic detection, and the default target is Persian.

The available language codes in the current build are Afrikaans, Arabic, Bengali, Bulgarian, Catalan, Chinese (Simplified), Chinese (Traditional), Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, German, Greek, Gujarati, Hebrew, Hindi, Hungarian, Indonesian, Italian, Japanese, Korean, Latvian, Lithuanian, Malay, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swedish, Swahili, Tamil, Telugu, Thai, Turkish, Ukrainian, Urdu, and Vietnamese.

The translation service may not support every possible source and target language combination. Availability and translation quality depend on MyMemory.

## Translation service

Translations are requested from MyMemory at `api.mymemory.translated.net` using HTTPS. When source language is set to automatic, the extension detects the language locally in Firefox and sends the selected text with the resolved language pair for translation.

A selection can contain up to **5,000 characters**. Longer selections need to be shortened before translating. MyMemory has its own usage limits and can limit or reject requests. The extension reports a service or network error in the popup when it cannot complete a translation.

## Privacy

The extension sends the text you select and the language pair to MyMemory so it can return a translation. It does not send the full webpage or its URL. Automatic source-language detection is performed locally in Firefox. The source and target language preferences are stored locally in Firefox.

MyMemory is an external service. Its own terms and privacy practices apply to text sent for translation. Do not translate passwords, personal messages, confidential work, or other sensitive information.

Read [PRIVACY-POLICY.md](PRIVACY-POLICY.md) for the complete policy. If this repository is public, the policy can be linked from the Firefox Add-ons listing using the public GitHub page for that file.

## Installation for testing

1. Download this repository from GitHub and extract the ZIP file.
2. In Firefox, open `about:debugging#/runtime/this-firefox`.
3. Select **This Firefox**.
4. Select **Load Temporary Add-on…**.
5. Open the project folder and select **manifest.json**.
6. Visit a regular HTTP or HTTPS webpage, select a short piece of text, and check the translation and Copy button.

A temporary add-on is removed when Firefox closes or restarts. This method is intended for testing. For normal installation, use the Firefox Add-ons listing after Mozilla has reviewed and signed the submitted extension.

## Screenshots

The repository includes illustrative previews of the extension popup and sample translations. They show Chinese to English and French to German. These are designed mockups rather than captures from a live Firefox session.

- [Chinese to English](docs/screenshots/01-Chinese-to-English.png)
- [French to German](docs/screenshots/02-French-to-German.png)

## Permissions

- **Storage** saves the selected source and target language preferences in Firefox.
- **Access to MyMemory** lets the extension send selected text and the language pair to the translation service.
- **Access to regular webpages** lets the extension detect text selected by the user and display its popup on HTTP and HTTPS pages.

The extension does not need access to browser history, bookmarks, or account credentials.

## Project structure

| File or folder | Purpose |
| --- | --- |
| `manifest.json` | Extension metadata, Firefox minimum version, permissions, and script entry points. |
| `selection.js` | Detects the selected text and displays the popup. |
| `background.js` | Detects the source language and requests translations from MyMemory. |
| `languages.js` | Lists available language codes and default preferences. |
| `settings.html` | Language settings page structure. |
| `settings.css` | Language settings page styles. |
| `settings.js` | Language settings page behavior. |
| `icons/` | Extension toolbar and listing icons. |
| `docs/screenshots/` | Illustrative sample images. |
| `docs/AMO-Listing-Copy.txt` | Prepared copy for the Firefox Add-ons listing. |
| `PRIVACY-POLICY.md` | Explains what information is sent to the translation service. |

## Development

This is a plain Firefox WebExtension. It has no build step and does not require Node.js, a separate server, or an API key. The source files can be edited directly.

The extension is declared for Firefox 140 and later in `manifest.json`. Test it in Firefox before relying on it or submitting a release. Website selection and clipboard behavior can vary between pages and browser versions.

## Reporting an issue

If you find a problem, open an issue in this GitHub repository and include:

- Your Firefox version.
- The language pair you selected.
- Whether source detection was automatic or manually selected.
- The error shown in the popup, if any.

Do not include private text from a webpage in an issue report.

## License

No reuse license is included in this repository yet. Contact the author for permission to reuse or redistribute the source code unless a license is added.
