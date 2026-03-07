const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const imageUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCE...";
console.log("imageUrl starts with data:image?", String(imageUrl).startsWith("data:image"));
console.log("imageUrl length:", String(imageUrl).length);

if (imageUrl.startsWith("data:image")) {
    const matches = imageUrl.match(/^data:image\/([a-zA-Z0-9-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        console.error("Regex failed. Match output:", matches);
    } else {
        console.log("Regex passed!");
    }
}
