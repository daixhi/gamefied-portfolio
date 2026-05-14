import { CharacterData } from './types';
import executiveCard from '../images/executive-card.png';
import strategistCard from '../images/strategist-card.png';
import creatorCard from '../images/creator-card.png';

import executiveProfile from '../images/executive-profile.glb?url';
import strategistProfile from '../images/strategist-profile.glb?url';
import creatorProfile from '../images/creator-profile.glb?url';
import boomBox from '../images/boom-box.glb?url'; 
import sketch from '../images/sketch.glb?url';
import cup from '../images/cup.glb?url';
import history from '../images/history.glb?url';
import tab from '../images/tab.glb?url';
 
export { executiveProfile, strategistProfile, creatorProfile, boomBox, sketch, cup, history, tab };

export const CHARACTERS: CharacterData[] = [
  {
    id: 'executive',
    title: 'THE EXECUTIVE',
    tagline: 'Corporate, Strategic, Adaptive ',
    motto: 'ONE YEAR POST QUALIFICATION EXPERIENCE.',
    description: 'Specializing in Intellectual Property, TMT, and Data Privacy.',
    color: '#FF77FF', 
    secondaryColor: '#C0C0C0', 
    image: executiveCard, 
    profileImage: executiveProfile, 
    theme: {
      bgGradient: 'from-[#1e293b] via-[#f0f4ff] to-[#fff5f8]',
      accentGlow: 'rgba(255, 119, 255, 0.3)',
    },
    experiences: [
      {
        id: 'prakriti-consultant',
        category: 'experience',
        title: 'LEGAL CONSULTANT',
        company: 'Prakriti Renewable Energy Solutions',
        role: 'Legal Consultant (IP & Commercial)',
        duration: 'May 2025 – Present',
        location: 'Bengaluru, India',
        contributions: [
          { title: 'Trademark Prosecution', text: 'Executed comprehensive trademark availability searches and prosecuted 4 trademark applications across 3 Nice classifications to secure brand exclusivity for new product lines.' },
          { title: 'Commercial Contracts', text: 'Negotiated and finalised 10+ commercial agreements (Vendor Contracts, Master Sales Agreements).\n\nRestructured standardised “Terms of Sale” across commercial transactions, optimising indemnity structures and reducing corporate liability exposure. Structured IP and Data Protection clauses, liability caps (indemnity limits), and Service Level Agreements to ensure robust asset protection and risk mitigation.' },
          { title: 'Regulatory Due Diligence', text: 'Conducted IP and commercial regulatory due diligence to mitigate compliance risks.' },
          { title: 'IBC Dispute Resolution', text: 'Drafted responses to operational creditors under the Insolvency and Bankruptcy Code, 2016 (“IBC”), successfully averting formal insolvency proceedings in 2 instances through pre-admission dispute resolution.' },
          { title: 'Risk Framework', text: 'Developed a risk assessment framework to analyze and mitigate insolvency exposure.' }
        ],
        accentColor: '#FF77FF'
      }
    ],
    skills: [
      { name: 'Commercial Advisory', description: 'Driving vision and execution in corporate environments.' }
    ]
  },
  {
    id: 'strategist',
    title: 'THE STUDENT',
    tagline: 'Academic, Rigorous, Relentless',
    motto: 'The pursuit of knowledge is the ultimate quest.',
    description: 'NLU Delhi & DBRANLU Alumna. Specializing in Technology and Commercial Laws, and IP Strategy.',
    color: '#B088FF', 
    secondaryColor: '#FF77FF', 
    image: strategistCard,
    profileImage: strategistProfile,
    theme: {
      bgGradient: 'from-[#f5f0ff] via-[#f0f4ff] to-[#fff5f8]',
      accentGlow: 'rgba(176, 136, 255, 0.3)',
    },
    experiences: [
      {
        id: 'nlud',
        category: 'education',
        company: 'National Law Univesity Delhi',
        title: 'POST-GRADUATION',
        role: 'LL.M. (IP Law & Management)',
        duration: '2024 – 2025',
        location: 'New Delhi, India',
        cgpa: '6.13 / 7', 
        contributions: [
          { title: 'Certifications', text: 'IP Prosecution (Acquisition, Oppositions & Maintenance)\n\nIntellectual Asset Management & IP Policy.' },
          { title: 'Specialisation', text: 'Frontier Technology Law (AI, Metaverse, & Data Protection), Transactional IP & Contract Management, Advanced Copyright, Trade Secrets.' },
          { title: 'Masters Thesis', text: 'Licensing Versus Exhaustion: An Analysis of Consumer Ownership and Creator Revenue in Digital Music Copyright.' }
        ],
        accentColor: '#B088FF'
      },
      {
        id: 'dbranlu',
        category: 'education',
        company: 'Dr B.R. Ambedkar National Law University',
        title: 'UNDERGRADUATE',
        role: 'B.A. LL.B. (Hons.)',
        duration: '2019 – 2024',
        location: 'Haryana, India',
        cgpa: '9.11 / 10 ; First Class', 
        contributions: [
          { title: 'Honours Degree', text: 'Specialized in International Law and Cyber Laws.' }
        ],
        accentColor: '#B088FF'
      },
      {
        id: 'ls-july-2024',
        category: 'experience',
        company: 'Lakshmikumaran & Sridharan',
        title: 'INTERNSHIP (TECH LAW)',
        role: 'Technology Law Intern',
        duration: 'July 2024',
        location: 'Bangalore, India',
        contributions: [
          { title: 'Policy Papers', text: 'Co-authored a 20-page White Paper on Geographical Indications (“GI”) submitted to the Government of India (“GoI”).\n\nAuthored a policy paper submitted to the GoI evaluating intermediary liability under the Information Technology Act, 2000, and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, focusing on notice-and-takedown time limits and platform liability for user-generated infringing content.\n\nAuthored a policy paper evaluating the extension of the “Basmati” GI tag to Madhya Pradesh under the Geographical Indications of Goods (Registration and Protection) Act, 1999, focusing on geographical demarcation and quality control protocols.' },
          { title: 'Analysis Reports', text: 'Drafted an analysis report on intermediary liability in copyright/streaming disputes, referencing Universal City Studios LLC v. Dotmovies. baby (2023), UTV Software Communication Ltd. v. 1337x.to (2019) (dynamic injunctions), and NSE v. Meta (deepfake takedowns), with respect to IT Act Sections 69A, 79, and Rule 3(2) IT Rules 2021.\n\nDelivered an analysis report on Section 135 of the Companies Act, 2013, regarding mandatory Corporate Social Responsibility spending after conducting primary legal research.' },
          { title: 'Memoranda', text: 'Produced a technical memorandum for a major consumer goods manufacturer (LEGO) on transitioning from expired patent protection to an “evergreen” IP model.\n\nEvaluated the viability of 3D Trademarks and Trade Dress under the Trademarks Act, 1999, while mitigating risks associated with the functionality doctrine.\n\nDelivered a technical research report on the scope of permissible amendments under Section 59 of the Patents Act, 1970; synthesised 15+ judicial precedents regarding amended claims and dosage range disclosures into a strategic compliance framework.' },
          { title: 'Technical Presentations', text: 'Produced and delivered 2 technical briefings on the “Indian Patent Prosecution Lifecycle” and “Data-Training in Generative AI,” evaluating the intersection of LLM training datasets and statutory compliance for AI-driven enterprises.' }
        ],
        accentColor: '#B088FF'
      },
      {
        id: 'tla-2023',
        category: 'experience',
        company: 'Tibetan Legal Association',
        title: 'INTERNSHIP (IP/DATA)',
        role: 'Legal Intern (Remote)',
        duration: 'August 2023',
        location: 'Himachal Pradesh, India',
        contributions: [
          { title: 'Legal Advisory', text: 'Developed a legal advisory brief on Section 43A of the IT Act for displaced populations.' },
          { title: 'Roadmaps', text: 'Drafted an IP roadmap for Tibetan producer communities in Leh, India.\n\nEvaluated trademark alternatives to Geographical Indications (GI) for Damxung Yak and Nyingchi Honey, specifically analysing the feasibility of Collective Marks and Certification Marks under the Trademarks Act, 1999, to bypass territorial origin constraints.\n\nDeveloped a framework for indigenous quality control standards to support certification mark applications.\n\nFormulated a Data Governance Roadmap for NGOs handling refugee data under the Digital Personal Data Protection (DPDP) Act, 2023.\n\nDrafted a policy framework addressing consent exemptions, fiduciary duties, and cross-border transfer restrictions for international databases.' },
          { title: 'Benchmarking Reports', text: 'Produced a cross-border regulatory benchmarking report comparing facial recognition mandates for SIM registration under China’s Personal Information Protection Law (PIPL) and the DPDP Act, identifying 5 key privacy-risk vectors specific to biometric surveillance and refugee data rights.' }
        ],
        accentColor: '#B088FF'
      },
      {
        id: 'ls-july-2023',
        category: 'experience',
        company: 'Lakshmikumaran & Sridharan',
        title: 'INTERNSHIP (IP/TECH)',
        role: 'Legal Intern',
        duration: 'July 2023',
        location: 'Bangalore, India',
        contributions: [
          { title: 'Legal Drafting', text: 'Drafted 3 formal replies to First Examination Reports for Copyright and Design infringement.\n\nAssisted in drafting arguments for an IP notice-and-takedown suit against an international OTT platform to mitigate piracy while ensuring compliance with fair use limits under Section 52(1) of the Copyright Act, 1957.' },
          { title: 'Patent Toolkit', text: 'Composed a Patent Claim Construction Toolkit synthesizing 20+ Supreme Court/High Court precedents for litigation.' },
          { title: 'Technical Briefs', text: 'Authored 2 technical briefs on clinical trial data disclosure disputes under the Drugs and Cosmetics Act, 1940 (and Rules, 1945) and the Right to Information (“RTI”) Act, 2005.\n\nFormulated a risk-assessment brief mapping Sections 8(1)(d), (e), and (h) of the RTI Act (commercial confidence, fiduciary capacity, and ongoing investigations) to balance proprietary interests against patient privacy.' },
          { title: 'Compliance Roadmaps', text: 'Developed 2 regulatory compliance roadmaps for SSMIs addressing Rule 4(2) traceability and “three-strike” grievance redressal to safeguard safe harbour (and intermediary liability) under Section 79 of the Information Technology Act, 2000.' }
        ],
        accentColor: '#B088FF'
      },
      {
        id: 'svs-attorneys',
        category: 'experience',
        company: 'SVS Attorneys',
        title: 'LEGAL INTERNSHIP',
        role: 'Legal Intern',
        duration: 'March – May 2023',
        location: 'Delhi, India',
        contributions: [
          { title: 'Supreme Court Practice', text: 'Drafted 5+ civil petitions and affidavits for the Supreme Court and Delhi High Court.' },
          { title: 'Legal Research', text: 'Produced a legal research brief on “Public Policy” grounds for setting aside arbitral awards under Section 34 of the Arbitration and Conciliation Act, 1996, due to unreasoned findings.' },
          { title: 'Briefing Paper', text: 'Authored a briefing paper on the "Surveillance vs. Privacy" dichotomy for Justice H.R. Khanna Memorial.' },
          { title: 'Research Compendiums', text: 'Co-authored a technical compendium of 30+ landmark banking judgments; produced 2 advisory notes on the “Twin Conditions” for bail under the Unlawful Activities (Prevention) Act, 1967, and the Prevention of Money Laundering Act, 2002, evaluating the legal sustainability of money laundering proceedings upon the quashing of a predicate offence.\n\nDelivered 2 research memoranda on Article 14 procedural fairness regarding the mandatory disclosure of inspection reports in departmental inquiries.' }
        ],
        accentColor: '#B088FF'
      },
      {
        id: 'alf-2023',
        category: 'experience',
        company: 'Alternative Law Forum',
        title: 'INTERNSHIP',
        role: 'Legal Intern',
        duration: 'January 2023',
        location: 'Bangalore, India',
        contributions: [
          { title: 'Legal Memoranda', text: 'Delivered 4 legal memoranda on disparate statutory frameworks analysing police guidelines under Sections 20-21 of the Immoral Traffic (Prevention) Act, penal provisions of the Juvenile Justice Act, 2015, and the regulatory classification of News Agencies under the Consumer Protection Act, 2019.' },
          { title: 'RTI Advocacy', text: 'Drafted and filed an application under the RTI Act to the Department of Public Instructions regarding educational standards in schools and colleges, and to the Director-General & Inspector General of Police, Karnataka Police, seeking disclosures regarding custodial procedures and state surveillance mechanisms affecting De-notified Tribes (DNTs).' }
        ],
        accentColor: '#B088FF'
      },
      {
        id: 'ez-returnz',
        category: 'experience',
        company: 'Ez Returnz Inc.',
        title: 'INTERNATIONAL INTERNSHIP',
        role: 'Legal Intern',
        duration: 'Dec 2020 – Mar 2021',
        location: 'New York, USA',
        contributions: [
          { title: 'SaaS Compliance', text: 'Assisted in drafting 2 core foundational documents for the company’s market entry, including SaaS Terms of Service (ToS) and comprehensive Privacy Policies, ensuring compliance ahead of a US commercial launch. Integrated regulatory requirements from the California Consumer Privacy Act (“CCPA”) and Federal Trade Commission (“FTC”) Guidelines to ensure consumer protection and IP security.' },
          { title: 'Contract Library', text: 'Assisted in developing a standardised contract library to streamline executive review, including the drafting of 10+ Non-Disclosure Agreements (NDAs) and service contracts, reducing executive contract-review time by an estimated 30%.' },
          { title: 'IP Risk Assessment', text: 'Conducted 4 IP risk assessments and patent searches to document “prior use” and mitigate regulatory exposure for new product features.\n\nResearched the enforceability of “Grant-Back” clauses and the critical role of Quality Control provisions in preventing the “Naked Licensing” of trademarks.' },
          { title: 'Bench Marking Report', text: 'Produced a cross-border regulatory benchmarking report comparing the General Data Protection Regulation (“GDPR”) with the CCPA and the California Privacy Rights Act (“CPRA”).\n\nDelivered a technical memorandum on controller liability under Article 24 and the accreditation of certification bodies under Article 43 of the GDPR.' },
        ],
        accentColor: '#B088FF'
      }
    ],
    skills: [
      { name: 'Legal Research & Drafting', description: 'Expertise in IP, TMT, and Data Privacy frameworks.' }
    ]
  },
  {
    id: 'creator',
    title: 'THE CREATIVE',
    tagline: 'Fluid, Artistic, Tech-Savvy',
    motto: 'Creativity is the highest form of law.',
    description: 'Exploring the intersection of Digital Music Copyright and Moral Rights in fashion.',
    color: '#88FFFF', 
    secondaryColor: '#ec4899', 
    image: creatorCard,
    profileImage: creatorProfile,
    floatingGlbs: [boomBox, sketch, cup, history, tab], 
    theme: {
      bgGradient: 'from-[#f0ffff] via-[#f0f4ff] to-[#fff5f8]',
      accentGlow: 'rgba(136, 255, 255, 0.3)',
    },
    // COMPLETELY REMOVED "EXPERIENCE" FOR THE CREATOR
    experiences: [
      {
        id: 'creator-publications',
        category: 'publication', 
        company: 'Publications, Paper Presentations, Workshops & Conferences',
        title: 'ACADEMIC WRITING',
        role: 'Author & Presenter',
        contributions: [
          { title: 'Responsible AI', text: 'Prakriti. (2026). Establishing Liability in Responsible AI – The Need For India To Move Beyond AI Ethics (In progress).' },
          { title: 'Banking Laws', text: 'Gupta, S. & Prakriti. (2023). Landmark Judgments on Banking Laws by the SC and HCs in 2022. SCC OnLine Blog, Exp 29.' },
          { title: 'Same-Sex Marriage', text: 'Prakriti. (2023). Marriage of Convenience: Legal Recognition of Same-Sex Marriage In India. In: International Conference On Human Rights During Covid-19 Pandemic: Issues And Challenges, 2021. Ambala: Maharishi Markandeshwar University, Mullana.' },
          { title: 'Marital Rape', text: 'Sasan, N. & Prakriti. (2022). Marital Rape vis-à-vis Human Rights – Position in India. International Conference on Human Rights, Maharishi Markandeshwar University.' },
          { title: 'Forgotten Natives', text: 'Prakriti. (2022). Hijras – The Forgotten Natives. LegalBites.in.' }
        ],
        accentColor: '#88FFFF'
      },
      {
        id: 'creator-achievements',
        category: 'achievement', 
        company: 'Academic & Co-Curricular Achievement',
        title: 'CO-CURRICULAR',
        role: 'Moot Courts & Debates',
        contributions: [
          { title: 'Philip C. Jessup', text: 'Participant, Philip C. Jessup (2020)' },
          { title: 'Manipal-Ranka Moot', text: 'Semi-Finalist, Manipal-Ranka International Moot (2021)' },
          { title: 'National MUN', text: 'Best Delegate, National MUN (2020)' },
          { title: 'Amity Essay Comp', text: '1st Prize, National Essay Competition (Amity, 2022)' },
          { title: 'Debate Competitions', text: 'First Prize in multiple national-level debate and declamation competitions.' }
        ],
        accentColor: '#88FFFF'
      },
      {
        id: 'creator-hobbies',
        category: 'hobby', 
        company: 'Auxiliary Directives',
        title: 'PERSONAL ARCHIVE',
        role: 'Off-Duty Protocols',
        contributions: [
          { title: 'Audio Frequencies', text: 'Access personal curated Apple Music playlist.', link: 'https://music.apple.com/in/playlist/pl.u-jV89boDtDZgg4kJ' },
          { title: 'Vibe Code', text: 'Check out one of my works.', link: '/' },
          { title: 'History Geek', text: 'Exploring historical archives and forgotten narratives in depth.' },
          { title: 'Sketches', text: 'Will make 10/10 sketches with anxious.' }
        ],
        accentColor: '#88FFFF'
      }
    ],
    skills: [
      { name: 'Visual Design', description: 'Translating complex ideas into clear visuals.' }
    ]
  }
];