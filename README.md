# Crawl Novel & Text-to-Speech (TTS)

This project is designed to provide two key functionalities: web scraping of novel content and text-to-speech (TTS) conversion. Users can either crawl novel chapters from websites and convert them to audio or use the text-to-speech feature directly. The project supports multiple TTS services, including AWS and Azure, offering a wide variety of voices in both English and Vietnamese.

- **Video Demo**: (pending)
- **Website Demo**: (pending)
- **Preview Image**: 
<img src="https://raw.githubusercontent.com/ZettourNguyen/Crawl-Novel-and-Text-to-Speech-Frontend/main/src/assets/Crawl_ui.png">
<img src="https://raw.githubusercontent.com/ZettourNguyen/Crawl-Novel-and-Text-to-Speech-Frontend/main/src/assets/TextToSpeech_ui.png">

## Features

### Crawl Novel:
- Crawl novel content from specific websites.
- Use **Text-to-Speech** to convert the crawled text to MP3 audio files (for private use only, not publicly accessible).

### Text-to-Speech:
- Language: English, Vietnamese.
- Services: Azure AI Speech, Aws Polly
- Customize the voice (male, female, etc.) and language (English, Vietnamese).
- Utilizes modern TTS services to provide natural-sounding voices.

## Use Cases
- For users who wish to download and use the content offline.
- For users who prefer listening to novels rather than reading.
- Automating the process of converting long text content into audio files.

# How to run this project?
## With Docker (highly recommend):
#### On your terminal, type these commands to build a Docker Image:
```sh
docker compose up --build
```

#### While the Docker Image was running, uuse the Web UI via this URL:

```sh
http://localhost:4000/
```

### With the normal way:
1. On your terminal, type these commands:
    ```sh
    git clone https://github.com/ZettourNguyen/Crawl-Novel-and-Text-to-Speech-Frontend.git
    ```
    ```sh
    cd Crawl-Novel-and-Text-to-Speech-Frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

3. Run client:
    ```sh
    npm run dev
    # or
    yarn dev
    ```

4. Use the Web UI via this URL:
    ```sh
    http://localhost:4000/
    ```

If you haven't set up the backend yet, please visit [Crawl-Novel-and-Text-to-Speech-Backend](https://github.com/ZettourNguyen/Crawl-Novel-and-Text-to-Speech-Backend) for the setup instructions.

# Result
## Crawl novel

<img src="https://raw.githubusercontent.com/ZettourNguyen/Crawl-Novel-and-Text-to-Speech-Backend/main/assets/image.png" >

## Text to speech
###  Aws Polly:
##### English: `This is audio converted from text to speech.`
 
<audio controls>
      <source src="https://raw.githubusercontent.com/ZettourNguyen/Crawl-Novel-and-Text-to-Speech-Backend/main/assets/aws-english-joanna.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

### Microsoft Azure AI Speech:
##### English: `This is audio converted from text to speech.`
 
<audio controls>
    <source src="https://raw.githubusercontent.com/ZettourNguyen/Crawl-Novel-and-Text-to-Speech-Backend/main/assets/azure-english-andrew.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
</audio>
    
##### Vietnamese: `Đây là âm thanh được chuyển đổi từ văn bản thành giọng nói.`
 
<audio controls>
    <source src="https://raw.githubusercontent.com/ZettourNguyen/Crawl-Novel-and-Text-to-Speech-Backend/main/assets/azure-vietnamese-hoaimy.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
</audio>
    

