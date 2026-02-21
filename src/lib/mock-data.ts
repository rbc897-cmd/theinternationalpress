export const MOCK_POSTS = [
    {
        id: 'mock-1',
        title_en: 'New Visa Rules Announced for International Students in Europe',
        title_ne: 'युरोपका अन्तर्राष्ट्रिय विद्यार्थीहरूका लागि नयाँ भिसा नियमहरू घोषणा',
        slug_en: 'new-visa-rules-europe-students',
        slug_ne: 'new-visa-rules-europe-students-ne',
        excerpt_en: 'Major changes in visa policies for non-EU students have been announced by several European countries, impacting work hours and post-study opportunities.',
        excerpt_ne: 'युरोपका विभिन्न देशहरूले गैर-इयु विद्यार्थीहरूका लागि भिसा नीतिमा ठूलो परिवर्तनको घोषणा गरेका छन्, जसले काम गर्ने समय र अध्ययन पछिका अवसरहरूलाई असर गर्नेछ।',
        content_en: 'Full content goes here...',
        content_ne: 'पूरा विवरण यहाँ छ...',
        status: 'published',
        category: {
            slug: 'study-abroad',
            name_en: 'Study Abroad',
            name_ne: 'विदेश अध्ययन'
        },
        author: {
            full_name: 'Sarah Jenkins'
        },
        featured_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
        published_at: new Date().toISOString(),
    },
    {
        id: 'mock-2',
        title_en: 'Top 5 Schengen Countries for Work Visas in 2026',
        title_ne: '२०२६ मा वर्क भिसाका लागि उत्कृष्ट ५ सेन्जेन देशहरू',
        slug_en: 'top-schengen-work-visas-2026',
        slug_ne: 'top-schengen-work-visas-2026-ne',
        excerpt_en: 'Looking to work in Europe? Here is a detailed guide to the countries with the highest approval rates for work permits this year.',
        excerpt_ne: 'युरोपमा काम गर्न खोज्दै हुनुहुन्छ? यो वर्ष वर्क पर्मिट स्वीकृत दर सबैभन्दा बढी रहेका देशहरूको विस्तृत गाइड यहाँ छ।',
        content_en: 'Content...',
        content_ne: 'विवरण...',
        status: 'published',
        category: {
            slug: 'work-permit',
            name_en: 'Work Permit',
            name_ne: 'वर्क पर्मिट'
        },
        author: {
            full_name: 'Rajesh Hamal'
        },
        featured_image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80',
        published_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'mock-3',
        title_en: 'Germany Introduces Opportunity Card for Skilled Workers',
        title_ne: 'जर्मनीले दक्ष कामदारहरूका लागि अवसर कार्ड (Opportunity Card) सुरु गर्यो',
        slug_en: 'germany-opportunity-card',
        slug_ne: 'germany-opportunity-card-ne',
        excerpt_en: 'The new Chancenkarte allow skilled workers from non-EU countries to come to Germany to look for work without a job offer.',
        excerpt_ne: 'नयाँ चान्सनकार्टेले गैर-इयु देशका दक्ष कामदारहरूलाई जब अफर बिना नै काम खोज्न जर्मनी आउन अनुमति दिन्छ।',
        status: 'published',
        category: {
            slug: 'immigration',
            name_en: 'Immigration',
            name_ne: 'आप्रवासन'
        },
        author: {
            full_name: 'Hans Miller'
        },
        featured_image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&q=80',
        published_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 'mock-4',
        title_en: 'Portugal Digital Nomad Visa: Everything You Need to Know',
        title_ne: 'पोर्चुगल डिजिटल नोम्याड भिसा: तपाईंले जान्नै पर्ने सबै कुरा',
        slug_en: 'portugal-digital-nomad-visa',
        slug_ne: 'portugal-digital-nomad-visa-ne',
        excerpt_en: 'Portugal has become a hotspot for remote workers. Learn about income requirements and application process for the D8 visa.',
        excerpt_ne: 'पोर्चुगल रिमोट वर्करहरूका लागि प्रमुख गन्तव्य बनेको छ। D8 भिसाको लागि आम्दानी आवश्यकताहरू र आवेदन प्रक्रिया बारे जान्नुहोस्।',
        status: 'published',
        category: {
            slug: 'lifestyle',
            name_en: 'Lifestyle',
            name_ne: 'जीवनशैली'
        },
        author: {
            full_name: 'Maria Silva'
        },
        featured_image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd81?auto=format&fit=crop&q=80',
        published_at: new Date(Date.now() - 259200000).toISOString(),
    }
];
