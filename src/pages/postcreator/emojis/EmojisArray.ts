export interface EmojiReaction {
    id: string;
    name: string;
    content: string;
}

export const emojiReactions: EmojiReaction[] = [
    // Emociones
    { id: "laughing", name: "Laughing", content: "😂" },
    { id: "crying", name: "Crying", content: "😢" },
    { id: "thinking", name: "Thinking", content: "🤔" },
    { id: "screaming", name: "Screaming", content: "😱" },
    { id: "face_with_tears_of_joy", name: "Tears of Joy", content: "😂" },
    { id: "smiling_face_with_sunglasses", name: "Cool", content: "😎" },
    { id: "winking_face", name: "Winking", content: "😉" },
    { id: "shocked_face", name: "Shocked", content: "😲" },
    { id: "grinning_face", name: "Grinning", content: "😀" },
    { id: "money_face", name: "Money Face", content: "🤑" },
    { id: "crying_face", name: "Crying Face", content: "😭" },
    { id: "sleeping_face", name: "Sleeping Face", content: "😴" },
    { id: "angry_face", name: "Angry Face", content: "😡" },
    { id: "poop", name: "Poop", content: "💩" },
    { id: "exploding_head", name: "Exploding Head", content: "🤯" },

    // Manos
    { id: "thumbs_up", name: "Thumbs Up", content: "👍" },
    { id: "clapping", name: "Clapping", content: "👏" },
    { id: "ok_hand", name: "OK Hand", content: "👌" },
    { id: "praying_hands", name: "Praying", content: "🙏" },
    { id: "raised_hand", name: "Raised Hand", content: "✋" },
    { id: "wave", name: "Waving Hand", content: "👋" },
    { id: "peace_sign", name: "Peace Sign", content: "✌️" },
    { id: "victory_hand", name: "Victory Hand", content: "✌" },
    { id: "muscle", name: "Muscle", content: "💪" },

    // Objetos y símbolos
    { id: "heart", name: "Heart", content: "❤️" },
    { id: "fire", name: "Fire", content: "🔥" },
    { id: "star", name: "Star", content: "⭐" },
    { id: "party_popper", name: "Party Popper", content: "🎉" },
    { id: "100", name: "100", content: "💯" },
    { id: "collision", name: "Boom", content: "💥" },
    { id: "balloon", name: "Balloon", content: "🎈" },
    { id: "trophy", name: "Trophy", content: "🏆" },
    { id: "medal", name: "Medal", content: "🥇" },
    { id: "rainbow", name: "Rainbow", content: "🌈" },

    // Animales
    { id: "dog", name: "Dog", content: "🐶" },
    { id: "cat", name: "Cat", content: "🐱" },
    { id: "monkey", name: "Monkey", content: "🐒" },
    { id: "lion", name: "Lion", content: "🦁" },
    { id: "fish", name: "Fish", content: "🐟" },
    { id: "alien", name: "Alien", content: "👽" },
    { id: "robot", name: "Robot", content: "🤖" },
    { id: "skull", name: "Skull", content: "💀" },

    // Transporte y viajes
    { id: "rocket", name: "Rocket", content: "🚀" },
    { id: "airplane", name: "Airplane", content: "✈️" },
    { id: "car", name: "Car", content: "🚗" },
    { id: "bicycle", name: "Bicycle", content: "🚲" },

    // Comida y bebida
    { id: "apple", name: "Apple", content: "🍎" },
    { id: "pizza", name: "Pizza", content: "🍕" },
    { id: "hamburger", name: "Hamburger", content: "🍔" },
    { id: "fries", name: "Fries", content: "🍟" },
    { id: "cake", name: "Cake", content: "🎂" },
    { id: "beer", name: "Beer", content: "🍺" },
    { id: "coffee", name: "Coffee", content: "☕" },
];
