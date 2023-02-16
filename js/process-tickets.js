


const processTickets = async (text) => {
    let capturingProducts = false;

    let shop = new Shop();

    let ticket = new Ticket();
    ticket.products = [];


    const texts =[
        `
        VITROCLEN CREMA 45 4
        DANDNINO DO FRESA 100
        JUDIAS VERDES PLAN 1,65
        GNLLETAS CHOCOBISC 255
        ACELTUNAS VERDE PART 1,09
        TONAE TRITURADO CRE 0,40
        TONAE TRITURRDO CRE 0,40
        CERENLES CO FLAK 199
        Za GOLDEN 119
        HOGAZA GALLEGA 1,50
        PaN S/CORTEZA BINBO - COD4 — N9T
        GALLETAS MARIA 20068 099
        GMLETA ABLETA CIOC 0,
        13 ART TF CONPRA 20,06
        TIPO BASE CUOTA
        4,00 5,13 02
        10004 934 N
        2100 1 n
        PAGADO HETALICO 20,0
        CAMBIO RECIBIDO á
        `,
        
        `
        1 L
        y
        1
        MERCADONA,S.A. º|
        A-46103834 +
        ka
        — — SA p
        TELÉFONO: ! ;
        21/03/2022 12:26 24 f
        FACTURA SIMPLIFICADA: 571 1124 E
        ?
        | | t[
        E | II *-lí'
        De ! P. Unit Importe al
        1 SALCHICHON EXTRA PIY 1,45
        | BACALAO PUNTO SAL 4,15 M
        1 MINIBONBON NOCCIOLA 2,35 ME
        1 COSTILLA CARNOSA 3,85 E W
        1 BÍFIDUS NATURAL ),95 --
        1 BARRA CAMPESINA 0,55 M
        1 PANEC, 100% INTEGRAI 0,90 |
        Y CROIS.BAÑADO CACA 1,00
        1LZUMO FRESCO 1/2 L 2,33 W
        1 12 HUEVOS GRANDES -L 1,80 |
        1 AGUACATE |
        0,208 kg 4,29 €/kg ,39 |
        An o
        TOTAL (€) — 20,28
        J
        TARJETA BANCARIA -——-—-20,28
        I1VA—. _ BASE IHPONIBLE (€) CUOTA (e)
        E 3,12 0,12
        10% 15,49 1,55
        TOTAL 18,61 1,67
        TARJ, BANCARIA; 444444449444173
        N,C: 003990033 AUT: 7034072
        AIU: A0000000031010 ARI
        »
        YISA CREDITO/DEB »
        Importe: 20,28 € Visa
        ATENCIÓN AL CLIENTE - 900 500 103
        E ADMITEN DEVOLUCTONES CON TICKET
        I'E'I
        L —
        `];


    const words = await loadWords();
    

    
    const convertToNum = word => {
        const numRegex = regex.numWComma;
        if(!word.match(numRegex)) return word;
        const num = word.replace(",", ".");
        return num;
    }
    
    
    const correctWord = word => {
        word = word.toLowerCase();
        word = word.replace(/\:/, "");
        const wordLen = word.length;
        // Llevar dates i hores
    
        word = convertToNum(word);
        if(isNumeric(word)) return Number(word);
        if(wordLen < 2) return word;
        const wordsWithSameLength = words[wordLen];
        if(wordsWithSameLength.includes(word)) return word;
        let wordsRating = [];
        for(let cWord of wordsWithSameLength) {
            const distance = levenshteinDistance(word, cWord)/wordLen;
            const res = {word: cWord, distance: distance};
            wordsRating.push(res);
        }
    
        const bestCases = wordsRating.sort((a, b) => a.distance-b.distance);
        //console.log(word, bestCases.slice(0, 100));
        const bestCase = bestCases[0];
        if(bestCase.distance > .2) return word;
        return bestCase.word;
    }
    
    
    const normalizeSentence = text => {
        let allWords = text.split(/\s/).filter(word => word.length);
        const correctedWords = allWords.map(correctWord);
        return correctedWords;
    }
    
    
    
    const saveProduct = product => {
        ticket.products.push(product);
    }
    

    const understandProduct = row => {
        const words = normalizeSentence(row);
        const [totalPrice] = words.slice(1).filter(el => !isNaN(el));
        const priceIndex = words.indexOf(totalPrice);
        const name = words.slice(1, priceIndex).join(" ");
        console.log(words);
        let product = new Product;
        if(isNaN(words[0])) {

        }

        product.amount = words[0];
        product.name = name;
        product.price = totalPrice;
        ticket.products.push(product);
    }

    const getPrevRow = (row, ticketRows) => {
        const currentIndex = ticketRows.indexOf(row);
        const prevRow = ticketRows[currentIndex-1] || "";
        return prevRow;
    }

    const saveShopNif = (row) => {
        const nifRegex = regex.nif;
        if(shop.nif) return;
        const [word] = nifRegex.exec(row);
        shop.nif = word;
    }

    const cleanShopName = shopName => {
        const correctType = shopName.replace(/SI$/i, "SL").replace(/S4$/i, "SA");
    }

    const saveShopName = (row) => {
        const socialNameRegex = regex.socialName;
        if(shop.name) return;
        console.log(row, )
        const [word] = socialNameRegex.exec(row);
        shop.name = cleanShopName(word);
    }
    
    const understandTicketInRows = ticketRows => {
        const nifRegex = regex.nif;
        // Quan surt la paraula "Importe" a una fila, comencen els productes
        const socialNameRegex = regex.socialName;
    
        // Paraula "Import", molt útil perquè marca la fila on començar a capturar productes
        const startProducts = regex.startProducts;

        const stopProducts = regex.stopProducts;
    
        let actionPerRow = new Map([
            [row => stopProducts.test(row), () => capturingProducts = false],
            [row => startProducts.test(row), () => capturingProducts = true],


            [() => capturingProducts, row => {
                understandProduct(row);
            }],
    
            [row => nifRegex.test(row), row => saveShopNif(row)],
            [row => socialNameRegex.test(row), row => saveShopName(row)],

        ]);
    
    
        for(let row of ticketRows) {
            if(!row) continue;
            if(!row.length) continue;
            row = removeAccents(row);
            console.log(row);
            for(let [condition, action] of actionPerRow.entries()) {
                if(condition(row)) {
                    action(row);
                    break;
                }
            }
        }

        console.log(ticket);
        console.log(shop);
    }

    const processText = plainText => {
        const ticketInRows = plainText.split("\n");
        understandTicketInRows(ticketInRows);
    }
    

    processText(text);
    
}

//processTickets();