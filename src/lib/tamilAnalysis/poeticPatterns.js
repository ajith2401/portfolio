export const poeticPatterns = {
    alliteration: {
      patterns: [/^([\u0B80-\u0BFF])\1+/], // Tamil Unicode alliteration
      examples: [
        'கண்கள் கனவு கானம்', 
        'மலர் மழை மனம்', 
        'வானம் வாழ்வு வெற்றி'
      ]
    },
    metaphor: {
      pairs: [
        { literal: 'காதல்', metaphors: ['பூ', 'மழை', 'கடல்', 'நிலா'] },
        { literal: 'வாழ்க்கை', metaphors: ['பயணம்', 'நதி', 'கனவு', 'காற்று'] },
        { literal: 'துயர்', metaphors: ['கனல்', 'இரவொளி', 'சிலம்பு'] },
        { literal: 'சந்தோஷம்', metaphors: ['சூரியன்', 'மலர்', 'பனி', 'விழி'] }
      ]
    },
    rhyme: {
      examples: [
        'மலர் மனம் கனவு',
        'வாழ்வு வெற்றி செழிப்பு',
        'காற்று சுகம் சாந்தம்'
      ]
    },
    personification: {
      examples: [
        'காற்று பேசுகிறது', 
        'பூமி சிரிக்கிறது', 
        'மழை கதைக்கிறது', 
        'நதி நடிக்கிறது'
      ]
    }
  };
  