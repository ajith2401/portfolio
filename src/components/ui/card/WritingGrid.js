import Image from 'next/image';
import Link from 'next/link';

const WritingGrid = ({ writings }) => {
  return (
    <div className="mx-5 lg:mx-20 mt-[604px]">
      <div className="flex flex-wrap gap-y-16 gap-x-6 max-w-[1280px]">
        {writings.map((writing) => (
          <Link 
            href={`/quill/${writing._id}`} 
            key={writing._id}
            className="w-full md:w-[410.67px]"
          >
            <div className="flex flex-col gap-6">
              {/* Image Container */}
              <div className="relative w-full h-[231.38px] rounded-lg overflow-hidden">
                <Image
                  src={writing.images?.medium || '/placeholder.jpg'}
                  alt={writing.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 410px"
                  className="object-cover"
                  priority={false}
                  quality={75}
                />
              </div>

              {/* Title */}
              <h3 className="font-work-sans text-lg font-medium leading-[21px] text-[#2E2E2E]">
                {writing.title}
              </h3>

              {/* Category and Date Container */}
              <div className="flex justify-between items-center">
                {/* Category Tag */}
                <div className="flex items-center justify-center px-2 py-1.5 bg-[rgba(140,140,140,0.1)] rounded">
                  <span className="font-work-sans text-xs font-medium leading-[14px] text-[#606062]">
                    Article
                  </span>
                </div>

                {/* Date */}
                <span className="font-work-sans text-xs font-medium leading-[14px] text-[#606062]">
                  {formatDate(writing.createdAt)}
                </span>
              </div>

              {/* Divider Line */}
              <div className="w-full border-b border-dashed border-[#021720] opacity-25" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Date formatter function
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default WritingGrid;