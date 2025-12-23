export const parseOFX = (ofxString) => {
    const transactions = [];

    // Simplistic Regex approach to find STMTTRN blocks
    // This handles standard OFX blocks.
    const transactionRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
    const typeRegex = /<TRNTYPE>(.*?)(\r|\n|<)/;
    const dateRegex = /<DTPOSTED>(.*?)(\r|\n|<)/;
    const amountRegex = /<TRNAMT>(.*?)(\r|\n|<)/;
    const memoRegex = /<MEMO>(.*?)(\r|\n|<)/;
    const nameRegex = /<NAME>(.*?)(\r|\n|<)/; // Some banks use NAME instead of MEMO

    let match;
    while ((match = transactionRegex.exec(ofxString)) !== null) {
        const block = match[1];

        const dateMatch = dateRegex.exec(block);
        const amountMatch = amountRegex.exec(block);
        const memoMatch = memoRegex.exec(block);
        const nameMatch = nameRegex.exec(block);
        const typeMatch = typeRegex.exec(block);

        if (dateMatch && amountMatch) {
            // Date Format: YYYYMMDDHHMMSS... take first 8 chars
            const rawDate = dateMatch[1].trim().substring(0, 8);
            const y = rawDate.substring(0, 4);
            const m = rawDate.substring(4, 6);
            const d = rawDate.substring(6, 8);
            const formattedDate = `${y}-${m}-${d}`;

            const amount = parseFloat(amountMatch[1].trim());
            const description = (memoMatch ? memoMatch[1] : (nameMatch ? nameMatch[1] : 'Sem Descrição')).trim();

            // Auto-guess category based on description keywords
            let category = 'variable'; // Default
            let type = amount < 0 ? 'expense' : 'income';

            const descUpper = description.toUpperCase();
            if (descUpper.includes('UBER') || descUpper.includes('99POP') || descUpper.includes('POSTO')) category = 'transport';
            if (descUpper.includes('IFOOD') || descUpper.includes('RESTAURANTE') || descUpper.includes('MERCADO')) category = 'food';
            if (descUpper.includes('ALUGUEL') || descUpper.includes('COND') || descUpper.includes('LUZ') || descUpper.includes('INTERNET')) category = 'fixed';
            if (descUpper.includes('SALARIO') || descUpper.includes('PAGAMENTO')) category = 'salary';
            if (descUpper.includes('INVEST') || descUpper.includes('APORTE')) category = 'investment';

            transactions.push({
                id: Date.now() + Math.random(), // Temp ID
                date: formattedDate,
                description: description,
                amount: Math.abs(amount), // App uses absolute values + type
                type: type,
                category: category,
                rawDate: rawDate // Keep for sorting if needed
            });
        }
    }

    return transactions;
};
