import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    // Only allow admin or secure execution. For now, it's open but we can add a simple token check if needed.
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');
    if (secret !== 'smd-magic') {
        return NextResponse.json({ success: false, message: 'Unauthorized. Use ?secret=smd-magic' }, { status: 401 });
    }

    try {
        // Find up to 5 products that have empty usage or description
        const [products]: any = await pool.query(`
            SELECT id, name, brand, category, description, features, specification, usage_directions as \`usage\`
            FROM products 
            WHERE description IS NULL OR description = '' 
               OR features IS NULL OR features = ''
               OR specification IS NULL OR specification = ''
               OR usage_directions IS NULL OR usage_directions = ''
            LIMIT 3
        `);

        if (products.length === 0) {
            return NextResponse.json({ success: true, message: 'All products are already fully enriched!' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, message: 'Missing Gemini API Key' }, { status: 500 });
        }

        let enrichedCount = 0;
        const results = [];

        for (const product of products) {
            const prompt = `You are an expert medical equipment copywriter for SMD MEDICARE.
I need detailed, professional content for this medical product:
Product Name: ${product.name}
Brand: ${product.brand}
Category: ${product.category}

Please return ONLY a raw JSON object (no markdown, no backticks) with these exactly 4 keys:
1. "description": A solid 3-4 line professional description of the product. Use HTML <p> tags.
2. "features": A bulleted list of 5-7 key features. Return as HTML <ul><li>...</li></ul> string.
3. "specification": A JSON array string of technical specs in this format: "[{\\"name\\":\\"Power\\",\\"description\\":\\"220V\\"}, ...]" (return a JSON string containing the array, properly escaped).
4. "usage": A brief guide on how to use it or who should use it (HTML format, maybe a <ul> or <p>).

If you don't know the exact real specs, provide highly plausible generic specs for a professional medical device of this name.`;

            const payload = {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                try {
                    const parsed = JSON.parse(text);
                    
                    // Keep existing data if it already exists, otherwise use AI data
                    const newDesc = (product.description && product.description.length > 10) ? product.description : parsed.description;
                    const newFeat = (product.features && product.features.length > 10) ? product.features : parsed.features;
                    const newSpec = (product.specification && product.specification.length > 10) ? product.specification : parsed.specification;
                    const newUse = (product.usage && product.usage.length > 10) ? product.usage : parsed.usage;

                    await pool.query(
                        'UPDATE products SET description = ?, features = ?, specification = ?, usage_directions = ? WHERE id = ?',
                        [newDesc, newFeat, newSpec, newUse, product.id]
                    );

                    results.push({ id: product.id, name: product.name, status: 'Enriched' });
                    enrichedCount++;
                } catch (parseErr) {
                    results.push({ id: product.id, name: product.name, status: 'Failed JSON parse' });
                }
            } else {
                 results.push({ id: product.id, name: product.name, status: 'Gemini API Error' });
            }
        }

        return NextResponse.json({ success: true, enrichedCount, results });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
