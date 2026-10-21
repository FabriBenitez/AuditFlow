export interface RealSocialProfile {
  platform: 'instagram' | 'tiktok';
  username: string;
  fullName: string;
  bio: string;
  followersCount: number;
  followingCount?: number;
  postsCount?: number;
  likesCount?: number;
  hasLinkInBio: boolean;
  linkUrl?: string;
  avatarUrl?: string;
  isLiveVerified: boolean;
  error?: string;
}

export function parseFollowerCount(val: string | number | undefined): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const clean = val.replace(/,/g, '').trim().toUpperCase();
  if (clean.endsWith('M')) {
    return Math.round(parseFloat(clean.slice(0, -1)) * 1_000_000);
  }
  if (clean.endsWith('K')) {
    return Math.round(parseFloat(clean.slice(0, -1)) * 1_000);
  }
  if (clean.endsWith('B')) {
    return Math.round(parseFloat(clean.slice(0, -1)) * 1_000_000_000);
  }
  const n = parseInt(clean, 10);
  return isNaN(n) ? 0 : n;
}

export async function fetchRealInstagramProfile(rawUsername: string): Promise<RealSocialProfile | null> {
  const username = rawUsername
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/\/$/, '')
    .trim();

  if (!username) return null;

  try {
    const url = `https://www.instagram.com/${username}/`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      next: { revalidate: 60 } // Cache breve de 60 segundos
    });

    if (res.status === 404) {
      return {
        platform: 'instagram',
        username,
        fullName: username,
        bio: '',
        followersCount: 0,
        hasLinkInBio: false,
        isLiveVerified: false,
        error: 'Cuenta no encontrada o privada'
      };
    }

    const text = await res.text();

    const ogDesc = text.match(/<meta (?:property="og:description"|name="description") content="([^"]+)"/i);
    const ogTitle = text.match(/<meta property="og:title" content="([^"]+)"/i);
    const ogImage = text.match(/<meta property="og:image" content="([^"]+)"/i);

    let fullName = '';
    const fnMatch = text.match(/"full_name":"([^"]+)"/);
    if (fnMatch) {
      try {
        fullName = JSON.parse(`"${fnMatch[1]}"`);
      } catch {
        fullName = fnMatch[1];
      }
    }

    let bio = '';
    const bioMatch = text.match(/"biography":"([^"]+)"/);
    if (bioMatch) {
      try {
        bio = JSON.parse(`"${bioMatch[1]}"`);
      } catch {
        bio = bioMatch[1];
      }
    }

    let extUrl = '';
    const extUrlMatch = text.match(/"external_url":"([^"]+)"/);
    if (extUrlMatch) {
      try {
        extUrl = JSON.parse(`"${extUrlMatch[1]}"`);
      } catch {
        extUrl = extUrlMatch[1];
      }
    }

    let rawFollowers = '0';
    let rawFollowing = '0';
    let rawPosts = '0';

    if (ogDesc) {
      const descContent = ogDesc[1];
      const matchStats = descContent.match(/([\d.,]+[KMBkmb]?)\s*(?:Followers|seguidores)[,\s]+([\d.,]+[KMBkmb]?)\s*(?:Following|siguiendo)[,\s]+([\d.,]+[KMBkmb]?)\s*(?:Posts|publicaciones)/i);
      if (matchStats) {
        rawFollowers = matchStats[1];
        rawFollowing = matchStats[2];
        rawPosts = matchStats[3];
      }
    }

    const cleanTitle = ogTitle ? ogTitle[1].replace(/&#064;/g, '@').replace(/&#x2022;/g, '•') : '';
    const finalFullName = fullName || (cleanTitle ? cleanTitle.split('(')[0].trim() : username);

    const hasLinkInBio = Boolean(
      extUrl || 
      bio.includes('http') || 
      bio.includes('link') || 
      bio.includes('.com') || 
      bio.includes('.ai') || 
      bio.includes('.ar')
    );

    return {
      platform: 'instagram',
      username,
      fullName: finalFullName,
      bio: bio || (ogDesc ? ogDesc[1].split('-')[1]?.trim() || '' : ''),
      followersCount: parseFollowerCount(rawFollowers),
      followingCount: parseFollowerCount(rawFollowing),
      postsCount: parseFollowerCount(rawPosts),
      hasLinkInBio,
      linkUrl: extUrl || undefined,
      avatarUrl: ogImage ? ogImage[1].replace(/&amp;/g, '&') : undefined,
      isLiveVerified: true
    };
  } catch (err: unknown) {
    console.error('Error scraping Instagram:', err);
    return null;
  }
}

export async function fetchRealTikTokProfile(rawUsername: string): Promise<RealSocialProfile | null> {
  const username = rawUsername
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, '')
    .replace(/\/$/, '')
    .trim();

  if (!username) return null;

  try {
    const url = `https://www.tiktok.com/@${username}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      next: { revalidate: 60 }
    });

    if (res.status === 404) {
      return {
        platform: 'tiktok',
        username,
        fullName: username,
        bio: '',
        followersCount: 0,
        hasLinkInBio: false,
        isLiveVerified: false,
        error: 'Cuenta no encontrada'
      };
    }

    const html = await res.text();
    const match = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);

    if (match) {
      const data = JSON.parse(match[1]);
      const userDetail = data['__DEFAULT_SCOPE__']?.['webapp.user-detail'];
      if (userDetail?.userInfo) {
        const u = userDetail.userInfo.user;
        const s = userDetail.userInfo.stats;
        const bio = u?.signature || '';
        const bioLink = u?.bioLink?.link || '';
        const hasLinkInBio = Boolean(bioLink || bio.includes('http') || bio.includes('.ai') || bio.includes('link') || bio.includes('.com'));

        return {
          platform: 'tiktok',
          username,
          fullName: u?.nickname || username,
          bio,
          followersCount: s?.followerCount || 0,
          followingCount: s?.followingCount || 0,
          likesCount: s?.heartCount || 0,
          postsCount: s?.videoCount || 0,
          hasLinkInBio,
          linkUrl: bioLink || undefined,
          avatarUrl: u?.avatarLarger || u?.avatarMedium || undefined,
          isLiveVerified: true
        };
      }
    }

    return null;
  } catch (err: unknown) {
    console.error('Error scraping TikTok:', err);
    return null;
  }
}
