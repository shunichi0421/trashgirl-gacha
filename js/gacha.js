const imageCount = 10;
const drawCount = 10;
let currentImages = [];

function getRandomIndices(count, max) {
  const indices = new Set();
  while (indices.size < count) {
    const rand = Math.floor(Math.random() * max) + 1;
    indices.add(rand);
  }
  return Array.from(indices);
}

document.addEventListener("DOMContentLoaded", () => {
  const imageCount = 10;
  const drawCount = 10;
  let currentImages = [];

  function getRandomIndices(count, max) {
    const indices = new Set();
    while (indices.size < count) {
      const rand = Math.floor(Math.random() * max) + 1;
      indices.add(rand);
    }
    return Array.from(indices);
  }

  const gachaBtn = document.getElementById("gachaBtn");
  const resultDiv = document.getElementById("result");
  const downloadAllBtn = document.getElementById("downloadAllBtn");

  gachaBtn.addEventListener("click", () => {
    resultDiv.innerHTML = "";
    currentImages = [];

    const indices = getRandomIndices(drawCount, imageCount);

    indices.forEach(i => {
      const imgPath = `images/img-${i}.png`;
      const filename = `img_${i}.png`;
      currentImages.push({ path: imgPath, name: filename });

      const box = document.createElement("div");
      box.className = "image-box";

      const img = document.createElement("img");
      img.src = imgPath;
      img.alt = `Trash Girl ${i}`;

      const note = document.createElement("div");
      note.className = "note";
      note.textContent = "↓ 保存または長押し保存";

      const dlBtn = document.createElement("button");
      dlBtn.textContent = "保存";
      dlBtn.className = "dl-btn";
      dlBtn.addEventListener("click", async () => {
        try {
          const res = await fetch(imgPath);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (e) {
          alert("画像の保存に失敗しました。");
          console.error(e);
        }
      });

      box.appendChild(img);
      box.appendChild(note);
      box.appendChild(dlBtn);
      resultDiv.appendChild(box);
    });

    downloadAllBtn.style.display = "block";
  });

  downloadAllBtn.addEventListener("click", async () => {
    try {
      const zip = new JSZip();
      const folder = zip.folder("TrashGirl");

      for (const item of currentImages) {
        const res = await fetch(item.path);
        const blob = await res.blob();
        folder.file(item.name, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = "TrashGirl_Gacha.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      alert("ZIP保存に失敗しました。");
      console.error(e);
    }
  });
});
