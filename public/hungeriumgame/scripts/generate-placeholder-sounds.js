const fs = require('fs');
const path = require('path');

// Ensure sounds directory exists
const soundsDir = path.join(process.cwd(), 'public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log(`Created directory: ${soundsDir}`);
}

// Create a proper minimal MP3 file with actual content
// This is better than a completely silent MP3 for browsers to recognize
const createMinimalMP3 = (duration = 2) => {
  // MP3 file with minimal "click" sound
  // This is much more reliable than trying to create a silent MP3
  const clickMP3Bytes = [
    // MP3 header and frames for a very short click sound
    0xFF, 0xFB, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xFF, 0xFB, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xFF, 0xFB, 0x50, 0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x00,
    0xFF, 0xFB, 0x50, 0x00, 0x1F, 0x1F, 0x1F, 0x1F, 0x1F, 0x1F, 0x00, 0x00,
    0xFF, 0xFB, 0x50, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00,
    0xFF, 0xFB, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ];
  
  // Repeat the frames to get the desired duration
  const framesNeeded = Math.ceil(duration * 10); // Each frame is ~100ms
  const mp3Data = [];
  
  for (let i = 0; i < framesNeeded; i++) {
    mp3Data.push(...clickMP3Bytes);
  }
  
  return Buffer.from(mp3Data);
};

// Generate a simple WAVE file with actual sound
const createClickWaveFile = (duration = 0.5, frequency = 440) => {
  const sampleRate = 44100;
  const numSamples = Math.floor(duration * sampleRate);
  
  // Wave file header (44 bytes)
  const header = Buffer.alloc(44);
  
  // RIFF chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + numSamples * 2, 4); // ChunkSize
  header.write('WAVE', 8);
  
  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  header.writeUInt16LE(1, 22); // NumChannels (1 for mono)
  header.writeUInt32LE(sampleRate, 24); // SampleRate
  header.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  header.writeUInt16LE(2, 32); // BlockAlign
  header.writeUInt16LE(16, 34); // BitsPerSample
  
  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(numSamples * 2, 40); // Subchunk2Size
  
  // Audio data - a quick click sound that fades out
  const audioData = Buffer.alloc(numSamples * 2);
  const clickDuration = Math.min(0.1 * sampleRate, numSamples);
  
  for (let i = 0; i < numSamples; i++) {
    let amplitude = 0;
    
    if (i < clickDuration) {
      // Create a quick click that fades out
      amplitude = 0.5 * Math.exp(-5 * i / clickDuration);
    }
    
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * amplitude * 32767;
    audioData.writeInt16LE(Math.floor(sample), i * 2);
  }
  
  return Buffer.concat([header, audioData]);
};

// Create an audio file if it doesn't exist
const createAudioFile = (filename, role = 'click') => {
  const filePath = path.join(soundsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    const fileExt = path.extname(filename).toLowerCase();
    let data;
    
    // Choose appropriate sound type based on the role
    if (role === 'background') {
      // For background music, create a longer sound
      if (fileExt === '.wav') {
        data = createClickWaveFile(3, 220); // Longer, lower frequency sound
      } else {
        data = createMinimalMP3(5); // 5 second loop
      }
      console.log(`Creating background ${fileExt} file: ${filePath}`);
    } 
    else if (role === 'gameOver') {
      // For game over, create a distinctive sound
      if (fileExt === '.wav') {
        data = createClickWaveFile(1, 200); // Lower tone for game over
      } else {
        data = createMinimalMP3(1);
      }
      console.log(`Creating game over ${fileExt} file: ${filePath}`);
    }
    else {
      // Default click sound
      if (fileExt === '.wav') {
        data = createClickWaveFile(0.1, 800); // Short, high frequency click
      } else {
        data = createMinimalMP3(0.2); // Short click
      }
      console.log(`Creating click ${fileExt} file: ${filePath}`);
    }
    
    fs.writeFileSync(filePath, data);
    return true;
  }
  
  return false;
};

// Placeholder sounds to create
const sounds = [
  { file: 'click.mp3', role: 'click' },
  { file: 'game-over.mp3', role: 'gameOver' },
  { file: 'background-music.mp3', role: 'background' }
];

// Create each placeholder sound
let created = 0;
sounds.forEach(sound => {
  if (createAudioFile(sound.file, sound.role)) {
    created++;
  }
});

if (created > 0) {
  console.log(`Created ${created} placeholder sound files.`);
  console.log(`Sound files are in: ${soundsDir}`);
  console.log('These files have minimal audio content. Replace them with real sounds for the full experience.');
} else {
  console.log('All sound files already exist.');
  console.log(`Sound files are in: ${soundsDir}`);
}

// Verify the files exist and have content
const soundFiles = fs.readdirSync(soundsDir);
console.log('Sound files available:');
soundFiles.forEach(file => {
  const filePath = path.join(soundsDir, file);
  const stats = fs.statSync(filePath);
  console.log(`- ${file} (${stats.size} bytes)`);
});

console.log('✅ Sound file check complete!');
