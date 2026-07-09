const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const assetsPath = path.join(__dirname, "..", "src", "assets");

const validExtensions = [".jpg", ".jpeg", ".png"];

function getMaxWidth(filePath) {
    const normalizedPath = filePath.replaceAll("\\", "/").toLowerCase();

    if (normalizedPath.includes("/profile/")) {
        return 700;
    }

    if (normalizedPath.includes("/preview/")) {
        return 900;
    }

    if (normalizedPath.includes("/certificates/")) {
        return 1000;
    }

    if (normalizedPath.includes("/projects/")) {
        return 1200;
    }

    return 1000;
}

function getImagesFromFolder(folderPath) {
    const files = fs.readdirSync(folderPath);
    let images = [];

    files.forEach(function (file) {
        const fullPath = path.join(folderPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            images = images.concat(getImagesFromFolder(fullPath));
            return;
        }

        const extension = path.extname(file).toLowerCase();

        if (validExtensions.includes(extension)) {
            images.push(fullPath);
        }
    });

    return images;
}

async function optimizeImage(imagePath) {
    const folder = path.dirname(imagePath);
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const outputPath = path.join(folder, `${fileName}.webp`);
    const maxWidth = getMaxWidth(imagePath);

    await sharp(imagePath)
        .resize({
            width: maxWidth,
            withoutEnlargement: true,
        })
        .webp({
            quality: 80,
        })
        .toFile(outputPath);

    console.log(`Imagem otimizada: ${outputPath}`);
}

async function optimizeImages() {
    if (!fs.existsSync(assetsPath)) {
        console.log("Pasta src/assets não encontrada.");
        return;
    }

    const images = getImagesFromFolder(assetsPath);

    if (images.length === 0) {
        console.log("Nenhuma imagem JPG, JPEG ou PNG encontrada.");
        return;
    }

    console.log(`Encontradas ${images.length} imagem(ns).`);

    for (const image of images) {
        await optimizeImage(image);
    }

    console.log("Otimização finalizada.");
}

optimizeImages();