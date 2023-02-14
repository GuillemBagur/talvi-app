
document.addEventListener("DOMContentLoaded", async () => {
    const blobToData = (blob) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
    }
    
    const execOcr = async (el) => {
        const [image] = el.files;
        if(!image) {
            console.log("no image");
            return;
        }
    
        const b64 = await blobToData(image);
        const imageURL = encodeURI(b64);
    
        const text = await getTextFromImg(image);
        return text;
    }



    const worker = await Tesseract.createWorker();
    await worker.loadLanguage("spa");
    await worker.initialize("spa");

    const scan = async (img, lang = "spa") => {
        const result = await worker.recognize(img);
        return result.data;
    }
    
    const getTextFromImg = async (img, lang) => {
        const scannedImg = await scan(img, lang);
        const text = scannedImg.text;
        processTickets(text);
    }


    document.addEventListener("input", async e => {
        if(e.target.id !== "image-input") return;
        const text = await execOcr(e.target);
    });
});

