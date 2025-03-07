'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Book, Music, Video, ChevronRight, ShoppingCart, X } from 'lucide-react';

const publications = [
  {
    id: 1,
    title: "அன்புடையவளுக்கும் அன்புக்குரியவளுக்கும்",
    publisher: "விஜய பதிப்பகம்",
    year: "2017",
    price: "100",
    image: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197427/books/aznatozjb3eaqfavh3nb.jpg",
    description: "A collection of poems exploring themes of love and feminism",
    purchaseLinks: null
  },
  {
    id: 2,
    title: "சிப்பிக்குள் சிந்தா மழை",
    publisher: "கரங்கள் பதிப்பகம்",
    price: "100",
    image: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197363/books/qdfklipjfjayf8qmscrr.jpg",
    description: "Poetry that delves into social justice and equality",
    purchaseLinks: null
  },
  {
    id: 3,
    title: "ஒரு பைத்தியக்காரனின் டைரிக் குறிப்புகள்",
    publisher: "நாடோடி பதிப்பகம்",
    price: "150",
    image: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197380/books/lvghl4zaseludx7zt5dk.jpg",
    description: "A unique perspective on life through poetry",
    purchaseLinks: [
      { name: "Panuval", url: "https://www.panuval.com/oru-paithiyakkaranin-dairy-kurippukal-10026753" },
    ]
  },
  {
    id: 4,
    title: "முற்றிய பிரியத்தின் வற்றாத துளி",
    publisher: "கரங்கள் பதிப்பகம்",
    price: "50",
    image: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197444/books/udbuiab0gb3dpxxcqcpv.jpg",
    description: "Exploring the depths of human emotions",
    purchaseLinks: null
  },
  {
    id: 5,
    title: "ஆண்டெனா மீதமர்ந்த காக்கை",
    publisher: "மகிழினி பதிப்பகம்",
    price: "120",
    image: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197446/books/syxyyt3giwcoeq5m1wds.jpg",
    description: "Contemporary poetry with a modern perspective",
    purchaseLinks: [
      { name: "Amazon", url: "https://www.amazon.in/Antenna-Meedhamarndha-Kakkai-Vaanawill/dp/B0DCZVKSFZ" },
      { name: "Books Grub", url: "https://booksgrub.com/product/antenna-meedhamarndha-kakkai" }
    ]
  }
];

const musicVideos = [
  {
    title: "நாளும் புதிது",
    link: "https://youtu.be/CC_1fzAUmUc",
    thumbnail: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741198342/youtube_songs/ht8d48m8ugzorirnz7ab.png"
  },
  {
    title: "தாலாட்டு",
    link: "https://youtu.be/3YlqopnlVXA",
    thumbnail: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741198879/youtube_songs/i9ad7cd6o4aiwhfjqohf.png"
  },
  {
    title: "அன்பின் கீர்த்தனை",
    link: "https://youtu.be/TWW-VgZMrYs",
    thumbnail: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741199027/youtube_songs/jilq54jvngutbkw1ps4z.png"
  },
  {
    title: "காட்டுச் சிறுக்கி",
    link: "https://youtu.be/zGxt7DU9Sl4",
    thumbnail: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741199188/youtube_songs/db4kyg5msvxiy4enkvjq.png"
  }
];

const SpotlightPage = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/90">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] mix-blend-overlay opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-custom-56 font-dm-sans font-semibold text-foreground mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-4">
              Creative <span className="text-primary-400">Spotlight</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-600">
              Exploring themes of feminism, social justice, and love through poetry, music, and visual arts.
            </p>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Book className="w-8 h-8 text-primary-500" />
            <h2 className="text-3xl font-bold text-foreground">Publications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((book) => (
              <article 
                key={book.id}
                className="group clean-container p-6 rounded-xl hover:shadow-lg transition-all duration-300
                  hover:translate-y-[-4px] cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative h-80 mb-6 overflow-hidden rounded-lg">
                <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  console.error(`Failed to load image: ${book.image}`);
                  e.target.src = '/fallback-image.jpg'; // A local fallback
                }}
              />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm">Click to view details</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <div className="space-y-2 text-secondary-600">
                  <p><span className="font-medium">Publisher:</span> {book.publisher}</p>
                  <p><span className="font-medium">Price:</span> ₹{book.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Music & Videos Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Music className="w-8 h-8 text-primary-500" />
            <h2 className="text-3xl font-bold text-foreground">Lyrics & Direction</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {musicVideos.map((video, index) => (
            <a
              key={index}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl aspect-video clean-container"
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent/10 
                flex items-end p-4">
                <div className="w-full">
                  <h3 className="text-white font-medium mb-2 text-shadow">{video.title}</h3>
                  <div className="flex items-center text-white text-sm bg-primary-500/80 px-2 py-1 rounded-md inline-flex">
                    <span>Watch on YouTube</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        </div>
      </section>

      {/* Book Details Modal */}
      {selectedBook && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedBook(null)}
        >
          <div 
            className="clean-container rounded-2xl max-w-5xl w-full my-8 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 hover:bg-background/70 transition-colors"
              aria-label="Close"
            >
            <X className="w-6 h-6 text-foreground" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
              {/* Book Image */}
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={selectedBook.image}
                  alt={selectedBook.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Book Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                    {selectedBook.title}
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-xl font-semibold text-primary-600">
                      ₹{selectedBook.price}
                    </span>
                    <span className="text-secondary-600">
                      • {selectedBook.publisher}
                    </span>
                  </div>
                </div>

                <div className="prose prose-secondary max-w-full">
                  <p className="text-secondary-700">{selectedBook.description}</p>
                </div>

                {selectedBook.purchaseLinks && selectedBook.purchaseLinks.length > 0 && (
                  <div className="pt-4 border-t border-secondary-200">
                    <p className="text-sm font-medium text-secondary-600 mb-3">
                      Available for Purchase:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedBook.purchaseLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 
                            bg-primary-50 text-primary-700 rounded-full
                            hover:bg-primary-100 transition-colors text-sm
                            shadow-sm hover:shadow-md"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {link.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SpotlightPage;