import { ResolvedVideo, VideoPlatform } from '@/types';

/**
 * Normaliza y detecta la plataforma de un enlace de video
 */
export function detectVideoPlatform(url: string): VideoPlatform | null {
  const clean = url.trim().toLowerCase();
  if (clean.includes('tiktok.com') || clean.includes('tikwm.com')) {
    return 'tiktok';
  }
  if (clean.includes('instagram.com') || clean.includes('instagr.am')) {
    return 'instagram';
  }
  return null;
}

/**
 * Extrae el shortcode de un Reel o Post de Instagram
 */
export function extractInstagramShortcode(url: string): string | null {
  const match = url.match(/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
}

/**
 * Resuelve la metadata y el stream directo de un video de TikTok
 */
export async function resolveTikTokVideo(url: string): Promise<ResolvedVideo> {
  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url.trim())}`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      },
      next: { revalidate: 3600 } // Cache de 1 hora
    });

    const data = await res.json();

    if (data.code === 0 && data.data) {
      const d = data.data;
      const videoId = String(d.id || d.video_id || `tt-${Date.now()}`);

      return {
        id: videoId,
        platform: 'tiktok',
        originalUrl: url,
        title: d.title || 'Video de TikTok sin título',
        author: {
          username: d.author?.unique_id || 'creador',
          nickname: d.author?.nickname || d.author?.unique_id,
          avatarUrl: d.author?.avatar,
        },
        coverUrl: d.cover || d.origin_cover || '',
        videoUrl: d.play || undefined,
        embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
        duration: d.duration || 0,
        metrics: {
          views: d.play_count || 0,
          likes: d.digg_count || 0,
          comments: d.comment_count || 0,
          shares: d.share_count || 0,
        },
        music: d.music_info ? {
          title: d.music_info.title,
          author: d.music_info.author,
        } : undefined
      };
    }
  } catch (err) {
    console.warn('TikWM API fetch failed, usando fallback embed:', err);
  }

  // Fallback si la API de streaming no responde
  const idMatch = url.match(/video\/(\d+)/i) || url.match(/\/(\d{15,25})/);
  const fallbackId = idMatch ? idMatch[1] : `tt-${Date.now()}`;

  return {
    id: fallbackId,
    platform: 'tiktok',
    originalUrl: url,
    title: 'TikTok Video (Reproductor Oficial)',
    author: { username: 'tiktok_creator' },
    coverUrl: '',
    embedUrl: `https://www.tiktok.com/embed/v2/${fallbackId}`,
    metrics: { views: 0, likes: 0 }
  };
}

/**
 * Resuelve y prepara el reproductor embed oficial de un Reel de Instagram
 */
export async function resolveInstagramReel(url: string): Promise<ResolvedVideo> {
  const shortcode = extractInstagramShortcode(url);
  if (!shortcode) {
    throw new Error('No se pudo encontrar un identificador de Reel válido en la URL de Instagram.');
  }

  const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;

  let title = `Reel de Instagram (${shortcode})`;
  let username = 'instagram_creator';

  try {
    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const html = await res.text();
      // Extraer título o usuario si viene en meta tags
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch && !titleMatch[1].includes('Instagram')) {
        title = titleMatch[1].replace(/on Instagram/i, '').trim();
      }

      const userMatch = html.match(/@([a-zA-Z0-9._]+)/);
      if (userMatch) {
        username = userMatch[1];
      }
    }
  } catch (err) {
    console.warn('Error fetching IG embed page metadata:', err);
  }

  return {
    id: shortcode,
    platform: 'instagram',
    originalUrl: url,
    title,
    author: {
      username,
      nickname: username
    },
    coverUrl: '',
    embedUrl,
    metrics: {
      views: 0,
      likes: 0
    }
  };
}

/**
 * Punto de entrada único para resolver cualquier enlace de video
 */
export async function resolveVideo(url: string): Promise<ResolvedVideo> {
  const platform = detectVideoPlatform(url);
  if (!platform) {
    throw new Error('La URL proporcionada no corresponde a un video válido de TikTok o Instagram.');
  }

  if (platform === 'tiktok') {
    return await resolveTikTokVideo(url);
  }

  return await resolveInstagramReel(url);
}
