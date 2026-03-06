const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 👇 Sesuaikan path-nya jika perlu
const inputFolder = './public/assets/products/tas_mini/360'; 

// Batas aman maksimal WebP adalah 16383. Kita pakai 16000 agar aman.
const MAX_WEBP_DIMENSION = 16000; 

fs.readdir(inputFolder, async (err, files) => {
  if (err) {
    console.error("Gagal membaca folder:", err);
    return;
  }

  const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));

  if (pngFiles.length === 0) {
    console.log("Tidak ada file PNG di folder ini.");
    return;
  }

  console.log(`Ditemukan ${pngFiles.length} file PNG. Memulai optimasi dan konversi...`);

  for (const file of pngFiles) {
    const inputPath = path.join(inputFolder, file);
    const outputFileName = file.replace('.png', '.webp');
    const outputPath = path.join(inputFolder, outputFileName);

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      let processImage = image;

      // Jika panjang gambar melebihi batas WebP, kita resize secara proporsional
      if (metadata.width > MAX_WEBP_DIMENSION) {
        console.log(`⚠️ Resolusi ${file} kepanjangan (${metadata.width}px). Mengecilkan ke ${MAX_WEBP_DIMENSION}px...`);
        processImage = image.resize({
          width: MAX_WEBP_DIMENSION,
          withoutEnlargement: true // Pastikan aspect ratio (tingginya) ikut mengecil proporsional
        });
      }

      await processImage
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(`✅ Berhasil: ${outputFileName}`);
    } catch (err) {
      console.error(`❌ Gagal memproses ${file}:`, err.message);
    }
  }
});