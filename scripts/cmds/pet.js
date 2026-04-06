module.exports = {
  config: {
    name: "pets",
    aliases: ["pet"],
    version: "1.0.0",
    author: "Aryan Chauhan",
    shortDescription: "Manage your pets",
    category: "economy"
  },
  onStart: async function ({ api, event, usersData, args }) {
    const { threadID, senderID } = event;
    const userData = await usersData.get(senderID);

    if (!args[0]) {
      // View pets
      if (!userData.pets || userData.pets.length === 0) {
        return api.sendMessage("You don't have any pets 😔", threadID);
      }

      let petList = "Your pets:\n";
      userData.pets.forEach((pet, index) => {
        petList += `${index + 1}. ${pet.name} (Level ${pet.level}, Hunger: ${pet.hunger}, Health: ${pet.health})\n`;
      });
      return api.sendMessage(petList, threadID);
    }

    switch (args[0]) {
      case 'buy':
        // Buy a pet
        if (!args[1]) return api.sendMessage('Usage: .pets buy <pet name>', threadID);
        const petName = args.slice(1).join(' ');
        const petPrice = 100; // Example price
        if (userData.money < petPrice) return api.sendMessage('Not enough money 💸', threadID);
        userData.money -= petPrice;
        userData.pets = userData.pets || [];
        userData.pets.push({ name: petName, level: 1, hunger: 100, health: 100 });
        await usersData.set(senderID, userData);
        return api.sendMessage(`You bought a ${petName}! 🐾`, threadID);

      case 'feed':
        // Feed a pet
        if (!args[1]) return api.sendMessage('Usage: .pets feed <pet index> <food>', threadID);
        const petIndex = parseInt(args[1]) - 1;
        const food = args.slice(2).join(' ');
        if (!userData.pets || petIndex < 0 || petIndex >= userData.pets.length) return api.sendMessage('Invalid pet index 😔', threadID);
        const pet = userData.pets[petIndex];
        pet.hunger += 20;
        if (pet.hunger > 100) pet.hunger = 100;
        await usersData.set(senderID, userData);
        return api.sendMessage(`You fed ${pet.name} ${food}! 🍔`, threadID);

      case 'level':
        // Level up a pet
        if (!args[1]) return api.sendMessage('Usage: .pets level <pet index>', threadID);
        const levelIndex = parseInt(args[1]) - 1;
        if (!userData.pets || levelIndex < 0 || levelIndex >= userData.pets.length) return api.sendMessage('Invalid pet index 😔', threadID);
        const levelPet = userData.pets[levelIndex];
        levelPet.level += 1;
        await usersData.set(senderID, userData);
        return api.sendMessage(`${levelPet.name} leveled up to ${levelPet.level}! 🎉`, threadID);

      case 'breed':
        // Breed two pets
        if (!args[1] || !args[2]) return api.sendMessage('Usage: .pets breed <pet index 1> <pet index 2>', threadID);
        const pet1Index = parseInt(args[1]) - 1;
        const pet2Index = parseInt(args[2]) - 1;
        if (!userData.pets || pet1Index < 0 || pet1Index >= userData.pets.length || pet2Index < 0 || pet2Index >= userData.pets.length) return api.sendMessage('Invalid pet index 😔', threadID);
        const pet1 = userData.pets[pet1Index];
        const pet2 = userData.pets[pet2Index];
        const babyPet = { name: `Baby ${pet1.name} ${pet2.name}`, level: 1, hunger: 100, health: 100 };
        userData.pets.push(babyPet);
        await usersData.set(senderID, userData);
        return api.sendMessage(`You bred ${pet1.name} and ${pet2.name} and got a ${babyPet.name}! 🐾`, threadID);

      case 'petshop':
        // Pet shop
        if (!args[1]) return api.sendMessage('Pet shop:\n1. Food\n2. Medicine\n3. Drinks', threadID);
        switch (args[1]) {
          case 'food':
            const food = `
🍖 𝖥𝖮𝖮𝖣 𝖲𝖧𝖮𝖯 🍖
💰 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: $${userData.money.toLocaleString()}
⚪ 𝐁𝐀𝐒𝐈𝐂 𝐓𝐈𝐄𝐑:
🥖 𝐁𝐫𝐞𝐚𝐝 💰 $50,000 | 🍖+15 ❤️+5 😊+5
🍎 𝐀𝐩𝐩𝐥𝐞 💰 $75,000 | 🍖+20 ❤️+10 😊+8
🥕 𝐂𝐚𝐫𝐫𝐨𝐭 💰 $60,000 | 🍖+18 ❤️+8 😊+6
🥦 𝐁𝐫𝐨𝐜𝐜𝐨𝐥𝐢 💰 $55,000 | 🍖+16 ❤️+12 😊+4
🌽 𝐂𝐨𝐫𝐧 💰 $45,000 | 🍖+14 ❤️+6 😊+7
🍌 𝐁𝐚𝐧𝐚𝐧𝐚 💰 $65,000 | 🍖+17 ❤️+8 😊+10
🍇 𝐆𝐫𝐚𝐩𝐞𝐬 💰 $80,000 | 🍖+18 ❤️+10 😊+9
🥬 𝐋𝐞𝐭𝐭𝐮𝐜𝐞 💰 $40,000 | 🍖+12 ❤️+7 😊+3
🫐 𝐁𝐥𝐮𝐞𝐛𝐞𝐫𝐫𝐲 💰 $70,000 | 🍖+16 ❤️+11 😊+8
🍓 𝐒𝐭𝐫𝐚𝐰𝐛𝐞𝐫𝐫𝐲 💰 $72,000 | 🍖+15 ❤️+9 😊+12
🟢 𝐍𝐎𝐑𝐌𝐀𝐋 𝐓𝐈𝐄𝐑:
🍖 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐌𝐞𝐚𝐭 💰 $500,000 | 🍖+30 ❤️+25 😊+15 | ⚡+10
🐟 𝐅𝐫𝐞𝐬𝐡 𝐅𝐢𝐬𝐡 💰 $400,000 | 🍖+28 ❤️+20 😊+12 | 🧠+1
🍗 𝐂𝐡𝐢𝐜𝐤𝐞𝐧 💰 $350,000 | 🍖+25 ❤️+18 😊+10 | 💪+1
🥚 𝐄𝐠𝐠 💰 $280,000 | 🍖+22 ❤️+16 😊+8 | 💪+1
🧀 𝐂𝐡𝐞𝐞𝐬𝐞 💰 $320,000 | 🍖+24 ❤️+15 😊+14
🥞 𝐏𝐚𝐧𝐜𝐚𝐤𝐞𝐬 💰 $420,000 | 🍖+26 ❤️+14 😊+18 | ⚡+8
🍜 𝐍𝐨𝐨𝐝𝐥𝐞𝐬 💰 $380,000 | 🍖+28 ❤️+16 😊+12 | ⚡+6
🥗 𝐕𝐞𝐠𝐠𝐢𝐞 𝐒𝐚𝐥𝐚𝐝 💰 $300,000 | 🍖+20 ❤️+22 😊+10
🍱 𝐁𝐞𝐧𝐭𝐨 𝐁𝐨𝐱 💰 $450,000 | 🍖+30 ❤️+20 😊+15 | ⚡+5
🌮 𝐓𝐚𝐜𝐨 💰 $390,000 | 🍖+27 ❤️+17 😊+16
🟡 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐓𝐈𝐄𝐑:
🥩 𝐖𝐚𝐠𝐲𝐮 𝐒𝐭𝐞𝐚𝐤 💰 $2,000,000 | 🍖+40 ❤️+35 😊+25 | ⚡+20 ⚔️+2
🦞 𝐋𝐨𝐛𝐬𝐭𝐞𝐫 💰 $1,500,000 | 🍖+35 ❤️+30 😊+30 | 💨+1 🧠+2
case 'petshop':
  // Pet shop
  const petShop = `
🐾 𝖯𝖤𝖳 𝖲𝖧𝖮𝖯 🐾
💰 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: ${userData.money.toLocaleString()}
⚪ 𝐂𝐎𝐌𝐌𝐎𝐍:
🐶 𝐏𝐮𝐩𝐩𝐲 → 🐕 💰 $2,000,000 | Lv.Max 50 | Power 98000
🐕 𝐃𝐨𝐠 → 🦮 💰 $25,000,000 | Lv.Max 75 | Power 190000
🐱 𝐊𝐢𝐭𝐭𝐞𝐧 → 🐈 💰 $2,500,000 | Lv.Max 50 | Power 103000
🐈 𝐂𝐚𝐭 → 🐈‍⬛ 💰 $30,000,000 | Lv.Max 75 | Power 207000
🐹 𝐇𝐚𝐦𝐬𝐭𝐞𝐫 💰 $2,200,000 | Lv.Max 40 | Power 110000
🐰 𝐁𝐮𝐧𝐧𝐲 → 🐇 💰 $1,800,000 | Lv.Max 40 | Power 102000
🐭 𝐌𝐨𝐮𝐬𝐞 💰 $1,000,000 | Lv.Max 35 | Power 85000
🐮 𝐂𝐚𝐥𝐟 → 🐄 💰 $3,000,000 | Lv.Max 45 | Power 135000
🐷 𝐏𝐢𝐠𝐥𝐞𝐭 → 🐗 💰 $1,500,000 | Lv.Max 40 | Power 115000
🐸 𝐅𝐫𝐨𝐠 💰 $1,200,000 | Lv.Max 38 | Power 105000
🦆 𝐃𝐮𝐜𝐤𝐥𝐢𝐧𝐠 → 🦅 💰 $1,000,000 | Lv.Max 35 | Power 82000
`;

const uncommonPets = `
🟢 𝐔𝐍𝐂𝐎𝐌𝐌𝐎𝐍:
🐇 𝐖𝐢𝐥𝐝 𝐑𝐚𝐛𝐛𝐢𝐭 💰 $20,000,000 | Lv.Max 60 | Power 198000
🐄 𝐂𝐨𝐰 💰 $18,000,000 | Lv.Max 65 | Power 220007
🦝 𝐑𝐚𝐜𝐜𝐨𝐨𝐧 💰 $25,000,000 | Lv.Max 60 | Power 190000
🦌 𝐃𝐞𝐞𝐫 → 🦌🌟 💰 $30,000,000 | Lv.Max 65 | Power 210000
🦜 𝐏𝐚𝐫𝐫𝐨𝐭 💰 $50,000,000 | Lv.Max 70 | Power 210005
`;

const rarePets = `
🔵 𝐑𝐀𝐑𝐄:
🦮 𝐒𝐞𝐫𝐯𝐢𝐜𝐞 𝐃𝐨𝐠 💰 $150,000,000 | Lv.Max 100 | Power 370000
🐈‍⬛ 𝐒𝐡𝐚𝐝𝐨𝐰 𝐂𝐚𝐭 💰 $200,000,000 | Lv.Max 100 | Power 3700000
🦊 𝐅𝐨𝐱 → 🦊❄️ 💰 $150,000,000 | Lv.Max 80 | Power 235000
🐺 𝐖𝐨𝐥𝐟 → 🐺👑 💰 $200,000,000 | Lv.Max 90 | Power 250000
`;

api.sendMessage(petShop, threadID);
api.sendMessage(uncommonPets, threadID);
api.sendMessage(rarePets, threadID);
