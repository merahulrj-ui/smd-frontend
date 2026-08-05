import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

const levenshtein = (a: string, b: string) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

const generateCarouselHtml = (products: any[]) => {
    let html = '<div class="my-2.5 -mx-[15px] px-[15px]"><div class="flex gap-2.5 overflow-x-auto pb-2.5 snap-x snap-mandatory custom-scrollbar">';
    products.forEach(p => {
        const imageUrl = p.image ? (p.image.startsWith('http') ? p.image : (p.image.includes('/') ? `/backend-media/${p.image}` : `/backend-media/images/${p.image}`)) : '/backend-media/images/placeholder.png';
        const productUrl = `/product/${p.slug}`;
        const name = p.name ? p.name.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
        const price = p.price > 0 ? '₹' + Number(p.price).toLocaleString('en-IN') : 'Price on Request';
        let mrp = '';
        let discount = '';
        
        if (p.mrp > p.price && p.mrp > 0) {
            mrp = `<span class="text-[11px] text-slate-400 line-through">₹${Number(p.mrp).toLocaleString('en-IN')}</span>`;
            const pct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
            discount = `<span class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm z-10">${pct}% OFF</span>`;
        }
        
        html += '<div style="flex:0 0 160px;scroll-snap-align:start;">';
        html += '<div class="flex flex-col bg-white border border-slate-200 rounded-xl p-2.5 h-full shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all relative">';
        html += discount;
        html += `<a href="${productUrl}" class="no-underline block outline-none group">`;
        html += `<div class="h-[100px] w-full flex items-center justify-center mb-2.5 rounded-lg overflow-hidden bg-slate-50"><img src="${imageUrl}" alt="${name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" onerror="this.src='https://placehold.co/400x400/EFEFEF/AAAAAA&text=No+Image'"></div>`;
        html += `<h4 class="text-[12.5px] font-semibold text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">${name}</h4>`;
        html += '</a>';
        html += `<div class="mt-auto"><div class="flex flex-col gap-0.5 mb-2.5 min-h-[35px] justify-end"><span class="text-[13px] font-bold text-blue-700">${price}</span> ${mrp}</div>`;
        const escapedName = name.replace(/'/g, "\\'");
        html += `<div class="w-full"><button class="w-full bg-blue-600 hover:bg-blue-700 text-white border-none py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors flex items-center justify-center shadow-sm" data-name="${name}" onclick="event.preventDefault();if(typeof openInquiryModal==='function'){openInquiryModal('${escapedName}','Product Inquiry');}"><i class="fas fa-paper-plane mr-1"></i> Get Best Price</button></div></div>`;
        html += '</div></div>';
    });
    html += '</div></div>';
    return html.replace(/[\r\n]/g, '');
};

const searchProducts = async (query: string) => {
    let correctedBrand: string | null = null;
    let searchedKeyword: string | null = null;

    if (/\b(top|offers|popular|best|trending|all)\b/i.test(query)) {
        const [rows]: any = await pool.query("SELECT * FROM products WHERE image IS NOT NULL AND image != '' AND image != 'images/placeholder.png' AND image != 'images/Med.jpg' ORDER BY RAND() LIMIT 5");
        return { products: rows, correctedBrand: null, searchedKeyword: 'top offers' };
    }

    const stopWords = [
        'show', 'me', 'some', 'affordable', 'best', 'cheap', 'what', 'is', 'the', 'price', 'of', 'i', 'need', 'want', 'buy', 'looking', 'for', 'features', 'details', 'specification', 'specs', 'about', 'tell', 'describe', 'give', 'have', 'do', 'you',
        'hai', 'kya', 'tumhare', 'paas', 'pas', 'chahiye', 'ka', 'ki', 'ke', 'ko', 'dikhao', 'batao', 'aur', 'mein', 'se', 'yeh', 'woh', 'aapke', 'mujhko', 'mujhe', 'humko', 'humein', 'koi', 'bhi', 'mil', 'jayega', 'milega', 'hum', 'ham', 'aap', 'apko', 'aapko', 'mera', 'meri', 'mere', 'iska', 'iski', 'iske', 'usko', 'uski', 'uske',
        'machine', 'kitne', 'kitna', 'wala', 'wali', 'kaisa', 'kaise', 'karna', 'karni', 'kyu', 'kaha', 'kahan', 'kab',
        'tum', 'tumhara', 'naam', 'kaun', 'ho', 'baat', 'kar', 'sakte', 'skte', 'sakta', 'skta', 'sakti', 'skti', 'bol', 'hello', 'hi', 'hey', 'ji', 'haan', 'ha', 'na', 'nahi', 'nhi'
    ];
    
    let words = query.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().split(' ');
    let keywords = words.filter(w => !stopWords.includes(w) && w.length >= 2);
    
    keywords = keywords.map(w => {
        if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) {
            return w.slice(0, -1);
        }
        return w;
    });

    if (keywords.length === 0) return { products: [], correctedBrand, searchedKeyword };

    let sql = "SELECT * FROM products WHERE image IS NOT NULL AND image != '' AND image != 'images/placeholder.png' AND image != 'images/Med.jpg' AND (";
    const params: any[] = [];
    keywords.forEach((word, index) => {
        if (index > 0) sql += ' OR ';
        sql += '(name LIKE ? OR brand LIKE ? OR category LIKE ?)';
        const likeWord = `%${word}%`;
        params.push(likeWord, likeWord, likeWord);
    });
    sql += ') LIMIT 5';

    let [products]: any = await pool.query(sql, params);

    if (products.length === 0 && keywords.length > 0) {
        searchedKeyword = keywords[0];
        const [brands]: any = await pool.query('SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL');
        let closest = null;
        let shortest = -1;

        brands.forEach((b: any) => {
            if (!b.brand) return;
            // Only do fuzzy matching for words longer than 3 characters to avoid matching Hindi conversational words like "bol" or "tum"
            if (searchedKeyword!.length <= 3) return;
            
            const lev = levenshtein(searchedKeyword!.toLowerCase(), b.brand.toLowerCase());
            if (lev <= 2) {
                if (lev === 0) { closest = b.brand; shortest = 0; }
                else if (lev <= shortest || shortest < 0) {
                    closest = b.brand;
                    shortest = lev;
                }
            }
        });

        if (closest) {
            const [matchedProducts]: any = await pool.query("SELECT * FROM products WHERE image IS NOT NULL AND image != '' AND image != 'images/placeholder.png' AND image != 'images/Med.jpg' AND brand LIKE ? LIMIT 5", [`%${closest}%`]);
            products = matchedProducts;
            correctedBrand = closest;
        }
    }

    return { products, correctedBrand, searchedKeyword };
};

export async function POST(request: Request) {
    try {
        // 1. IP-based Rate Limiting (Max 20 chat messages per IP per 5 minutes)
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const rateLimit = checkRateLimit(`chat_ip_${ip}`, 20, 5 * 60 * 1000);
        if (!rateLimit.allowed) {
            return NextResponse.json({ success: false, reply: 'You are sending messages too fast. Please wait a minute before sending another message.' }, { status: 429 });
        }

        const body = await request.json();
        const { message: rawMessage, history = [] } = body;

        if (!rawMessage) {
            return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 });
        }

        if (rawMessage.length > 500) {
            return NextResponse.json({ success: false, reply: 'Message is too long. Please keep it under 500 characters.' }, { status: 400 });
        }

        const wordCount = rawMessage.trim().split(/\s+/).length;
        if (wordCount > 30) {
            return NextResponse.json({ success: false, reply: 'Your message contains too many words. Please ask a short, clear question about a product or price.' }, { status: 400 });
        }

        let userMessage = rawMessage.trim().toLowerCase();

        // 1. Check Smart FAQs (No AI, No Product Search needed)
        try {
            const [faqs]: any = await pool.query('SELECT pattern, answer FROM chat_faqs');
            for (let faq of faqs) {
                const regex = new RegExp(`\\b(${faq.pattern})\\b`, 'i');
                if (regex.test(userMessage)) {
                    return NextResponse.json({ success: true, reply: faq.answer, raw_reply: faq.answer, fast_track: true });
                }
            }
        } catch(e) { console.error('FAQ Check Error', e); }

        // 2. Intent Matching (Price & Bulk & Human)
        const isBulkIntent = /\b(bulk|wholesale|distributor|quantity|bada order)\b/i.test(userMessage);
        const isPriceIntent = /\b(price of|kitne ka hai|rate|cost|price)\b/i.test(userMessage);
        const isHumanIntent = /\b(talk to|speak to|contact|human|expert|agent|customer care|support|call|baat kar|sampark|help)\b/i.test(userMessage);

        if (isBulkIntent) {
            return NextResponse.json({ success: true, reply: "That sounds like a bulk order request! 📦 We provide special wholesale pricing for hospitals and distributors. Please click the **'Become a Seller/Partner'** button on the top right, or directly contact us on WhatsApp so our sales team can send you a formal quotation.", fast_track: true });
        }

        if (isHumanIntent) {
            return NextResponse.json({ success: true, reply: "Sure! 📞 You can connect with our human experts directly on WhatsApp for personalized assistance. Just click the **'Talk to a Human on WhatsApp'** link above, or message us at **+91 9555422455**.", fast_track: true });
        }

        // 3. Synonym Replacement (e.g. "sugar check" -> "glucometer")
        try {
            const [synonyms]: any = await pool.query('SELECT keyword, maps_to FROM chat_synonyms');
            for (let syn of synonyms) {
                if (userMessage.includes(syn.keyword.toLowerCase())) {
                    userMessage = userMessage.replace(new RegExp(syn.keyword, 'gi'), syn.maps_to);
                }
            }
        } catch(e) { console.error('Synonym Check Error', e); }

        // Cache check moved below product search
        // 4. Search Products Database
        const { products, correctedBrand, searchedKeyword } = await searchProducts(userMessage);
        
        // 5. Fuzzy Cache Check (Done after product search so we can inject carousel)
        try {
            const strippedMsg = userMessage.replace(/[^a-zA-Z0-9]/g, '');
            const [cachedQAs]: any = await pool.query("SELECT answer FROM jayanti_qa_caches WHERE REPLACE(REPLACE(REPLACE(question, ' ', ''), '?', ''), '.', '') = ? LIMIT 1", [strippedMsg]);
            if (cachedQAs.length > 0) {
                let reply = cachedQAs[0].answer;
                reply = reply.replace(new RegExp('(https?://[^\\s<"\']+)', 'g'), '<a href="$1" target="_blank" class="chat-link">$1</a>');
                
                if (reply.includes('[CAROUSEL]') && products.length > 0) {
                     const carouselHtml = generateCarouselHtml(products);
                     reply = reply.replace(/\[CAROUSEL\]/gi, `<br><br>${carouselHtml}`);
                } else {
                     reply = reply.replace(/\[CAROUSEL\]/gi, '');
                }
                return NextResponse.json({ success: true, reply, raw_reply: cachedQAs[0].answer, from_cache: true });
            }
        } catch(e) { console.error('Cache DB read error', e); }

        let contextString = "No exact matches found right now, try to answer generally or ask them to clarify based on the available brands/categories.";
        let carouselHtml = "";
        
        if (products.length > 0) {
            carouselHtml = generateCarouselHtml(products);
            const productNames = products.map((p: any) => p.name).join(', ');
            contextString = `Found the following products in the database that match the user's query: ${productNames}. Answer the user's question intelligently based on this. After your answer, you MUST append the exact tag [CAROUSEL] at the very end of your response so we can display these products to the user visually.`;
            
            // Price Intent override for AI context
            if (isPriceIntent) {
                const displayPrice = products[0].price > 0 ? `₹${Number(products[0].price).toLocaleString('en-IN')}` : 'Available on request';
                contextString += ` The price of ${products[0].name} is ${displayPrice}. Include this price naturally in your response.`;
            }
        }
        
        let typoNote = "";
        if (correctedBrand) {
            typoNote = `\nIMPORTANT SYSTEM NOTE: The user typed '${searchedKeyword}' but they likely meant the brand '${correctedBrand}'. Politely ask 'Did you mean ${correctedBrand}?' in your response.`;
        }

        const [brandsRes]: any = await pool.query('SELECT DISTINCT name FROM brands');
        const [catsRes]: any = await pool.query('SELECT DISTINCT name FROM categories');
        const availableBrands = brandsRes.map((b: any) => b.name).join(', ');
        const availableCategories = catsRes.map((c: any) => c.name).join(', ');

        const systemPrompt = `You are 'Jayanti AI', a highly intelligent, polite, and helpful virtual procurement assistant for SMD MEDICARE, a B2B medical equipment store.
Rules:
1. NEVER use profanity, abusive language, or engage in political/inappropriate topics. Politely decline if asked.
2. If the user asks for a product, check the following context data provided from our database.
3. Keep your answers concise, professional, and conversational. Do not output markdown tables.
4. If the user wants human contact, tell them they can use the 'Talk to a Human on WhatsApp' button in the chat menu.
5. LANGUAGE RULE: ALWAYS reply in the same language as the user. If they speak Hindi/Hinglish (e.g. 'kitne product hai'), reply in conversational Roman Hindi. If they speak English, reply in English.
6. AVOID HALLUCINATION: Our database ONLY contains products from these brands: [${availableBrands}] and these categories: [${availableCategories}]. NEVER suggest, ask about, or recommend ANY brand that is not in this list (e.g. do not ask 'do you want Philips?' if Philips is not listed here).
7. OUT OF STOCK / UNLISTED ITEMS STRATEGY: If the user explicitly asks for a brand or product that is NOT in our database, NEVER say 'we don\\'t have it'. Instead, assure them we can provide it. Tell them something like: 'Ji haan, humare paas hazaron products hain, lekin yeh specific product abhi yahan listed nahi hai. Hum aapko bilkul provide kar sakte hain. Humare paas aapki registered email ID hai, hum jaldi hi aapko is product ka best quotation email par bhej denge.' (Translate naturally based on the user's language).${typoNote}

[DATABASE CONTEXT]
The following products match the user's current intent from our database:
${contextString}
[/DATABASE CONTEXT]`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, reply: 'AI is currently unavailable due to missing API key configuration.' });
        }

        const contents = [
            { role: 'user', parts: [{ text: "SYSTEM INSTRUCTION: " + systemPrompt }] },
            { role: 'model', parts: [{ text: "Understood. I am Jayanti AI and will follow these instructions." }] }
        ];

        history.forEach((msg: any) => {
            const cleanContent = msg.content.replace(/\[CAROUSEL\]/g, '');
            contents.push({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: cleanContent }]
            });
        });

        contents.push({ role: 'user', parts: [{ text: userMessage }] });

        const payload = {
            contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
            }
        };

        const modelsToTry = [
            'gemini-1.5-flash',
            'gemini-3.5-flash',
            'gemini-2.5-flash',
            'gemini-flash-latest',
            'gemini-3.5-flash-lite',
            'gemini-2.0-flash-lite'
        ];

        let successResponse = null;
        let lastError = null;

        for (const model of modelsToTry) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    successResponse = await response.json();
                    break;
                } else {
                    lastError = await response.json();
                    const code = lastError?.error?.code;
                    if (![503, 429, 404].includes(code)) {
                        break;
                    }
                }
            } catch (err) {
                // network error, continue to next model
            }
        }

        if (successResponse) {
            let aiReply = successResponse.candidates[0].content.parts[0].text;
            let rawAiReply = aiReply;
            
            if (products.length > 0) {
                if (!aiReply.includes('[CAROUSEL]')) {
                    aiReply += '\n\n[CAROUSEL]'; // Fallback if AI forgets it
                }
            }
            
            try {
                const [existing]: any = await pool.query('SELECT id FROM jayanti_qa_caches WHERE question = ? LIMIT 1', [userMessage.trim()]);
                if(existing.length === 0) await pool.query('INSERT INTO jayanti_qa_caches (question, answer, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', [userMessage.trim(), rawAiReply]);
            } catch(e) { console.error('Cache DB Write Error', e); }
            
            // Format links BEFORE injecting the carousel so we don't break the HTML attributes
            let replyHtml = aiReply.replace(new RegExp('(https?://[^\\s<"\']+)', 'g'), '<a href="$1" target="_blank" class="chat-link">$1</a>');
            
            if (products.length > 0) {
                replyHtml = replyHtml.replace(/\[CAROUSEL\]/gi, `<br><br>${carouselHtml}`);
            }

            return NextResponse.json({ success: true, reply: replyHtml, raw_reply: rawAiReply });
        } else {
            console.error('Gemini API Error (All models failed):', lastError);
            return NextResponse.json({ success: false, reply: 'The AI is currently experiencing very high demand globally and cannot answer right now. You can <a href="https://wa.me/919555422455" target="_blank" class="chat-link" style="color:#25d366; font-weight:600;"><i class="fab fa-whatsapp"></i> Chat with a human on WhatsApp</a> instead!' });
        }

    } catch (e) {
        console.error("Chat Error:", e);
        return NextResponse.json({ success: false, message: 'Failed to process chat' }, { status: 500 });
    }
}
