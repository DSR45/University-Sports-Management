/**
 * Converts any YouTube URL (watch, shorts, shortened, embed) or video link into a playable iframe embed URL.
 */
export function getYouTubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    let videoId = '';

    if (trimmed.includes('youtu.be/')) {
      const parts = trimmed.split('youtu.be/')[1];
      videoId = parts ? parts.split('?')[0].split('&')[0].split('#')[0] : '';
    } else if (trimmed.includes('/embed/')) {
      const parts = trimmed.split('/embed/')[1];
      videoId = parts ? parts.split('?')[0].split('&')[0].split('#')[0] : '';
    } else if (trimmed.includes('/shorts/')) {
      const parts = trimmed.split('/shorts/')[1];
      videoId = parts ? parts.split('?')[0].split('&')[0].split('#')[0] : '';
    } else if (trimmed.includes('v=')) {
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match && match[1]) {
        videoId = match[1];
      }
    }

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
    }
  }

  return trimmed;
}

/**
 * Extracts YouTube thumbnail URL from a YouTube URL if available
 */
export function getYouTubeThumbnailUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  let videoId = '';

  if (trimmed.includes('youtu.be/')) {
    videoId = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
  } else if (trimmed.includes('/embed/')) {
    videoId = trimmed.split('/embed/')[1]?.split('?')[0]?.split('&')[0];
  } else if (trimmed.includes('/shorts/')) {
    videoId = trimmed.split('/shorts/')[1]?.split('?')[0]?.split('&')[0];
  } else if (trimmed.includes('v=')) {
    const match = trimmed.match(/[?&]v=([^&]+)/);
    if (match) videoId = match[1];
  }

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
}