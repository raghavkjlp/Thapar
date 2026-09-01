const express = require('express');
const cors = require('cors');
const ImageKit = require('imagekit');
const path = require('path');

// Load environment variables from parent workspace directory first
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock gallery data for fallback or local demonstration when ImageKit keys are not configured yet
const mockGalleryData = [
  {
    id: "q-bit",
    title: "Q-BIT Quantum Computing Workshop 2026",
    images: [
      {
        id: "q1",
        name: "Quantum Superposition Seminar",
        url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "q2",
        name: "Hands-on Qiskit Laboratory",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "q3",
        name: "Participant Project Presentations",
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "q4",
        name: "Q-BIT Organizing Panel Team",
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400"
      }
    ]
  },
  {
    id: "drone-fit",
    title: "DRONE-FIT: Drone Flight & Industrial Training",
    images: [
      {
        id: "d1",
        name: "Drone Assembly & Hardware Calibration",
        url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "d2",
        name: "Outdoor Flight Field Training",
        url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "d3",
        name: "GIS Mapping and Photogrammetry Analysis",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400"
      }
    ]
  },
  {
    id: "cloud-fdp",
    title: "National FDP on Cloud Infrastructure",
    images: [
      {
        id: "c1",
        name: "Kubernetes Cluster Provisioning",
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "c2",
        name: "HPC Architecture Guest Lecture",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "c3",
        name: "Faculty Lab Practical Session",
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
      }
    ]
  },
  {
    id: "green-ai",
    title: "Green Intelligence: Sustainable AI Workshop",
    images: [
      {
        id: "gi1",
        name: "Green Intelligence: Responsible & Sustainable AI Workshop Poster",
        url: "images/GreenIntelligenceResponsible&SustainableAI.jpeg",
        thumbnailUrl: "images/GreenIntelligenceResponsible&SustainableAI.jpeg"
      }
    ]
  },
  {
    id: "drone-bootcamp-2025",
    title: "Drone Technology Bootcamp 2025",
    images: [
      {
        id: "db1",
        name: "Exploring Drone Technology Bootcamp Poster",
        url: "images/dronebootcamp.jpeg",
        thumbnailUrl: "images/dronebootcamp.jpeg"
      }
    ]
  },
  {
    id: "quantum-fdp-2025",
    title: "Quantum Computing FDP 2025",
    images: [
      {
        id: "qf1",
        name: "Hybrid Quantum Computing FDP Poster",
        url: "images/quantumnov.png",
        thumbnailUrl: "images/quantum.png"
      }
    ]
  },
  {
    id: "open-day",
    title: "CSE Department Open Day Expo",
    images: [
      {
        id: "o1",
        name: "Student Innovation Project Stalls",
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "o2",
        name: "Project Evaluation by Industry Judges",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400"
      },
      {
        id: "o3",
        name: "Awards Ceremony & Keynote Address",
        url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200",
        thumbnailUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=400"
      }
    ]
  }
];

// Helper helper to get environment variables case-insensitively or with spaces (e.g. "Private key")
const getEnv = (keyName) => {
  const isPlaceholder = (val) => {
    if (!val) return true;
    const clean = val.trim().toLowerCase();
    return clean === 'your_public_key' || clean === 'your_private_key' || clean === 'your_url_endpoint' || clean === '';
  };

  const directVal = process.env[keyName];
  if (directVal && !isPlaceholder(directVal)) return directVal.trim();

  const lowerKey = keyName.toLowerCase();
  for (const envKey of Object.keys(process.env)) {
    const cleanEnvKey = envKey.toLowerCase().replace(/[-_\s]/g, '');
    const cleanTargetKey = lowerKey.replace(/[-_\s]/g, '');
    if (cleanEnvKey === cleanTargetKey) {
      const val = process.env[envKey];
      if (val && !isPlaceholder(val)) {
        return val.trim();
      }
    }
  }
  return null;
};

const getPublicKey = () => getEnv('IMAGEKIT_PUBLIC_KEY') || getEnv('publickey');
const getPrivateKey = () => getEnv('IMAGEKIT_PRIVATE_KEY') || getEnv('privatekey') || getEnv('Privatekey') || getEnv('Private key');
const getUrlEndpoint = () => getEnv('IMAGEKIT_URL_ENDPOINT') || getEnv('urlendpoint') || getEnv('urlEndpoint');

// Initialize ImageKit Client
let imagekit = null;
const isImageKitConfigured = () => {
  const pub = getPublicKey();
  const priv = getPrivateKey();
  const url = getUrlEndpoint();

  return pub && priv && url;
};

if (isImageKitConfigured()) {
  imagekit = new ImageKit({
    publicKey: getPublicKey(),
    privateKey: getPrivateKey(),
    urlEndpoint: getUrlEndpoint()
  });
  console.log("ImageKit configured successfully.");
} else {
  console.log("ImageKit keys not set or set to defaults. Backend will serve mockup events data.");
}

// Endpoint to fetch albums and photos
app.get('/api/gallery', async (req, res) => {
  if (!isImageKitConfigured()) {
    return res.json(mockGalleryData);
  }

  try {
    // Fetch files from ImageKit
    const files = await imagekit.listFiles({
      limit: 100
    });

    if (!files || files.length === 0) {
      return res.json(mockGalleryData);
    }

    // Group files by folder (event)
    const gallery = {};

    files.forEach(file => {
      // Extract folder name from filePath (e.g. "/q-bit/image.jpg" -> "q-bit")
      const pathParts = file.filePath.split('/').filter(p => p);
      const folder = pathParts.length > 1 ? pathParts[0] : 'general';

      if (!gallery[folder]) {
        gallery[folder] = [];
      }

      gallery[folder].push({
        id: file.fileId,
        name: file.name.split('.')[0].replace(/[-_]/g, ' '),
        url: file.url,
        thumbnailUrl: file.thumbnailUrl || file.url
      });
    });

    // Format response as an array of albums
    const albums = Object.keys(gallery).map(folderName => {
      const titles = {
        'q-bit': 'Q-BIT Quantum Computing Workshop 2026',
        'drone-fit': 'DRONE-FIT: Drone Flight & Industrial Training',
        'drone': 'DRONE-FIT: Drone Flight & Industrial Training',
        'green-ai': 'Green Intelligence: Sustainable AI Workshop',
        'drone-bootcamp-2025': 'Drone Technology Bootcamp 2025',
        'quantum-fdp-2025': 'Quantum Computing FDP 2025',
        'cloud-fdp': 'Cloud Infrastructure & HPC FDP',
        'stc-crypto': 'Modern Cryptography STC',
        'open-day': 'CSE Department Open Day Expo',
        'general': 'CS-CATALYST Activities'
      };

      return {
        id: folderName,
        title: titles[folderName] || folderName.split(/[-_]/g).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        images: gallery[folderName]
      };
    });

    res.json(albums);
  } catch (error) {
    console.error("Error fetching from ImageKit:", error);
    // Graceful fallback to mock data on error so UI doesn't crash
    res.json(mockGalleryData);
  }
});

// Endpoint to serve EmailJS configuration from environment variables (.env)
app.get('/api/email-config', (req, res) => {
  const serviceId = getEnv('SERVICE_ID') || '';
  const templateId = getEnv('TEMPLATE_ID') || '';
  const publicKey = getEnv('PUBLIC_KEY') || '';

  res.json({
    serviceId,
    templateId,
    publicKey
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`CS-CATALYST Gallery Server running on http://localhost:${PORT}`);
});
