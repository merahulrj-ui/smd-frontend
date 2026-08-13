import pool from './src/lib/db';

const faqs = [
  // Greetings - English
  { pattern: "hello|hi|hey|good morning|good evening", answer: "Hello! 👋 Welcome to SMD MEDICARE. I'm Jayanti, your AI Assistant. How can I help you with medical equipment today?" },
  { pattern: "who are you|what is your name", answer: "I am Jayanti AI, a virtual procurement assistant for SMD MEDICARE. I can help you find products, get prices, and place bulk orders!" },
  { pattern: "thank you|thanks", answer: "You're very welcome! Let me know if you need anything else. 😊" },
  
  // Greetings - Hindi
  { pattern: "namaste|kaise ho|namaskar", answer: "Namaste! 🙏 Main Jayanti AI hoon, SMD MEDICARE ki virtual assistant. Kahiye, main aaj aapki medical equipment dhoondhne mein kaise madad kar sakti hoon?" },
  { pattern: "tum kaun ho|aapka naam kya hai|tera naam kya hai", answer: "Main Jayanti AI hoon, SMD MEDICARE ki ek smart assistant. Main aapko medical supplies dhundhne aur best prices lene mein madad karti hoon!" },
  { pattern: "shukriya|dhanyawad", answer: "Aapka swagat hai! Agar kuch aur chahiye toh zaroor batayein. 😊" },

  // Ordering - English
  { pattern: "how can i order medical supplies|how to order|order kaise|place an order|want to buy", answer: "Ordering is easy! 🛒 You can browse our products, click 'Get Best Price', and submit an inquiry. Alternatively, you can directly chat with us on WhatsApp for quick orders!" },
  { pattern: "order process|how do i buy|purchasing process", answer: "To purchase, find the product you need, add it to your catalog or click 'Get Best Price' to send us your requirements. Our sales team will instantly generate a customized quote for you." },
  
  // Ordering - Hindi
  { pattern: "order kaise kare|samaan kaise kharide|mujhe kharidna hai", answer: "Order karna bahut aasan hai! 🛒 Aap product select karein, 'Get Best Price' par click karein. Ya phir seedha WhatsApp par humse jud kar apna order place karein!" },
  { pattern: "process kya hai|kaise mangwana hai", answer: "Aapko jo product chahiye uspe 'Get Best Price' daba kar inquiry bhej dein. Humari sales team turant aapse sampark karke best quotation degi." },

  // Delivery / Shipping - English
  { pattern: "what are the delivery charges|shipping cost|delivery fee", answer: "Delivery charges depend on your location and the size of the order. 🚚 For bulk orders, we often provide free or heavily subsidized shipping across India!" },
  { pattern: "how long does delivery take|delivery time|shipping time", answer: "Standard delivery takes 3-7 business days depending on your pin code. Expedited shipping is available for urgent medical requirements." },
  { pattern: "do you ship internationally|global shipping", answer: "Currently, we focus on pan-India delivery, but we can arrange international shipping for bulk distributor orders on special request." },

  // Delivery / Shipping - Hindi
  { pattern: "delivery charge kitna hai|shipping charge|delivery kitne ki hai", answer: "Delivery charges aapke location aur order ke size par nirbhar karte hain. 🚚 Bada order (bulk) hone par hum aksar delivery free ya bahut saste mein karwa dete hain!" },
  { pattern: "kitne din mein aayega|delivery time kya hai|kab tak milega", answer: "Normally delivery mein 3 se 7 din lagte hain. Agar urgent medical requirement hai toh hum priority shipping bhi provide karte hain." },
  { pattern: "kahan kahan delivery hoti hai|all india delivery", answer: "Ji haan! Hum poore India mein pan-India delivery provide karte hain." },

  // Bulk & B2B - English
  { pattern: "do you offer bulk discounts|wholesale price|bulk order", answer: "Yes, absolutely! 📦 We specialize in B2B supply. We offer exclusive wholesale pricing and bulk discounts for hospitals, clinics, and distributors. Just click 'Talk to an Expert' to get a quote." },
  { pattern: "b2b|distributor|dealer", answer: "We warmly welcome distributors and dealers! You can register as a partner by clicking the 'Become a supplier/partner' link at the top of the website." },

  // Bulk & B2B - Hindi
  { pattern: "bulk discount milega|thok mein chahiye|wholesale rate", answer: "Ji bilkul! 📦 Hum hospitals aur distributors ke liye special wholesale rates aur bulk discounts dete hain. Apna requirement bhejein, hum best price denge." },
  { pattern: "distributor banna hai|dealer banna hai|bada order", answer: "Agar aap dealer ya distributor banna chahte hain, toh website ke upar 'Become a supplier' link par click karke register karein. Humare representative aapse judenge." },

  // Quality & Trust - English
  { pattern: "is the product genuine|original product|quality guarantee", answer: "100% Genuine! ✅ We only deal in certified, high-quality medical equipment directly sourced from trusted manufacturers. Quality is our top priority." },
  { pattern: "do you provide warranty|is there a warranty|guarantee", answer: "Yes! 🛡️ All our medical equipment comes with standard manufacturer warranties. The exact duration depends on the brand and product." },

  // Quality & Trust - Hindi
  { pattern: "kya product original hai|quality kaisi hai|asli hai", answer: "100% Asli aur Genuine! ✅ Hum sirf certified aur top-quality medical equipment mein deal karte hain jo sidhe verified brands se aate hain." },
  { pattern: "warranty milti hai|guarantee hai kya|warranty kitni hai", answer: "Ji haan! 🛡️ Sabhi medical equipments ke saath standard company warranty milti hai. Har product ki warranty uske brand par nirbhar karti hai." },

  // Returns & Refunds - English
  { pattern: "return policy|how to return|refund policy", answer: "We have a transparent return policy. If you receive a damaged or incorrect product, you can initiate a return within 7 days of delivery. For more details, check our Return Policy page." },
  
  // Returns & Refunds - Hindi
  { pattern: "wapas kaise kare|return ho jayega|refund milega", answer: "Humari return policy bahut clear hai. Agar aapko damaged ya galat product milta hai, toh aap delivery ke 7 din ke andar return initiate kar sakte hain." },

  // Payment Methods - English
  { pattern: "payment options|how to pay|cash on delivery|cod", answer: "We accept all major payment methods including Credit/Debit cards, UPI, Net Banking, and NEFT/RTGS for bulk orders. COD availability depends on the order value and pin code." },
  { pattern: "emi available|loan|installment", answer: "Yes, we offer EMI options on credit cards for high-value medical equipment. You can check the EMI options during checkout." },

  // Payment Methods - Hindi
  { pattern: "payment kaise kare|cod milega|cash on delivery hai", answer: "Aap UPI, Net Banking, NEFT/RTGS, aur Cards ke zariye payment kar sakte hain. COD (Cash on delivery) order ke size aur pin code par nirbhar karta hai." },
  { pattern: "emi par milega|kist par milega", answer: "Ji haan, mehnge medical equipments ke liye hum credit card EMI options bhi support karte hain." },

  // Support & Contact - English
  { pattern: "customer care number|contact number|support number", answer: "You can reach our support team anytime! 📞 Call or WhatsApp us at +91 9555422455, or email us from the contact page." },
  
  // Support & Contact - Hindi
  { pattern: "customer care ka number|baat karni hai|contact details", answer: "Aap humari support team se kabhi bhi baat kar sakte hain! 📞 Hamein +91 9555422455 par call ya WhatsApp karein." },
  
  // Custom Fallbacks - Mixed
  { pattern: "show me top offers|best deals|offers dikhao", answer: "Sure! Let me fetch the best deals and trending medical supplies for you right now." },
  { pattern: "i want to talk to an expert|talk to human|agent se baat karni hai", answer: "Certainly! 📞 You can connect with our human experts directly on WhatsApp for personalized assistance. Message us at +91 9555422455." },
  
  // Specifically for the buttons on UI
  { pattern: "how can i order medical supplies?", answer: "Ordering is easy! 🛒 You can browse our products, click 'Get Best Price', and submit an inquiry. Alternatively, you can directly chat with us on WhatsApp for quick orders!" },
  { pattern: "what are the delivery charges?", answer: "Delivery charges depend on your location and the size of the order. 🚚 For bulk orders, we often provide free or heavily subsidized shipping across India!" },
  { pattern: "do you offer bulk discounts?", answer: "Yes, absolutely! 📦 We specialize in B2B supply. We offer exclusive wholesale pricing and bulk discounts for hospitals, clinics, and distributors. Just click 'Talk to an Expert' to get a quote." }
];

async function seed() {
    try {
        console.log("Creating chat_faqs table if not exists...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS chat_faqs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pattern VARCHAR(255) NOT NULL,
                answer TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Truncating existing FAQs...");
        await pool.query('TRUNCATE TABLE chat_faqs');

        console.log(`Inserting ${faqs.length} FAQs...`);
        for (const faq of faqs) {
            await pool.query('INSERT INTO chat_faqs (pattern, answer) VALUES (?, ?)', [faq.pattern, faq.answer]);
        }

        console.log("Successfully seeded chat FAQs!");
        process.exit(0);
    } catch (e) {
        console.error("Error seeding FAQs:", e);
        process.exit(1);
    }
}

seed();
