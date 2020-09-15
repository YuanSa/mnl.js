
console.log('\nThis is the sample code for MNL.js\n');

let myHeart = ['kind', 'evil', 'happy'];

console.log(`I born with ${myHeart.join(', ')}.`);

remove__x__from('evil',myHeart);

"remove__x__from('evil',myHeart);";

console.log(`Now, I have only ${myHeart.join(', ')} in my heart.\n`);

function remove__x__from(item,array) {
    array.splice(array.indexOf(item), 1);
    console.log(`Now I removed the ${item} in it.`);
}
