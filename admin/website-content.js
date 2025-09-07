// Website Content Management System
const websiteContent = {
    // Homepage Content
    homepage: {
        hero: {
            title: "Beri Ink Tattoo",
            subtitle: "Delicate fine line tattoos with a minimalist aesthetic",
            description: "Specializing in botanical, floral, and minimalist designs that celebrate the beauty of simplicity."
        },
        gallery: {
            title: "Portfolio",
            subtitle: "Recent work and featured pieces",
            description: "Each tattoo is carefully crafted to complement your natural beauty and personal style."
        },
        about: {
            title: "About My Work",
            description: "I specialize in delicate, fine line tattoos that celebrate the beauty of simplicity. My work focuses on botanical elements, minimalist designs, and custom pieces that tell your unique story."
        }
    },
    
    // Artist Page Content
    artist: {
        hero: {
            title: "Meet the Artist",
            subtitle: "Camila - Fine Line Tattoo Artist"
        },
        bio: {
            title: "My Story",
            content: "I've been passionate about art and design for as long as I can remember. My journey into tattooing began with a love for fine line work and minimalist aesthetics. I believe that tattoos should enhance your natural beauty, not overpower it."
        },
        philosophy: {
            title: "My Philosophy",
            content: "Every tattoo I create is a collaboration between artist and client. I take time to understand your vision and translate it into a design that will age beautifully with you."
        },
        specialties: {
            title: "Specialties",
            content: "Fine line botanical designs, minimalist symbols, delicate florals, and custom script work."
        }
    },
    
    // Vegan Page Content
    vegan: {
        hero: {
            title: "Vegan & Eco-Friendly",
            subtitle: "Committed to ethical and sustainable tattooing"
        },
        commitment: {
            title: "Our Commitment",
            content: "We are proud to be a fully vegan tattoo studio, using only cruelty-free and eco-friendly products throughout the entire tattooing process."
        },
        products: {
            title: "Vegan Products We Use",
            content: "All our inks, aftercare products, and studio supplies are vegan and cruelty-free. We also use biodegradable barriers and eco-friendly cleaning products."
        },
        aftercare: {
            title: "Vegan Aftercare",
            content: "Our recommended aftercare routine uses only plant-based, cruelty-free products that are gentle on your skin and the environment."
        }
    },
    
    // Appointment Page Content
    appointment: {
        hero: {
            title: "Book Your Appointment",
            subtitle: "Ready to get your next tattoo?"
        },
        process: {
            title: "The Process",
            content: "1. Consultation - We'll discuss your design ideas and placement. 2. Design - I'll create a custom design based on our discussion. 3. Appointment - Come in for your tattoo session. 4. Aftercare - Follow our aftercare instructions for best results."
        },
        pricing: {
            title: "Pricing",
            content: "Pricing varies based on size, complexity, and placement. Most fine line pieces start at $150. Contact us for a custom quote."
        },
        preparation: {
            title: "How to Prepare",
            content: "Get a good night's sleep, eat a substantial meal before your appointment, stay hydrated, and avoid alcohol 24 hours before your session."
        }
    },
    
    // FAQ Page Content
    faq: {
        hero: {
            title: "Frequently Asked Questions",
            subtitle: "Everything you need to know"
        },
        questions: [
            {
                question: "How much do tattoos cost?",
                answer: "Pricing varies based on size, complexity, and placement. Most fine line pieces start at $150. Contact us for a custom quote."
            },
            {
                question: "How long does a tattoo take?",
                answer: "Most fine line tattoos take 1-3 hours, depending on size and complexity. We'll give you an estimate during your consultation."
            },
            {
                question: "Do you use vegan ink?",
                answer: "Yes! We are a fully vegan studio and use only cruelty-free, vegan inks and products."
            },
            {
                question: "How should I prepare for my appointment?",
                answer: "Get a good night's sleep, eat a substantial meal before your appointment, stay hydrated, and avoid alcohol 24 hours before your session."
            },
            {
                question: "What's your cancellation policy?",
                answer: "We require 48 hours notice for cancellations. Same-day cancellations may result in a fee."
            },
            {
                question: "Do you do touch-ups?",
                answer: "Yes, we offer free touch-ups within 6 months of your original appointment for normal healing."
            }
        ]
    },
    
    // Store Page Content
    store: {
        hero: {
            title: "Temporary Tattoo Shop",
            subtitle: "Try before you ink — beautiful temporary tattoos with the same delicate aesthetic"
        },
        about: {
            title: "Why Temporary Tattoos?",
            content: "Temporary tattoos are perfect for testing out tattoo placement and size, special events and photoshoots, trying different design styles, gifting someone who loves tattoos, teenagers who are not yet old enough for permanent tattoos, and those who love the aesthetic but prefer temporary art. All designs feature the same delicate, fine line aesthetic as my permanent work, giving you a true preview of what your tattoo could look like."
        },
        instructions: {
            title: "How to Apply",
            steps: [
                { number: 1, title: "Clean & Dry", description: "Clean the skin area and make sure it's completely dry" },
                { number: 2, title: "Remove Film", description: "Peel off the clear protective film from the tattoo" },
                { number: 3, title: "Apply & Press", description: "Place tattoo face down on skin and press firmly" },
                { number: 4, title: "Wet & Wait", description: "Wet the backing paper thoroughly and wait 20 seconds or until the paper slides off" },
                { number: 5, title: "Peel Away", description: "Gently peel away the paper backing to reveal your tattoo" },
                { number: 6, title: "Enjoy!", description: "Your temporary tattoo will last 1-7 days with proper care" }
            ]
        }
    },
    
    // Footer Content
    footer: {
        newsletter: {
            title: "Join our mailing list for new tattoo designs and flash sales.",
            placeholder_name: "Your Name",
            placeholder_email: "Your Email",
            button_text: "Subscribe"
        },
        copyright: "© 2025 Beri Ink Tattoo. All rights reserved."
    },
    
    // Navigation
    navigation: {
        menu_items: [
            { text: "Gallery", link: "index.html" },
            { text: "Artist", link: "artist.html" },
            { text: "Vegan & Eco-Friendly", link: "vegan.html" },
            { text: "Appointment", link: "appointment.html" },
            { text: "Temporary Tattoo Shop", link: "store.html" },
            { text: "FAQ", link: "faq.html" }
        ]
    },
    
    // Contact Information
    contact: {
        email: "beri.tattoo@gmail.com",
        instagram: "https://www.instagram.com/beri.ink",
        facebook: "https://www.facebook.com/beriink",
        tiktok: "https://www.tiktok.com/@beri.ink",
        youtube: "https://youtube.com/@beriink"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { websiteContent };
}
